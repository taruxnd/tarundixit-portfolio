"use client";

import { motion, type MotionValue } from "framer-motion";
import { useId } from "react";

const BODY_OFFSET = 22;
const CABLE_END = 90;
const CX = 150;

/* Hexagonal pyramid shade — front 3/4 view */
const SHADE = {
  topY: 86,
  bottomY: 224,
  topHalf: 29,
  bottomHalf: 62,
  depth: 18,
};

interface PendantLampSvgProps {
  on: boolean;
  dark: boolean;
  cordPull: number;
  bulbOpacity: MotionValue<number>;
  onPullPointerDown: (event: React.PointerEvent<SVGElement>) => void;
  onPullPointerMove: (event: React.PointerEvent<SVGElement>) => void;
  onPullPointerUp: (event: React.PointerEvent<SVGElement>) => void;
  onPullKeyToggle: () => void;
}

export default function PendantLampSvg({
  on,
  dark,
  cordPull,
  bulbOpacity,
  onPullPointerDown,
  onPullPointerMove,
  onPullPointerUp,
  onPullKeyToggle,
}: PendantLampSvgProps) {
  const uid = useId().replace(/:/g, "");
  const cableStroke = dark ? "#2a2a2c" : "#1c1c1e";
  const cordStroke = dark ? "#6a5e52" : "#9a8878";
  /* Cord length is authored in SVG space — independent of CSS lamp scale */
  const handleTop = 318;
  const handleY = handleTop + cordPull;
  const cordMidY = 268 + cordPull * 0.5;

  const { topY, bottomY, topHalf, bottomHalf, depth } = SHADE;
  const tl = { x: CX - topHalf, y: topY };
  const tr = { x: CX + topHalf, y: topY };
  const bl = { x: CX - bottomHalf, y: bottomY };
  const br = { x: CX + bottomHalf, y: bottomY };
  const tlBack = { x: tl.x - depth, y: topY + depth * 0.35 };
  const trBack = { x: tr.x + depth, y: topY + depth * 0.35 };
  const blBack = { x: bl.x - depth * 1.1, y: bottomY - depth * 0.2 };
  const brBack = { x: br.x + depth * 1.1, y: bottomY - depth * 0.2 };

  const leftFace = `${tlBack.x},${tlBack.y} ${tl.x},${tl.y} ${bl.x},${bl.y} ${blBack.x},${blBack.y}`;
  const frontFace = `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`;
  const rightFace = `${tr.x},${tr.y} ${trBack.x},${trBack.y} ${brBack.x},${brBack.y} ${br.x},${br.y}`;

  const innerTopY = topY + 8;
  const innerBottomY = bottomY - 4;
  const innerTopHalf = topHalf - 6;
  const innerBottomHalf = bottomHalf - 7;
  const interior = `
    M ${CX - innerTopHalf} ${innerTopY}
    L ${CX + innerTopHalf} ${innerTopY}
    L ${CX + innerBottomHalf} ${innerBottomY}
    L ${CX - innerBottomHalf} ${innerBottomY}
    Z
  `;

  const rimGold = `
    M ${bl.x + 4} ${bottomY - 1}
    L ${br.x - 4} ${bottomY - 1}
    L ${br.x - 8} ${bottomY + 5}
    L ${bl.x + 8} ${bottomY + 5}
    Z
  `;

  return (
    <svg
      viewBox="0 0 300 548"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="block h-auto w-full overflow-visible"
    >
      <defs>
        <linearGradient id={`${uid}-interior`} x1={CX} y1={innerTopY} x2={CX} y2={innerBottomY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9a7838" stopOpacity={on ? 0.55 : 0.1} />
          <stop offset="45%" stopColor="#d4aa50" stopOpacity={on ? 0.88 : 0.12} />
          <stop offset="100%" stopColor="#f0cc70" stopOpacity={on ? 1 : 0.14} />
        </linearGradient>

        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c060" stopOpacity={on ? 0.95 : 0.2} />
          <stop offset="100%" stopColor="#a88030" stopOpacity={on ? 0.7 : 0.12} />
        </linearGradient>

        <radialGradient id={`${uid}-bulb`} cx="40%" cy="36%" r="58%">
          <stop offset="0%" stopColor={on ? "#fffef6" : "#2a2a2c"} />
          <stop offset="42%" stopColor={on ? "#fff4c8" : "#222224"} />
          <stop offset="100%" stopColor={on ? "#e8b850" : "#1a1a1c"} stopOpacity={on ? 0.92 : 1} />
        </radialGradient>

        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef0c0" stopOpacity={on ? 0.55 : 0} />
          <stop offset="55%" stopColor="#fef0c0" stopOpacity={on ? 0.18 : 0} />
          <stop offset="100%" stopColor="#fef0c0" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${uid}-spill`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd070" stopOpacity={on ? 0.34 : 0} />
          <stop offset="45%" stopColor="#ffc040" stopOpacity={on ? 0.12 : 0} />
          <stop offset="100%" stopColor="#ffc040" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${uid}-face-left`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark ? "#060608" : "#0a0a0c"} />
          <stop offset="100%" stopColor={dark ? "#101012" : "#141416"} />
        </linearGradient>

        <linearGradient id={`${uid}-face-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "#101012" : "#161618"} />
          <stop offset="100%" stopColor={dark ? "#080808" : "#0e0e10"} />
        </linearGradient>

        <linearGradient id={`${uid}-face-right`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "#141416" : "#1a1a1c"} />
          <stop offset="100%" stopColor={dark ? "#0a0a0c" : "#101012"} />
        </linearGradient>

        <linearGradient id={`${uid}-brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a6030" />
          <stop offset="25%" stopColor="#c8a858" />
          <stop offset="50%" stopColor="#e8c878" />
          <stop offset="75%" stopColor="#c8a858" />
          <stop offset="100%" stopColor="#7a6030" />
        </linearGradient>

        <linearGradient id={`${uid}-walnut`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a2f12" />
          <stop offset="28%" stopColor="#7a5025" />
          <stop offset="55%" stopColor="#8b5e2e" />
          <stop offset="80%" stopColor="#6b4420" />
          <stop offset="100%" stopColor="#4a2f12" />
        </linearGradient>

        <linearGradient id={`${uid}-cable`} x1={CX} y1="0" x2={CX} y2={CABLE_END} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={dark ? "#3a3a3c" : "#2a2a2c"} />
          <stop offset="100%" stopColor={cableStroke} />
        </linearGradient>

        <filter id={`${uid}-glow`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={on ? 7 : 0} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`${uid}-soft-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        <radialGradient id={`${uid}-ambient`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde898" stopOpacity={on ? 0.1 : 0} />
          <stop offset="100%" stopColor="#fde898" stopOpacity="0" />
        </radialGradient>

        <clipPath id={`${uid}-shade-clip`}>
          <polygon points={frontFace} />
          <polygon points={leftFace} />
          <polygon points={rightFace} />
        </clipPath>
      </defs>

      <line
        x1={CX}
        y1="0"
        x2={CX}
        y2={CABLE_END}
        stroke={`url(#${uid}-cable)`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      <g transform={`translate(0, ${BODY_OFFSET})`}>
        {on ? (
          <>
            <ellipse
              cx={CX}
              cy="248"
              rx="78"
              ry="50"
              fill={`url(#${uid}-spill)`}
              filter={`url(#${uid}-soft-glow)`}
              opacity={0.88}
            />
            <ellipse cx={CX} cy="468" rx="128" ry="62" fill={`url(#${uid}-ambient)`} />
          </>
        ) : null}

        {/* Socket — black cap + brass ring */}
        <rect x={CX - 12} y="66" width="24" height="14" rx="2" fill={dark ? "#141416" : "#1a1a1c"} />
        <rect x={CX - 12} y="66" width="24" height="4" rx="2" fill={dark ? "#222224" : "#2a2a2c"} />
        <rect x={CX - 16} y="80" width="32" height="5" rx="1.5" fill={`url(#${uid}-brass)`} />
        <rect x={CX - 14} y="85" width="28" height="3" rx="1" fill={dark ? "#101012" : "#161618"} />

        {/* Interior glow + gold lining */}
        <g clipPath={`url(#${uid}-shade-clip)`}>
          <ellipse cx={CX} cy="168" rx="42" ry="28" fill={`url(#${uid}-halo)`} />
          <path d={interior} fill={`url(#${uid}-interior)`} />
        </g>

        {/* Bulb — slightly tucked inside the opening */}
        <motion.circle
          cx={CX}
          cy={bottomY + 2}
          r="22"
          fill={`url(#${uid}-bulb)`}
          filter={`url(#${uid}-glow)`}
          style={{ opacity: bulbOpacity }}
        />
        {on ? (
          <g opacity={0.55} clipPath={`url(#${uid}-shade-clip)`}>
            {[-10, -3, 3, 10].map((offset) => (
              <path
                key={offset}
                d={`M ${CX + offset} ${bottomY - 14} Q ${CX + offset + (offset < 0 ? -2 : 2)} ${bottomY} ${CX + offset} ${bottomY + 14}`}
                stroke="#fff6d0"
                strokeWidth="1.1"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
        ) : null}

        {/* Faceted shade — back to front */}
        <polygon points={leftFace} fill={`url(#${uid}-face-left)`} />
        <polygon points={rightFace} fill={`url(#${uid}-face-right)`} />
        <polygon points={frontFace} fill={`url(#${uid}-face-front)`} />

        {/* Facet seams */}
        <line x1={tlBack.x} y1={tlBack.y} x2={blBack.x} y2={blBack.y} stroke="#000" strokeOpacity={0.45} strokeWidth="0.75" />
        <line x1={trBack.x} y1={trBack.y} x2={brBack.x} y2={brBack.y} stroke="#000" strokeOpacity={0.45} strokeWidth="0.75" />
        <line x1={tl.x} y1={tl.y} x2={bl.x} y2={bl.y} stroke="#000" strokeOpacity={0.5} strokeWidth="0.75" />
        <line x1={tr.x} y1={tr.y} x2={br.x} y2={br.y} stroke="#000" strokeOpacity={0.5} strokeWidth="0.75" />
        <line x1={tl.x} y1={tl.y} x2={tr.x} y2={tr.y} stroke="#2a2a2c" strokeOpacity={0.35} strokeWidth="0.5" />
        <line x1={tlBack.x} y1={tlBack.y} x2={trBack.x} y2={trBack.y} stroke="#000" strokeOpacity={0.25} strokeWidth="0.5" />

        {/* Gold bottom rim */}
        <path d={rimGold} fill={`url(#${uid}-rim)`} />

        {/* Pull cord */}
        <path
          d={`M ${br.x - 6} ${bottomY - 2} Q ${br.x - 4} ${cordMidY} ${br.x - 6} ${handleY}`}
          stroke={cordStroke}
          strokeWidth="2.45"
          strokeLinecap="round"
          fill="none"
        />
        <g transform={`translate(0, ${cordPull})`}>
          <rect x={br.x - 15.5} y={handleTop} width="17" height="32" rx="4.5" fill={`url(#${uid}-walnut)`} />
          <line x1={br.x - 11} y1={handleTop + 5} x2={br.x - 11} y2={handleTop + 23} stroke="#2e1a08" strokeWidth="0.65" strokeLinecap="round" opacity="0.45" />
          <line x1={br.x - 7} y1={handleTop + 3} x2={br.x - 7} y2={handleTop + 26} stroke="#5a3518" strokeWidth="0.55" strokeLinecap="round" opacity="0.3" />
          <line x1={br.x - 3} y1={handleTop + 5} x2={br.x - 3} y2={handleTop + 23} stroke="#2e1a08" strokeWidth="0.55" strokeLinecap="round" opacity="0.35" />
        </g>
      </g>

      <g transform={`translate(0, ${BODY_OFFSET})`}>
        <rect
          className="hanging-lamp__pull-hit"
          x={br.x - 18}
          y={bottomY - 4}
          width="52"
          height={160 + cordPull}
          fill="transparent"
          pointerEvents="all"
          onPointerDown={onPullPointerDown}
          onPointerMove={onPullPointerMove}
          onPointerUp={onPullPointerUp}
          onPointerCancel={onPullPointerUp}
        />
      </g>

      <foreignObject x={br.x - 22} y={bottomY - 4 + BODY_OFFSET} width="52" height="48">
        <button
          type="button"
          className="hanging-lamp__pull-btn"
          aria-label="Pull cord to toggle the lamp"
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            onPullKeyToggle();
          }}
        />
      </foreignObject>
    </svg>
  );
}
