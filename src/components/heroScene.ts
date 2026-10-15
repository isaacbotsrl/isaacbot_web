// The hero animation: an Ardennes-like rover catches a falling apple with its arm, stows it in the
// tray, drives on, and sets it down on the ground. Loaded on demand by RoverArm3D.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Joints = [yaw: number, shoulder: number, elbow: number, wrist: number];
type Tool = "up" | "down";

// Key points, in rover coordinates (metres).
const ARM_BASE = new THREE.Vector3(-0.05, 0.42, 0);
const TRAY = new THREE.Vector3(-0.33, 0.487, 0);
const CATCH = new THREE.Vector3(0.3, 1.04, -0.3);
const GROUND = new THREE.Vector3(0, 0.055, 0.6);
const SHOULDER = ARM_BASE.clone().add(new THREE.Vector3(0, 0.14, 0));

const UPPER_ARM = 0.4;
const FOREARM = 0.36;
const TOOL = 0.15;
const WHEEL_RADIUS = 0.19;
const DROP_HEIGHT = 2.6;
const GRAVITY = 9.81;

/** Joint angles that put the tool tip on `target`, pointing up or down. */
function solveArm(target: THREE.Vector3, tool: Tool, yawHint = 0): Joints {
  const pitch = tool === "up" ? Math.PI / 2 : -Math.PI / 2;
  const wristY = target.y - TOOL * Math.sin(pitch);
  const dx = target.x - SHOULDER.x;
  const dz = target.z - SHOULDER.z;
  // Pick the yaw closest to the hint, so the arm never spins the long way round.
  let yaw = Math.atan2(-dz, dx);
  while (yaw - yawHint > Math.PI) yaw -= 2 * Math.PI;
  while (yaw - yawHint < -Math.PI) yaw += 2 * Math.PI;
  const reach = Math.hypot(dx, dz);
  const rise = wristY - SHOULDER.y;
  const elbow = -Math.acos(
    THREE.MathUtils.clamp(
      (reach * reach + rise * rise - UPPER_ARM * UPPER_ARM - FOREARM * FOREARM) / (2 * UPPER_ARM * FOREARM),
      -1,
      1,
    ),
  );
  const shoulder =
    Math.atan2(rise, reach) - Math.atan2(FOREARM * Math.sin(elbow), UPPER_ARM + FOREARM * Math.cos(elbow));
  return [yaw, shoulder, elbow, pitch - shoulder - elbow];
}

const HOME: Joints = [0, 1.35, -2.5, -Math.PI / 2 + 1.15];

const smootherstep = (t: number) => t * t * t * (10 + t * (-15 + 6 * t));

// Driving: accelerate at DRIVE_ACCEL up to DRIVE_SPEED, cruise, brake.
const DRIVE_ACCEL = 0.8;
const DRIVE_SPEED = 0.9;
const RAMP_DIST = (DRIVE_SPEED * DRIVE_SPEED) / DRIVE_ACCEL; // accelerating plus braking

function driveDuration(dist: number) {
  return dist <= RAMP_DIST
    ? 2 * Math.sqrt(dist / DRIVE_ACCEL)
    : (2 * DRIVE_SPEED) / DRIVE_ACCEL + (dist - RAMP_DIST) / DRIVE_SPEED;
}

function driveProfile(dist: number, t: number) {
  const total = driveDuration(dist);
  const peak = Math.min(DRIVE_SPEED, Math.sqrt(DRIVE_ACCEL * dist));
  const ramp = peak / DRIVE_ACCEL;
  t = THREE.MathUtils.clamp(t, 0, total);
  if (t < ramp) return { d: 0.5 * DRIVE_ACCEL * t * t, a: DRIVE_ACCEL, v: DRIVE_ACCEL * t };
  if (t > total - ramp) {
    const left = total - t;
    return { d: dist - 0.5 * DRIVE_ACCEL * left * left, a: t >= total ? 0 : -DRIVE_ACCEL, v: DRIVE_ACCEL * left };
  }
  return { d: 0.5 * DRIVE_ACCEL * ramp * ramp + peak * (t - ramp), a: 0, v: peak };
}

type Segment = { t0: number; t1: number } & (
  | { kind: "hold"; q: Joints }
  | { kind: "joint"; a: Joints; b: Joints }
  | { kind: "line"; a: THREE.Vector3; b: THREE.Vector3; tool: Tool; yaw: number }
  | { kind: "drive"; q: Joints; d0: number; dist: number }
);

