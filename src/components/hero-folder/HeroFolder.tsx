import "./hero-folder.css";

const FOLDER_PATH =
  "M6 22C6 13 13 8 22 8H56C65 8 70 13 75 22C79 29 85 36 95 36H108C118 36 124 42 124 52V84C124 94 118 100 108 100H20C10 100 6 94 6 84Z";

export default function HeroFolder() {
  return (
    <div className="hero-folder">
      <div className="hero-folder__tilt">
        <svg
          className="hero-folder__icon"
          viewBox="0 0 128 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="hero-folder-fill"
              x1="64"
              y1="8"
              x2="64"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#C5ECFD" />
              <stop offset="0.18" stopColor="#8BD4F8" />
              <stop offset="0.55" stopColor="#4FB6EE" />
              <stop offset="1" stopColor="#2A96DC" />
            </linearGradient>
            <linearGradient
              id="hero-folder-sheen"
              x1="24"
              y1="12"
              x2="80"
              y2="72"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#fff" stopOpacity="0.62" />
              <stop offset="0.45" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="hero-folder-depth"
              x1="64"
              y1="72"
              x2="64"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#1A6FAD" stopOpacity="0" />
              <stop offset="1" stopColor="#1A6FAD" stopOpacity="0.22" />
            </linearGradient>
            <clipPath id="hero-folder-clip">
              <path d={FOLDER_PATH} />
            </clipPath>
          </defs>

          <path d={FOLDER_PATH} fill="url(#hero-folder-fill)" />
          <path d={FOLDER_PATH} fill="url(#hero-folder-sheen)" />
          <path d={FOLDER_PATH} fill="url(#hero-folder-depth)" />
          <path
            d="M7 44C26 41.2 46 40 64 40C82 40 102 41.2 121 44"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="1.2"
            strokeLinecap="round"
            clipPath="url(#hero-folder-clip)"
          />
        </svg>
        <span className="hero-folder__name">life lately</span>
      </div>
    </div>
  );
}
