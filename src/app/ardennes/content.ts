// Copy for the Ardennes product page.

type Image = { src: string; alt: string; width: number; height: number };

type FeatureMedia =
  | { kind: "figure"; value: string; unit?: string; label: string }
  | ({ kind: "image" } & Image);

export type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  media: FeatureMedia;
};

export const ardennes = {
  metaDescription:
    "Ardennes is a rugged four-wheel-drive ROS 2 mobile robot platform by IsaacBot, with a hardware safety " +
    "chain, an open aluminium-profile frame and fleet-ready VDA 5050 integration.",
  brand: {
    logo: "/brand/ardennes-lockup-black.svg",
    logoWhite: "/brand/ardennes-lockup-white.svg",
    alt: "Ardennes",
    tagline: "Rugged autonomy, built for the field. An IsaacBot project.",
  },
  nav: [
    { label: "Overview", href: "#overview" },
    { label: "Features", href: "#features" },
    { label: "Specs", href: "#specs" },
    { label: "Software", href: "#software" },
  ],
  hero: {
    eyebrow: "IsaacBot · Ardennes",
    titleLines: ["Ardennes.", "Rugged autonomy, built for the field."],
    lead:
      "A four-wheel-drive mobile robot platform for outdoor and indoor work, with a hardware safety chain " +
      "and a full ROS 2 stack.",
    primaryCta: { label: "Discover", href: "#overview" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    image: {
      src: "/images/rover_front34_transparent.png",
      alt: "Ardennes rover, front three-quarter view",
      width: 1034,
      height: 979,
    },
  },
  statement: {
    eyebrow: "Meet Ardennes",
    lead: "One platform for the field and the workshop floor.",
    rest:
      "An open aluminium-profile frame, a latching hardware safety chain and an open ROS 2 stack, so your " +
      "team spends its time on the mission, not on the machine.",
    cta: { label: "See the specs", href: "#specs" },
    image: {
      src: "/images/rover_side34_transparent.png",
      alt: "Ardennes rover, side view",
      width: 1035,
      height: 894,
    },
  },
  featuresHead: {
    eyebrow: "Key features",
    titleLines: ["Built for real work,", "open to your ideas."],
  },
  features: [
    {
      id: "drivetrain",
      eyebrow: "4WD drivetrain",
      title: "Four driven wheels, one for every kind of ground.",
      text:
        "Each 13-inch all-terrain wheel has its own gear motor and magnetic encoder, with closed-loop speed " +
        "control on every wheel. Skid-steer kinematics let Ardennes turn on the spot.",
      points: [
        "4 × 250 W, 24 V brushed DC gear motors, 23.3 : 1",
        "MT6835 magnetic encoder on every motor",
        "Top speed 0.95 m/s, turn rate 1.5 rad/s",
      ],
      media: { kind: "figure", value: "4 × 250", unit: "W", label: "Independently driven wheels" },
    },
    {
      id: "safety",
      eyebrow: "Safety chain",
      title: "Starts stopped. Stays in control.",
      text:
        "A dedicated safety PLC holds a latching stop circuit on the motor contactor. The emergency stop " +
        "button, a software stop or a missed watchdog heartbeat cuts motor power while the computers stay " +
        "on, and Ardennes only moves again after an explicit reset.",
      points: [
        "Arduino Portenta Machine Control safety PLC",
        "Contactor read-back to catch a welded contact",
        "Stop from the button, RC switch, web UI or a ROS service",
      ],
      media: { kind: "figure", value: "5", label: "Independent motion gates" },
    },
    {
      id: "frame",
      eyebrow: "Open frame",
      title: "Bolt on what your mission needs.",
      text:
        "The aluminium-profile frame and sensor arch take tools, sensors and payloads. Supported sensors " +
        "are already integrated in the software and switched on per mission.",
      points: [
        "RoboSense RS16 LiDAR and Intel RealSense D435i depth camera",
        "GNSS, Wi-Fi and cellular through the onboard Teltonika RUTX11",
        "6 digital inputs and 6 outputs for your own equipment",
      ],
      media: {
        kind: "image",
        src: "/images/ardennes-iso.png",
        alt: "Ardennes CAD model showing the aluminium-profile frame",
        width: 815,
        height: 632,
      },
    },
    {
      id: "autonomy",
      eyebrow: "Autonomy",
      title: "From remote control to full autonomy.",
      text:
        "Drive by radio, let the rover assist you, or hand it a mission. Ardennes maps and localizes " +
        "indoors and outdoors, slows and stops for obstacles in its path, and can follow a person.",
      points: [
        "Manual, Assisted and Automatic driving modes",
        "SLAM and AMCL indoors, GNSS-aided localization outdoors",
        "ExpressLRS radio remote control",
      ],
      media: { kind: "figure", value: "3", label: "Driving modes" },
    },
    {
      id: "fleet",
      eyebrow: "Fleet-ready",
      title: "Speaks the language of your fleet.",
      text:
        "Ardennes takes orders over VDA 5050, the open interface for fleet managers, and joins mixed fleets " +
        "through Open-RMF. Every subsystem ships as a container on balenaOS.",
      points: ["VDA 5050 2.0 over MQTT", "Open-RMF fleet adapter", "Remote access over a WireGuard VPN"],
      media: { kind: "figure", value: "VDA 5050", label: "Fleet interface" },
    },
  ] as Feature[],
  specs: {
    eyebrow: "Technical specifications",
    titleLines: ["Ardennes,", "by the numbers."],
    image: {
      src: "/images/rover_side34_transparent.png",
      alt: "Ardennes rover, side view",
      width: 1035,
      height: 894,
      caption: "Ardennes · 4WD mobile robot platform",
    },
    groups: [
      {
        title: "Platform",
        rows: [
          ["Size (L × W × H)", "843 × 722 × 688 mm"],
          ["Wheelbase", "503 mm"],
          ["Ground clearance", "113 mm"],
          ["Mass", "59 kg incl. battery"],
          ["Wheels", "13 in all-terrain, 330 mm"],
          ["Side tip-over angle", "≈ 55° (static, unloaded)"],
        ],
      },
      {
        title: "Drive",
        rows: [
          ["Drive", "4WD skid-steer"],
          ["Motors", "4 × 250 W, 24 V brushed DC gear motors"],
          ["Gear ratio", "23.3 : 1"],
          ["Motor drivers", "4 × Phidget DCC1000"],
          ["Top speed", "0.95 m/s · 1.5 rad/s"],
        ],
      },
      {
        title: "Power & safety",
        rows: [
          ["Battery", "24 V LiFePO4, 40 Ah"],
          ["Battery management", "Daly BMS with live telemetry in ROS 2"],
          ["Safety controller", "Arduino Portenta Machine Control"],
          ["Emergency stop", "Latching, on the motor contactor"],
        ],
      },
      {
        title: "Sensors & connectivity",
        rows: [
          ["IMU", "Phidgets Spatial MOT0110"],
          ["LiDAR (optional)", "RoboSense RS16"],
          ["Depth camera (optional)", "Intel RealSense D435i"],
          ["Router", "Teltonika RUTX11: Wi-Fi, cellular, GNSS"],
          ["Remote control", "ExpressLRS radio"],
        ],
      },
    ] as { title: string; rows: [string, string][] }[],
    note:
      "Size, mass, ground clearance and tip-over angle are derived from the CAD model. Payload, runtime and " +
      "environmental ratings are still being characterised; get in touch for the latest figures.",
  },
  software: {
    eyebrow: "Software",
    titleLines: ["Open stack,", "ready on day one."],
    intro:
      "Ardennes runs a complete ROS 2 stack out of the box, from wheel control to fleet integration, and " +
      "the same software runs in simulation.",
    items: [
      { name: "ROS 2 Lyrical", text: "ros2_control drivers for every wheel, with Zenoh middleware on Ubuntu 26.04." },
      { name: "Nav2", text: "MPPI controller, Smac planner, SLAM Toolbox, AMCL and EKF sensor fusion." },
      {
        name: "Perception",
        text: "Object detection, AprilTags, terrain slope and person following, all on the CPU.",
      },
      { name: "VDA 5050 & Open-RMF", text: "Standard fleet interfaces over MQTT, for single robots or mixed fleets." },
      { name: "Foxglove", text: "Live dashboards, teleoperation and a stop button from any browser." },
      { name: "Gazebo Sim", text: "A digital twin running the same controllers and localization as the real rover." },
    ],
  },
};