type Events = {
  catch: number;
  trayRelease: number;
  trayPick: number;
  groundRelease: number;
  /** Distance driven when the apple is set down. */
  groundD: number;
  total: number;
};

/** The whole loop as timed segments, plus gripper keyframes [time, opening 0..1]. */
const timeline = (() => {
  const segs: Segment[] = [];
  const grip: [number, number][] = [[0, 0]];
  const ev: Events = { catch: 0, trayRelease: 0, trayPick: 0, groundRelease: 0, groundD: 0, total: 0 };
  let t = 0;
  let q = HOME;
  let driven = 0;

  const hold = (dt: number) => {
    segs.push({ kind: "hold", t0: t, t1: t + dt, q });
    t += dt;
  };
  const moveJoints = (b: Joints) => {
    const dt = Math.max(0.9, (1.875 * Math.max(...b.map((v, i) => Math.abs(v - q[i])))) / 2.4);
    segs.push({ kind: "joint", t0: t, t1: t + dt, a: q, b });
    t += dt;
    q = b;
  };
  const moveLine = (a: THREE.Vector3, b: THREE.Vector3, tool: Tool) => {
    const dt = Math.max(0.5, (1.875 * a.distanceTo(b)) / 0.35);
    const yaw = q[0];
    segs.push({ kind: "line", t0: t, t1: t + dt, a, b, tool, yaw });
    t += dt;
    q = solveArm(b, tool, yaw);
  };
  const drive = (dist: number) => {
    const dt = driveDuration(dist);
    segs.push({ kind: "drive", t0: t, t1: t + dt, q, d0: driven, dist });
    t += dt;
    driven += dist;
  };
  const gripTo = (open: number, dt = 0.35) => {
    grip.push([t, grip[grip.length - 1][1]], [t + dt, open]);
  };
  const above = (p: THREE.Vector3) => p.clone().add(new THREE.Vector3(0, 0.15, 0));

  // Catch the apple.
  hold(0.8);
  gripTo(1, 0.6);
  moveJoints(solveArm(CATCH, "up", q[0]));
  ev.catch = t + 0.7;
  hold(0.7);
  gripTo(0, 0.25);
  hold(0.55);
  // Stow it in the tray.
  moveJoints(solveArm(above(TRAY), "down", Math.PI));
  moveLine(above(TRAY), TRAY, "down");
  ev.trayRelease = t;
  gripTo(1, 0.3);
  hold(0.35);
  moveLine(TRAY, above(TRAY), "down");
  gripTo(0, 0.6);
  moveJoints(HOME);
  hold(0.3);
  // Deliver.
  drive(2.4);
  hold(0.5);
  gripTo(1, 0.6);
  moveJoints(solveArm(above(TRAY), "down", -Math.PI));
  moveLine(above(TRAY), TRAY, "down");
  gripTo(0, 0.3);
  ev.trayPick = t + 0.2;
  hold(0.35);
  moveLine(TRAY, above(TRAY), "down");
  moveJoints(solveArm(above(GROUND), "down", q[0]));
  moveLine(above(GROUND), GROUND, "down");
  ev.groundRelease = t;
  ev.groundD = driven;
  gripTo(1, 0.3);
  hold(0.35);
  moveLine(GROUND, above(GROUND), "down");
  gripTo(0, 0.6);
  // Back home by the nearest turn, then drive off.
  moveJoints([HOME[0] + 2 * Math.round((q[0] - HOME[0]) / (2 * Math.PI)) * Math.PI, HOME[1], HOME[2], HOME[3]]);
  hold(0.4);
  drive(2.8);
  hold(0.6);
  ev.total = t;
  return { segs, grip, ev };
})();

function material(roughness: number, color = 0x0d0d10, metalness = 0.15) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

const materials = {
  body: material(0.42),
  satin: material(0.48, 0x141418, 0.25),
  rubber: material(0.85, 0x0a0a0c, 0),
};

