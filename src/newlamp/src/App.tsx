import { useState, useEffect } from "react"

export default function App() {
  const [on, setOn] = useState(true)
  const [pulling, setPulling] = useState(false)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  function pull() {
    if (pulling) return
    setPulling(true)
    setTimeout(() => {
      setOn((v) => !v)
      setPulling(false)
    }, 280)
  }

  const cordPull = pulling ? 22 : 0

  return (
    <div
      className={`size-full flex flex-col items-center justify-center transition-colors duration-700 ${
        dark ? "bg-[#0e0e10]" : "bg-[#f5f4f0]"
      }`}
    >
      {/* dark mode toggle */}
      <button
        onClick={() => setDark((v) => !v)}
        className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
          dark
            ? "bg-white/8 text-white/50 hover:bg-white/14"
            : "bg-black/6 text-black/40 hover:bg-black/10"
        }`}
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3.5" fill="currentColor" />
            <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="13.07" y1="2.93" x2="11.66" y2="4.34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="4.34" y1="11.66" x2="2.93" y2="13.07" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8.5a5.5 5.5 0 1 1-6-6 4.5 4.5 0 0 0 6 6z" fill="currentColor" />
          </svg>
        )}
      </button>

      <svg
        viewBox="0 0 300 500"
        width="300"
        height="500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pendant lamp"
      >
        <defs>
          {/* Warm interior gradient — dims when off */}
          <linearGradient id="interior" x1="145" y1="84" x2="145" y2="222" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8a868" stopOpacity={on ? 0.55 : 0.08} />
            <stop offset="60%" stopColor="#f0dda0" stopOpacity={on ? 0.82 : 0.06} />
            <stop offset="100%" stopColor="#f8ecca" stopOpacity={on ? 0.95 : 0.07} />
          </linearGradient>

          {/* Bulb warm radial */}
          <radialGradient id="bulb" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stopColor={on ? "#fffef5" : "#2a2a2c"} />
            <stop offset="45%" stopColor={on ? "#fff8d6" : "#222224"} />
            <stop offset="100%" stopColor={on ? "#f5e098" : "#1a1a1c"} stopOpacity={on ? 0.88 : 1} />
          </radialGradient>

          {/* Glow halo */}
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3cc" stopOpacity={on ? 0.5 : 0} />
            <stop offset="70%" stopColor="#fef3cc" stopOpacity={on ? 0.12 : 0} />
            <stop offset="100%" stopColor="#fef3cc" stopOpacity="0" />
          </radialGradient>

          {/* Walnut */}
          <linearGradient id="walnut" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a2f12" />
            <stop offset="28%" stopColor="#7a5025" />
            <stop offset="55%" stopColor="#8b5e2e" />
            <stop offset="80%" stopColor="#6b4420" />
            <stop offset="100%" stopColor="#4a2f12" />
          </linearGradient>

          {/* Shade depth */}
          <linearGradient id="shadeDepth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={dark ? "#080808" : "#111113"} />
            <stop offset="40%" stopColor={dark ? "#1c1c1e" : "#232325"} />
            <stop offset="60%" stopColor={dark ? "#1c1c1e" : "#232325"} />
            <stop offset="100%" stopColor={dark ? "#080808" : "#111113"} />
          </linearGradient>

          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={on ? 5 : 0} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ambient light cast on background when on */}
          <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde99a" stopOpacity={on && dark ? 0.07 : 0} />
            <stop offset="100%" stopColor="#fde99a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient floor glow */}
        {on && dark && (
          <ellipse cx="145" cy="420" rx="120" ry="60" fill="url(#ambient)" />
        )}

        {/* ── SUSPENSION CABLE ── */}
        <line
          x1="145" y1="0"
          x2="145" y2="72"
          stroke={dark ? "#2a2a2c" : "#1c1c1e"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ── CYLINDRICAL CONNECTOR ── */}
        <rect x="133" y="68" width="24" height="16" rx="3.5" fill={dark ? "#1c1c1e" : "#232325"} />
        <rect x="133" y="68" width="24" height="5" rx="3.5" fill={dark ? "#2e2e30" : "#3a3a3c"} />

        {/* ── GLOW HALO ── */}
        <ellipse cx="145" cy="224" rx="42" ry="28" fill="url(#halo)" style={{ transition: "opacity 0.6s" }} />

        {/* ── BULB ── */}
        <circle
          cx="145" cy="210"
          r="22"
          fill="url(#bulb)"
          filter="url(#glow)"
          style={{ transition: "fill 0.5s" }}
        />

        {/* ── SHADE ── */}
        <path
          d="M 114 84 L 176 84 L 211 213 Q 214 224, 204 224 L 86 224 Q 76 224, 79 213 Z"
          fill="url(#shadeDepth)"
        />
        {/* Interior */}
        <path
          d="M 119 90 L 171 90 L 206 219 L 84 219 Z"
          fill="url(#interior)"
          style={{ transition: "opacity 0.5s" }}
        />

        {/* ── PULL CORD ── drawn BEFORE the front rim so the rim occludes the origin */}
        <g
          onClick={pull}
          style={{ cursor: "pointer" }}
          aria-label="Pull cord"
          role="button"
        >
          {/* wider invisible hit area */}
          <rect x="164" y="220" width="18" height={54 + cordPull} fill="transparent" />
          {/* cord starts at y=220 — the top few px are hidden behind the front rim cap below */}
          <path
            d={`M 173 220 Q 174 ${242 + cordPull * 0.5} 173 ${268 + cordPull}`}
            stroke={dark ? "#6a5e52" : "#9a8878"}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "d 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}
          />

          {/* Wooden pull handle */}
          <g style={{
            transform: `translateY(${cordPull}px)`,
            transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <rect x="166" y="268" width="14" height="28" rx="4" fill="url(#walnut)" />
            <line x1="170" y1="273" x2="170" y2="290" stroke="#2e1a08" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
            <line x1="173.5" y1="271" x2="173.5" y2="292" stroke="#5a3518" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
            <line x1="177" y1="273" x2="177" y2="290" stroke="#2e1a08" strokeWidth="0.5" strokeLinecap="round" opacity="0.35" />
          </g>
        </g>

        {/* ── FRONT RIM CAP — painted last, occludes the cord's origin ── */}
        {/* Redraws just the bottom strip of the shade (y≈213–224) over the cord */}
        <path
          d="M 79 213 Q 76 224, 86 224 L 204 224 Q 214 224, 211 213 Z"
          fill="url(#shadeDepth)"
        />
      </svg>

      {/* state label */}
      <p
        className={`absolute bottom-6 text-xs tracking-widest uppercase transition-colors duration-500 ${
          dark ? "text-white/20" : "text-black/25"
        }`}
      >
        {on ? "on" : "off"}
      </p>
    </div>
  )
}
