import { useId, useState } from "react";
import lampSrc from "@/imports/OK.svg";

/* -------------------------------------------------------------------------- */
/*  Pendant lamp — the traced product render, with live glow + swing physics.  */
/*  A soft matte finish (reduced contrast/saturation) flattens the specular    */
/*  sheen so the shade reads as powder-coated metal rather than glossy.        */
/*  The pull cord is a bespoke 3D braided cable drawn in the lamp's own         */
/*  coordinate space, so it lines up with — and swings with — the fixture.      */
/* -------------------------------------------------------------------------- */

export type LampProps = {
  initialOn: boolean;
  forceHover?: boolean;
  pulled?: boolean;
};

// Matte base: gently lift the blacks and pull back saturation + specular contrast.
const MATTE = "contrast(0.96) saturate(0.95) brightness(1.01)";

export default function Lamp({ initialOn, forceHover = false, pulled = false }: LampProps) {
  const [on, setOn] = useState(initialOn);
  const [hover, setHover] = useState(false);
  const [swingKey, setSwingKey] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const uid = useId().replace(/:/g, "");

  const emphasized = forceHover || hover;

  const pull = () => {
    setOn((o) => !o);
    setSwingKey((k) => k + 1);
    setSwinging(true);
  };

  // --- 3D cable geometry (in the 1536×1024 space of the traced render) ------
  const anchorX = 911;
  const anchorY = 524;
  const drop = pulled ? 34 : 0;
  const handleX = 911;
  const handleTopY = 842 + drop;
  const handleCY = handleTopY + 30;
  const cablePath = `M ${anchorX} ${anchorY} C 917 ${anchorY + 120} 905 ${anchorY + 230} ${handleX} ${handleTopY}`;
  const handlePath = `M ${handleX} ${handleCY - 37} C ${handleX - 21} ${handleCY - 20} ${handleX - 21} ${handleCY + 28} ${handleX} ${handleCY + 33} C ${handleX + 21} ${handleCY + 28} ${handleX + 21} ${handleCY - 20} ${handleX} ${handleCY - 37} Z`;

  return (
    <div
      className="relative flex h-[380px] w-full cursor-grab select-none items-center justify-center overflow-hidden active:cursor-grabbing"
      onClick={pull}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {/* Warm ambient light pooling beneath the lamp. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,214,150,0.9) 0%, rgba(255,204,132,0.45) 34%, rgba(255,204,132,0) 70%)",
          filter: "blur(4px)",
          opacity: on ? 1 : 0,
          transition: "opacity 550ms ease",
        }}
      />

      {/* Fixture — the render and the cable swing together. */}
      <div
        key={swingKey}
        onAnimationEnd={() => setSwinging(false)}
        className="relative inline-block h-full"
        style={{
          transformOrigin: "50% 0%",
          transform: pulled ? "rotate(2.4deg)" : undefined,
          animation: swinging ? `lamp-swing 1400ms ease-out` : "none",
        }}
      >
        {/* Traced product render. */}
        <img
          src={lampSrc}
          alt="Matte black industrial pendant lamp with brass fitting and walnut pull"
          draggable={false}
          className="block h-full w-auto max-w-none"
          style={{
            filter: on
              ? emphasized
                ? `${MATTE} brightness(1.05)`
                : MATTE
              : "brightness(0.42) saturate(0.24) contrast(1.02)",
            transition: "filter 500ms ease",
          }}
        />

        {/* 3D braided pull cable, drawn over the baked-in cord. */}
        <svg
          viewBox="0 0 1536 1024"
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            filter: on ? "none" : "brightness(0.5) saturate(0.4)",
            transition: "filter 500ms ease",
          }}
        >
          <defs>
            {/* Cylindrical shading across the cable width. */}
            <linearGradient
              id={`${uid}-cable`}
              gradientUnits="userSpaceOnUse"
              x1={anchorX - 11}
              y1="0"
              x2={anchorX + 11}
              y2="0"
            >
              <stop offset="0" stopColor="#211a13" />
              <stop offset="0.22" stopColor="#4a3f31" />
              <stop offset="0.5" stopColor="#a8967b" />
              <stop offset="0.78" stopColor="#4a3f31" />
              <stop offset="1" stopColor="#211a13" />
            </linearGradient>
            {/* Sculpted walnut handle. */}
            <radialGradient id={`${uid}-walnut`} cx="0.36" cy="0.28" r="0.85">
              <stop offset="0" stopColor="#b07c46" />
              <stop offset="0.5" stopColor="#7c5230" />
              <stop offset="1" stopColor="#3c2513" />
            </radialGradient>
          </defs>

          {/* Contact shadow under the handle. */}
          <ellipse cx={handleX} cy={handleCY + 34} rx="15" ry="4" fill="#000" opacity="0.14" />

          {/* Cable body — cylinder. */}
          <path d={cablePath} fill="none" stroke={`url(#${uid}-cable)`} strokeWidth="15" strokeLinecap="round" />
          {/* Braid twist. */}
          <path
            d={cablePath}
            fill="none"
            stroke="#a5906f"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray="4 11"
            opacity="0.32"
          />
          {/* Specular highlight running down the cable. */}
          <path
            d={cablePath}
            fill="none"
            stroke="#d8c39a"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
            transform="translate(-3.5 0)"
          />

          {/* Walnut teardrop handle. */}
          <path d={handlePath} fill={`url(#${uid}-walnut)`} stroke="#31200f" strokeWidth="1" />
          {/* Handle sheen. */}
          <ellipse
            cx={handleX - 5}
            cy={handleCY - 8}
            rx="5"
            ry="13"
            fill="#eccca0"
            opacity={emphasized ? 0.75 : 0.4}
            style={{ transition: "opacity 260ms ease" }}
          />
        </svg>
      </div>

      {/* Pull-cord emphasis — soft halo on the handle on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "58.5%",
          top: pulled ? "90%" : "85%",
          width: 90,
          height: 90,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(214,164,104,0.55) 0%, rgba(214,164,104,0) 68%)",
          opacity: emphasized ? 1 : 0,
          transition: "opacity 260ms ease",
        }}
      />
    </div>
  );
}