function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, position?: [number, number, number]) {
  const m = new THREE.Mesh(geometry, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  if (position) m.position.set(...position);
  return m;
}

/** A capsule of the given length along +x, starting at the origin. */
function link(length: number, radius: number) {
  const geo = new THREE.CapsuleGeometry(radius, length, 6, 20);
  geo.rotateZ(Math.PI / 2);
  geo.translate(length / 2, 0, 0);
  return geo;
}

/** A joint housing: a cylinder along z. */
function joint(radius: number, length: number) {
  const geo = new THREE.CylinderGeometry(radius, radius, length, 32);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/** Critically-ish damped spring, for body pitch, squat and arm sway. */
class Spring {
  x = 0;
  v = 0;

  constructor(
    private w: number,
    private z: number,
  ) {}

  step(target: number, dt: number) {
    const n = Math.max(1, Math.ceil(dt / 0.004));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      this.v += (this.w * this.w * (target - this.x) - 2 * this.z * this.w * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
}

function buildFloor() {
  const plane = new THREE.PlaneGeometry(12, 12);
  plane.rotateX(-Math.PI / 2);
  // A dot grid that fades out with distance; uOffset scrolls it as the rover drives.
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOffset: { value: 0 }, uColor: { value: new THREE.Color(0xb9b9be) } },
    vertexShader: `
      varying vec2 vXZ;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vXZ = w.xz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: `
      uniform float uOffset;
      uniform vec3 uColor;
      varying vec2 vXZ;
      void main() {
        float s = 0.12;
        vec2 p = vec2(vXZ.x + uOffset, vXZ.y) / s;
        vec2 cell = fract(p) - 0.5;
        float d = length(cell);
        float aa = fwidth(d) * 1.2;
        float dot_ = 1.0 - smoothstep(0.075 - aa, 0.075 + aa, d);
        float fade = 1.0 - smoothstep(0.55, 1.55, length(vXZ * vec2(0.8, 1.1)));
        gl_FragColor = vec4(uColor, dot_ * fade);
      }`,
  });
  const dots = new THREE.Mesh(plane, mat);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6).rotateX(-Math.PI / 2),
    new THREE.ShadowMaterial({ opacity: 0.2 }),
  );
  shadow.receiveShadow = true;
  shadow.position.y = 0.001;
  return { dots, shadow, material: mat };
}

function buildWheel() {
  const tire = new THREE.Group();
  // Tyre cross-section with rounded shoulders, turned into a solid.
  const profile = [new THREE.Vector2(0.11, -0.075)];
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    profile.push(new THREE.Vector2(0.15 + 0.04 * Math.cos(a), -0.075 + 0.04 + 0.04 * Math.sin(a)));
  }
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    profile.push(new THREE.Vector2(0.15 + 0.04 * Math.cos(a), 0.075 - 0.04 + 0.04 * Math.sin(a)));
  }
  profile.push(new THREE.Vector2(0.11, 0.075));
  tire.add(mesh(new THREE.LatheGeometry(profile, 48), materials.rubber));

  // Staggered tread lugs on both halves of the tyre.
  const lug = new RoundedBoxGeometry(0.035, 0.018, 0.069, 2, 0.006);
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    for (const side of [-1, 1]) {
      const m = mesh(lug, materials.rubber);
      const y = 0.15 * side * 0.24;
      const offset = 0.08 * side;
      m.position.set(0.194 * Math.cos(a + offset), y, 0.194 * Math.sin(a + offset));
      m.rotation.set(0, -(a + offset), 0);
      m.rotateZ(Math.PI / 2);
      m.rotateX(0.35 * side);
      tire.add(m);
    }
  }

  tire.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.135, 40), materials.satin));
  const bolt = new THREE.CylinderGeometry(0.009, 0.009, 0.012, 10);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    for (const side of [-1, 1]) {
      tire.add(mesh(bolt, materials.body, [0.06 * Math.cos(a), 0.15 * side * 0.45, 0.06 * Math.sin(a)]));
    }
  }
  tire.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.144, 20), materials.body));
  tire.rotation.x = Math.PI / 2;

  const wheel = new THREE.Group();
  wheel.add(tire);
  return wheel;
}

function buildArm() {
  const root = new THREE.Group();
  root.add(mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.025, 40), materials.satin, [0, 0.0125, 0]));

  const yaw = new THREE.Group();
  yaw.position.y = 0.025;
  root.add(yaw);
  yaw.add(mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.09, 40), materials.body, [0, 0.045, 0]));
  for (const z of [-0.05, 0.05]) {
    yaw.add(mesh(new RoundedBoxGeometry(0.09, 0.09, 0.02, 2, 0.008), materials.body, [0, 0.14 - 0.045, z]));
  }

  const shoulder = new THREE.Group();
  shoulder.position.y = 0.14 - 0.025;
  yaw.add(shoulder);
  shoulder.add(mesh(joint(0.058, 0.08), materials.satin));
  shoulder.add(mesh(link(UPPER_ARM, 0.036), materials.body));

  const elbow = new THREE.Group();
  elbow.position.x = UPPER_ARM;
  shoulder.add(elbow);
  elbow.add(mesh(joint(0.048, 0.1), materials.satin));
  elbow.add(mesh(link(FOREARM, 0.029), materials.body));

  const wrist = new THREE.Group();
  wrist.position.x = FOREARM;
  elbow.add(wrist);
  wrist.add(mesh(joint(0.036, 0.075), materials.satin));
  wrist.add(mesh(new RoundedBoxGeometry(0.05, 0.05, 0.05, 2, 0.01), materials.body, [0.03, 0, 0]));
  wrist.add(mesh(new RoundedBoxGeometry(0.035, 0.04, 0.17, 2, 0.008), materials.satin, [0.065, 0, 0]));

  const finger = new RoundedBoxGeometry(0.115, 0.034, 0.016, 2, 0.006);
  finger.translate(0.0575, 0, 0);
  const fingers = [-1, 1].map((side) => {
    const m = mesh(finger, materials.body);
    m.position.set(0.075, 0, 0.06 * side);
    wrist.add(m);
    return m;
  });

  // Where a held apple sits, between the fingertips.
  const grasp = new THREE.Object3D();
  grasp.position.x = TOOL;
  wrist.add(grasp);

  return { root, yaw, shoulder, elbow, wrist, fingers, grasp };
}

function buildRover() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const wheels: THREE.Group[] = [];
  for (const x of [-0.3, 0.3]) {
    for (const z of [-0.37, 0.37]) {
      const wheel = buildWheel();
      wheel.position.set(x, WHEEL_RADIUS, z);
      root.add(wheel);
      wheels.push(wheel);
    }
  }

  body.add(mesh(new RoundedBoxGeometry(0.88, 0.26, 0.56, 4, 0.025), materials.body, [0, 0.285, 0]));
  const rail = (w: number, d: number, x: number, z: number) =>
    body.add(mesh(new RoundedBoxGeometry(w, 0.026, d, 2, 0.008), materials.satin, [x, 0.418, z]));
  rail(0.9, 0.03, 0, 0.27);
  rail(0.9, 0.03, 0, -0.27);
  rail(0.03, 0.57, 0.44, 0);
  rail(0.03, 0.57, -0.44, 0);
  body.add(mesh(new RoundedBoxGeometry(0.05, 0.08, 0.5, 2, 0.015), materials.satin, [0.465, 0.24, 0]));
  for (const x of [-0.3, 0.3]) {
    const axle = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.66, 16), materials.satin, [x, WHEEL_RADIUS, 0]);
    axle.rotation.x = Math.PI / 2;
    body.add(axle);
  }

  // Sensor mast with a spinning LiDAR on top.
  const mast = new THREE.Group();
  mast.position.set(0.35, 0.42, 0);
  for (const z of [-0.055, 0.055]) {
    mast.add(mesh(new RoundedBoxGeometry(0.03, 0.3, 0.03, 2, 0.006), materials.satin, [0, 0.15, z]));
  }
  mast.add(mesh(new RoundedBoxGeometry(0.1, 0.02, 0.15, 2, 0.006), materials.satin, [0, 0.305, 0]));
  mast.add(mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.04, 32), materials.body, [0, 0.335, 0]));
  const lidar = new THREE.Group();
  lidar.position.set(0, 0.355, 0);
  lidar.add(mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.055, 32), materials.satin, [0, 0.0275, 0]));
  lidar.add(mesh(new RoundedBoxGeometry(0.012, 0.03, 0.04, 2, 0.004), materials.body, [0.052, 0.028, 0]));
  lidar.add(mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.012, 32), materials.body, [0, 0.061, 0]));
  mast.add(lidar);
  body.add(mast);

  const tray = new THREE.Group();
  tray.position.set(TRAY.x, 0.42, TRAY.z);
  tray.add(mesh(new RoundedBoxGeometry(0.2, 0.012, 0.26, 2, 0.004), materials.satin, [0, 0.006, 0]));
  const wall = (w: number, d: number, x: number, z: number) =>
    tray.add(mesh(new RoundedBoxGeometry(w, 0.05, d, 2, 0.005), materials.satin, [x, 0.03, z]));
  wall(0.2, 0.012, 0, 0.125);
  wall(0.2, 0.012, 0, -0.125);
  wall(0.012, 0.26, 0.095, 0);
  wall(0.012, 0.26, -0.095, 0);
  body.add(tray);

  const arm = buildArm();
  arm.root.position.copy(ARM_BASE);
  body.add(arm.root);

  return { root, body, wheels, lidar, arm };
}

function buildApple() {
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 28; i++) {
    const a = -Math.PI / 2 + (i / 28) * Math.PI;
    const r = Math.cos(a) * (1 + 0.06 * Math.sin(a)) * (a > 0 ? 1 - 0.08 * Math.sin(a) ** 6 : 1);
    let y = 0.9 * Math.sin(a);
    // Dimples at the stem and the bottom.
    y -= 0.18 * Math.exp(-((Math.cos(a) / 0.3) ** 2)) * Math.sign(Math.sin(a));
    profile.push(new THREE.Vector2(0.055 * Math.max(r, 0.001), 0.055 * y));
  }
  const group = new THREE.Group();
  const mat = material(0.32, 0x0e0e11, 0.05);
  mat.transparent = true;
  group.add(mesh(new THREE.LatheGeometry(profile, 40), mat));
  const stem = mesh(new THREE.CylinderGeometry(0.0035, 0.005, 0.035, 8), mat, [0.003, 0.044, 0]);
  stem.rotation.z = -0.25;
  group.add(stem);
  const leafGeo = new THREE.SphereGeometry(1, 16, 8);
  leafGeo.scale(0.022, 0.003, 0.01);
  const leaf = mesh(leafGeo, mat, [0.02, 0.05225, 0]);
  leaf.rotation.set(0.2, 0.4, 0.35);
  group.add(leaf);
  return { group, material: mat };
}

/** Joints, distance driven and drive acceleration at time t of the loop. */
function poseAt(t: number) {
  const seg = timeline.segs.find((s) => t < s.t1) ?? timeline.segs[timeline.segs.length - 1];
  const k = THREE.MathUtils.clamp((t - seg.t0) / (seg.t1 - seg.t0), 0, 1);
  let q: Joints;
  let d = 0;
  let accel = 0;
  let speed = 0;
  switch (seg.kind) {
    case "hold":
      q = seg.q;
      break;
    case "joint": {
      const e = smootherstep(k);
      q = seg.a.map((v, i) => v + (seg.b[i] - v) * e) as Joints;
      break;
    }
    case "line":
      q = solveArm(seg.a.clone().lerp(seg.b, smootherstep(k)), seg.tool, seg.yaw);
      break;
    case "drive": {
      q = seg.q;
      const p = driveProfile(seg.dist, t - seg.t0);
      d = seg.d0 + p.d;
      accel = p.a;
      speed = p.v;
    }
  }
  if (seg.kind !== "drive") {
    for (const s of timeline.segs) if (s.kind === "drive" && s.t1 <= t) d = s.d0 + s.dist;
  }
  // The arm gives a little as it catches the apple.
  const sinceCatch = t - timeline.ev.catch;
  if (sinceCatch > 0 && sinceCatch < 1.2) {
    const w = Math.exp(-(7 * sinceCatch)) * Math.sin(2 * sinceCatch * Math.PI * 3.2);
    q = [q[0], q[1] - 0.05 * w, q[2] + 0.03 * w, q[3] + 0.06 * w];
  }
  return { q, d, accel, speed };
}

function gripAt(t: number) {
  const g = timeline.grip;
  for (let i = g.length - 1; i > 0; i--) {
    if (t >= g[i - 1][0]) {
      const [t0, v0] = g[i - 1];
      const [t1, v1] = g[i];
      if (t >= t1 || t1 === t0) return v1;
      return v0 + (v1 - v0) * smootherstep((t - t0) / (t1 - t0));
    }
  }
  return g[0][1];
}

export function createHeroScene(container: HTMLElement, options: { reducedMotion: boolean }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.75;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 30);
  camera.position.set(2.25, 1.85, 3.95);
  camera.lookAt(new THREE.Vector3(0.02, 0.5, 0.12));

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(1.2, 3.2, 1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -4e-4;
  key.shadow.normalBias = 0.01;
  const shadowCam = key.shadow.camera;
  shadowCam.left = -1.3;
  shadowCam.right = 1.3;
  shadowCam.top = 1.3;
  shadowCam.bottom = -1.3;
  shadowCam.near = 0.5;
  shadowCam.far = 7;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 1.4);
  fill.position.set(-2.5, 1.8, -2.2);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdddddd, 0.6));

  const floor = buildFloor();
  scene.add(floor.dots, floor.shadow);
  const rover = buildRover();
  scene.add(rover.root);
  const { group: apple, material: appleMaterial } = buildApple();
  scene.add(apple);

  const pitchSpring = new Spring(11, 0.35);
  const swaySpring = new Spring(9, 0.25);
  const squatSpring = new Spring(14, 0.3);
  const tmp = new THREE.Vector3();

  function update(t: number, dt: number) {
    const pose = poseAt(t);
    const [yaw, shoulder, elbow, wrist] = pose.q;
    rover.body.rotation.z = pitchSpring.step(0.028 * pose.accel, dt);
    rover.body.position.y = squatSpring.step(-0.004 * Math.abs(pose.accel), dt);
    const sway = swaySpring.step(0.05 * pose.accel, dt);
    for (const wheel of rover.wheels) wheel.rotation.z = -pose.d / WHEEL_RADIUS;
    rover.lidar.rotation.y = 2 * t * Math.PI * 0.6;
    floor.material.uniforms.uOffset.value = pose.d % 1.2;

    const arm = rover.arm;
    arm.yaw.rotation.y = yaw;
    arm.shoulder.rotation.z = shoulder + sway * Math.cos(yaw);
    arm.elbow.rotation.z = elbow + 0.6 * sway * Math.cos(yaw);
    arm.wrist.rotation.z = wrist;
    const gap = 0.058 + 0.03 * gripAt(t);
    arm.fingers[0].position.z = -gap - 0.008;
    arm.fingers[1].position.z = gap + 0.008;
    rover.root.updateMatrixWorld(true);

    // The apple: falling, held, in the tray, or left behind on the ground.
    const ev = timeline.ev;
    const fallTime = Math.sqrt((2 * (DROP_HEIGHT - CATCH.y)) / GRAVITY);
    apple.visible = true;
    appleMaterial.opacity = 1;
    apple.rotation.set(0, 0, 0);
    if (t < ev.catch - fallTime) {
      apple.visible = false;
    } else if (t < ev.catch) {
      const left = ev.catch - t;
      apple.position.set(CATCH.x, CATCH.y + 0.5 * GRAVITY * left * left, CATCH.z);
      apple.rotation.set(1.5 * left, 0, 2.2 * left);
      appleMaterial.opacity = THREE.MathUtils.clamp((DROP_HEIGHT - apple.position.y) / 0.6, 0, 1);
    } else if (t < ev.trayRelease || (t >= ev.trayPick && t < ev.groundRelease)) {
      arm.grasp.getWorldPosition(apple.position);
    } else if (t < ev.trayPick) {
      rover.body.localToWorld(apple.position.copy(TRAY));
    } else {
      tmp.copy(GROUND);
      tmp.x -= pose.d - ev.groundD;
      apple.position.copy(tmp);
      apple.visible = tmp.x > -3;
    }
  }

  let width = 0;
  let height = 0;
  function fit() {
    const rect = container.getBoundingClientRect();
    if (rect.width === width && rect.height === height) return;
    width = rect.width;
    height = rect.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Widen the view on portrait screens so the rover stays in frame.
    camera.fov = width / height < 1 ? 26 / Math.max(width / height, 0.75) : 26;
    camera.updateProjectionMatrix();
  }

  let time = 0;
  let last = 0;
  let raf = 0;
  let inView = true;

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    time = (time + dt) % timeline.ev.total;
    fit();
    update(time, dt);
    renderer.render(scene, camera);
    start();
  }

  function start() {
    if (raf || !inView || document.hidden || options.reducedMotion) return;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  }

  // Only animate while the canvas is on screen and the tab is visible.
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  /** With reduced motion: one still frame, just after the catch, settled. */
  function renderStill() {
    fit();
    const t = timeline.ev.catch + 1.5;
    for (let i = 0; i < 90; i++) update(t, 1 / 60);
    renderer.render(scene, camera);
  }
  const ro = new ResizeObserver(() => {
    if (options.reducedMotion) renderStill();
  });
  ro.observe(container);

  if (options.reducedMotion) renderStill();
  else start();

  return {
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material as THREE.Material | THREE.Material[];
          (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
        }
      });
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export const heroTimeline = { total: timeline.ev.total, events: timeline.ev };
