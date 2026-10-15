"use client";

import { useEffect, useRef, useState } from "react";

/** Flat, CSS-animated fallback for when the 3D scene can't start (no WebGL). */
function AppleArm() {
  return (
    <svg
      className="apple-arm"
      viewBox="70 0 380 430"
      role="img"
      aria-label="An apple falls into the Isaacbot robot arm, which pushes it onward"
    >
      <defs>
        <mask id="arm-joints" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1000" height="900">
          <rect x="-200" y="-200" width="1000" height="900" fill="#fff" />
          <circle cx="156" cy="370" r="9" fill="#000" />
          <circle cx="196" cy="248" r="10" fill="#000" />
        </mask>
      </defs>
      <g
        className="apple-trail"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 12"
      >
        <line x1="380" y1="14" x2="380" y2="128" />
      </g>
      <rect x="100" y="386" width="112" height="24" rx="5" fill="currentColor" />
      <g className="arm-shoulder" mask="url(#arm-joints)" fill="currentColor">
        <path d="M156 380 L196 248" fill="none" stroke="currentColor" strokeWidth="23" />
        <circle cx="156" cy="370" r="21" />
        <g className="arm-elbow">
          <path d="M196 248 L322 196" fill="none" stroke="currentColor" strokeWidth="23" />
          <path
            d="M322 196 L350 162 M322 196 L364 212"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="square"
          />
          <g className="apple" transform="translate(380 168)">
            <g className="apple-body">
              <path
                d="M0 -16 C11 -27 30 -21 30 1 C30 24 13 33 0 26 C-13 33 -30 24 -30 1 C-30 -21 -11 -27 0 -16 Z"
                fill="currentColor"
              />
              <path
                d="M0 -16 C1 -24 3 -30 7 -35"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path d="M5 -28 C12 -41 27 -40 31 -34 C23 -27 12 -25 5 -28 Z" fill="currentColor" />
            </g>
          </g>
        </g>
        <circle cx="196" cy="248" r="22" />
      </g>
    </svg>
  );
}

/** The hero's 3D rover. three.js is loaded only in the browser, after the page is up. */
export default function RoverArm3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("./heroScene")
      .then(({ createHeroScene }) => {
        if (cancelled) return;
        dispose = createHeroScene(el, { reducedMotion }).dispose;
        el.classList.add("is-ready");
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  if (failed) return <AppleArm />;
  return (
    <div
      ref={ref}
      className="rover-arm-3d"
      role="img"
      aria-label="A four-wheel Isaacbot rover with a robot arm catches a falling apple, stows it and delivers it"
    />
  );
}
