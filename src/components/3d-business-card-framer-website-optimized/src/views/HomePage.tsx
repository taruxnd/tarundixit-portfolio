import React, { Suspense } from "react";


/** The "/" page, composed from its Framer sections.
 *
 *  Rendered to static HTML by scripts/prerender.mts at build time — never
 *  shipped as a page.tsx, which would duplicate every byte of this markup into
 *  the RSC flight payload on top of the HTML itself. */
export default function HomePage() {
  return (
    <body>
      {"\n\t\n\t"}
      <span data-fnj-slot={"0"} />
      {"\n    \n    "}
      <span data-fnj-slot={"1"} />
      {"\n\t\n\t"}
      <div id="main" data-framer-hydrate-v2={"{\"routeId\":\"augiA20Il\",\"localeId\":\"default\",\"breakpoints\":[{\"hash\":\"72rtr7\"}]}"} data-framer-ssr-released-at="2026-05-27T15:32:42.844Z" data-framer-page-optimized-at="2026-06-01T15:04:54.274Z" data-framer-generated-page="">
        <Suspense fallback={null}>
          <style data-framer-html-style="" dangerouslySetInnerHTML={{ __html: "html body { background: rgb(25, 25, 25); }" }} />
          <div data-framer-root="" className="framer-SyWEo framer-72rtr7" style={{ minHeight: "100vh", width: "auto" }}>
            <div className="framer-588y1e-container">
              <Suspense fallback={null}>
                <div className="card-mockup-wrapper" style={{ "--font-family-title": "Outfit", "--font-family-body": "Plus Jakarta Sans" }}>
                  <style dangerouslySetInnerHTML={{ __html: "\n@import url(/assets/img/8db20885aa048741.bin);\n\n.card-mockup-wrapper {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    position: relative;\n    overflow: visible;\n    background: transparent;\n    font-family: var(--font-family-body, 'Plus Jakarta Sans'), -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n    box-sizing: border-box;\n}\n\n.card-3d-container {\n    position: relative;\n    width: 310px;\n    perspective: 1500px;\n    cursor: grab;\n}\n\n.card-3d-container:active {\n    cursor: grabbing;\n}\n\n/* Lanyard ribbon strap styling */\n.lanyard-strap {\n    width: 44px;\n    height: 148px;\n    border-radius: 4px 4px 0 0;\n    position: absolute;\n    top: 0;\n    left: calc(50% - 22px);\n    z-index: 5;\n    box-shadow: \n        inset -5px 0 10px rgba(0,0,0,0.3),\n        inset 5px 0 10px rgba(255,255,255,0.1),\n        0 8px 16px rgba(0,0,0,0.15);\n    display: flex;\n    justify-content: center;\n    align-items: flex-end;\n    overflow: hidden;\n    transition: background-color 0.3s ease;\n}\n\n.lanyard-strap-texture {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-image: repeating-linear-gradient(\n        45deg,\n        rgba(0, 0, 0, 0.12) 0px,\n        rgba(0, 0, 0, 0.12) 1.5px,\n        transparent 1.5px,\n        transparent 4px\n    );\n    pointer-events: none;\n}\n\n.lanyard-strap-text {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 11px;\n    font-weight: 800;\n    letter-spacing: 2px;\n    white-space: nowrap;\n    writing-mode: vertical-rl;\n    text-orientation: mixed;\n    transform: rotate(180deg);\n    margin-bottom: 20px;\n    user-select: none;\n    pointer-events: none;\n}\n\n/* Front Card body styling */\n.front-card-body {\n    position: absolute;\n    left: calc(50% - 155px);\n    width: 310px;\n    height: 490px;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    padding: 35px 30px;\n    box-sizing: border-box;\n    z-index: 2;\n    box-shadow: \n        0 30px 60px -15px rgba(0,0,0,0.4),\n        0 0 0 1px rgba(255,255,255,0.08) inset;\n    transform-style: preserve-3d;\n}\n\n/* Card punch hole with realistic 3D depth and highlight borders */\n.card-punch-hole {\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    background: #080808;\n    position: absolute;\n    top: 25px;\n    left: 50%;\n    transform: translateX(-50%);\n    z-index: 3;\n    box-shadow: \n        inset 0 3px 5px rgba(0,0,0,0.9),  /* Deep inner shadow */\n        0 1.5px 2px rgba(255,255,255,0.2), /* Soft bottom white highlight edge */\n        0 -1px 2px rgba(0,0,0,0.4);        /* Top edge shadow */\n    border: 1px solid rgba(255,255,255,0.06);\n}\n\n/* Typography styles */\n.card-header-row {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin-top: 15px; /* Offset below punch hole */\n}\n\n.card-header-label {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 9.5px;\n    font-weight: 700;\n    color: var(--card-text-muted);\n    letter-spacing: 2px;\n    text-transform: uppercase;\n}\n\n.card-main-info {\n    display: flex;\n    flex-direction: column;\n    margin-top: 50px;\n}\n\n.card-name-text {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 38px;\n    font-weight: 700;\n    color: var(--card-text-color);\n    line-height: 1.1;\n    letter-spacing: -0.5px;\n}\n\n.card-divider-line {\n    height: 1px;\n    background: var(--card-divider-color);\n    margin: 18px 0;\n    width: 100%;\n}\n\n.card-role-text {\n    font-size: 14px;\n    font-weight: 500;\n    color: var(--card-text-secondary);\n    letter-spacing: 0.5px;\n}\n\n.card-metadata-row {\n    display: flex;\n    gap: 40px;\n    margin-top: 30px;\n}\n\n.card-meta-item {\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n}\n\n.card-meta-label {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 10px;\n    font-weight: 600;\n    color: var(--card-text-muted);\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n\n.card-meta-value {\n    font-size: 13.5px;\n    font-weight: 600;\n    color: var(--card-text-color);\n}\n\n/* Card Footer Logo section */\n.card-footer-row {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-top: auto;\n}\n\n.card-logo-container {\n    color: var(--card-text-color);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.card-brand-details {\n    display: flex;\n    flex-direction: column;\n}\n\n.card-brand-name {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 17px;\n    font-weight: 600;\n    color: var(--card-text-color);\n    letter-spacing: 0.5px;\n    line-height: 1.2;\n}\n\n.card-brand-subtext {\n    font-family: var(--font-family-title, 'Outfit'), sans-serif;\n    font-size: 8px;\n    font-weight: 700;\n    color: var(--card-text-muted);\n    letter-spacing: 1.5px;\n    text-transform: uppercase;\n    margin-top: 1px;\n}\n\n/* Glare overlay */\n.card-glare-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    z-index: 5;\n    mix-blend-mode: overlay;\n    background: radial-gradient(\n        circle at var(--glare-x, 50%) var(--glare-y, 50%),\n        rgba(255, 255, 255, 0.22) 0%,\n        rgba(255, 255, 255, 0) 55%\n    );\n}\n\n/* Email Contact Styling */\n.card-email-container {\n    display: flex;\n    flex-direction: column;\n    gap: 4px;\n    cursor: pointer;\n    align-self: flex-start;\n    width: 100%;\n}\n\n.card-email-value-row {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    color: #ffffff;\n}\n\n.card-email-value {\n    font-size: 13px;\n    font-weight: 500;\n    color: rgba(255, 255, 255, 0.9);\n    transition: color 0.2s ease;\n}\n\n.card-email-container:hover .card-email-value {\n    color: #ffffff;\n    text-decoration: underline;\n    text-decoration-color: rgba(255, 255, 255, 0.4);\n}\n\n.card-email-icon {\n    opacity: 0.4;\n    transition: opacity 0.2s ease, transform 0.2s ease;\n}\n\n.card-email-container:hover .card-email-icon {\n    opacity: 0.8;\n    transform: scale(1.1);\n}\n\n.card-email-copied {\n    font-size: 11px;\n    font-weight: 700;\n    color: #4ade80;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    animation: fadeIn 0.2s ease;\n}\n\n/* Action Bar Styling */\n.card-action-bar {\n    display: flex;\n    gap: 12px;\n    align-items: center;\n    background: rgba(255, 255, 255, 0.05);\n    backdrop-filter: blur(16px) saturate(120%);\n    -webkit-backdrop-filter: blur(16px) saturate(120%);\n    border: 1px solid rgba(255, 255, 255, 0.08);\n    border-radius: 30px;\n    padding: 8px 16px;\n    margin-top: 25px;\n    box-shadow: \n        0 15px 30px rgba(0, 0, 0, 0.2),\n        inset 0 1px 1px rgba(255, 255, 255, 0.1);\n    z-index: 100;\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.card-action-bar:hover {\n    background: rgba(255, 255, 255, 0.08);\n    border-color: rgba(255, 255, 255, 0.15);\n    transform: translateY(-2px);\n    box-shadow: \n        0 20px 35px rgba(0, 0, 0, 0.25),\n        inset 0 1px 1px rgba(255, 255, 255, 0.15);\n}\n\n.card-action-btn {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    background: transparent;\n    border: none;\n    color: rgba(255, 255, 255, 0.75);\n    font-family: var(--font-family-body, 'Plus Jakarta Sans'), -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n    font-size: 12px;\n    font-weight: 600;\n    cursor: pointer;\n    padding: 6px 12px;\n    border-radius: 20px;\n    transition: all 0.2s ease;\n    user-select: none;\n}\n\n.card-action-btn:hover {\n    color: #ffffff;\n    background: rgba(255, 255, 255, 0.08);\n}\n\n.card-action-btn:active {\n    transform: scale(0.95);\n}\n\n.card-action-divider {\n    width: 1px;\n    height: 16px;\n    background: rgba(255, 255, 255, 0.15);\n}\n" }} />
                  <div className="card-3d-container" style={{ height: "662px" }}>
                    <div className="lanyard-strap" style={{ backgroundColor: "rgb(217, 4, 41)", transformOrigin: "22px 197px", transform: "none" }}>
                      <div className="lanyard-strap-texture" />
                      <span className="lanyard-strap-text" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                        {"EASYSPARK × COZY"}
                      </span>
                    </div>
                    <div style={{ position: "absolute", top: "132px", left: "calc(50% - 40px)", width: "80px", height: "90px", transformOrigin: "40px 65px", zIndex: "1", transform: "none" }}>
                      <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                        <defs>
                          <linearGradient id="chromeBack" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="15%" stopColor="#d0d0d0" />
                            <stop offset="45%" stopColor="#707070" />
                            <stop offset="55%" stopColor="#f5f5f5" />
                            <stop offset="85%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#505050" />
                          </linearGradient>
                        </defs>
                        <path d="M 40 70 C 46 70, 52 66, 52 56 C 52 46, 46 32, 40 32" stroke="url(#chromeBack)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                    <div className="front-card-body" style={{ top: "172px", borderRadius: "24px", zIndex: "2", transformOrigin: "155px 25px", "--card-text-color": "#ffffff", "--card-text-secondary": "rgba(255, 255, 255, 0.85)", "--card-text-muted": "rgba(255, 255, 255, 0.45)", "--card-divider-color": "rgba(255, 255, 255, 0.2)", transform: "none" }}>
                      <svg width="100%" height="100%" viewBox="0 0 310 490" fill="none" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "0", opacity: "1" }}>
                        <defs>
                          <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(30, 0, 6)" />
                            <stop offset="50%" stopColor="rgb(45, 3, 9)" />
                            <stop offset="100%" stopColor="rgb(0, 0, 0)" />
                          </linearGradient>
                          <radialGradient id="meshGlowTopLeft" cx="20%" cy="20%" r="65%">
                            <stop offset="0%" stopColor="rgb(255, 77, 109)" stopOpacity="0.85" />
                            <stop offset="50%" stopColor="rgb(201, 24, 74)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(30, 0, 6)" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="meshGlowCenterRight" cx="85%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="rgb(255, 77, 109)" stopOpacity="0.9" />
                            <stop offset="40%" stopColor="rgb(201, 24, 74)" stopOpacity="0.55" />
                            <stop offset="80%" stopColor="rgb(255, 133, 161)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="meshGlowBottomRight" cx="90%" cy="85%" r="50%">
                            <stop offset="0%" stopColor="rgb(201, 24, 74)" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="meshGlowBottomLeft" cx="10%" cy="90%" r="45%">
                            <stop offset="0%" stopColor="rgb(255, 133, 161)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity="0" />
                          </radialGradient>
                          <filter id="cardNoise" x="0%" y="0%" width="100%" height="100%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.055 0" />
                            <feComposite operator="in" in2="SourceGraphic" />
                          </filter>
                          <filter id="meshBlur" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="35" />
                          </filter>
                        </defs>
                        <rect width="310" height="490" fill="url(#cardBg)" />
                        <g filter="url(#meshBlur)">
                          <rect width="310" height="490" fill="url(#meshGlowTopLeft)" />
                          <rect width="310" height="490" fill="url(#meshGlowCenterRight)" />
                          <rect width="310" height="490" fill="url(#meshGlowBottomRight)" />
                          <rect width="310" height="490" fill="url(#meshGlowBottomLeft)" />
                          <path d="M-50,60 Q90,50 160,200 T360,260 L360,-50 L-50,-50 Z" fill="rgb(255, 77, 109)" opacity="0.55" />
                          <path d="M-40,240 Q110,170 200,60 T350,40 L350,220 L-40,240 Z" fill="rgb(255, 133, 161)" opacity="0.35" />
                          <path d="M40,490 Q140,360 90,220 T280,30 L310,30 L310,490 Z" fill="#000000" opacity="0.72" />
                          <ellipse cx="210" cy="170" rx="80" ry="35" transform="rotate(-28, 210, 170)" fill="#ffffff" opacity="0.14" />
                        </g>
                        <rect width="310" height="490" fill="#ffffff" filter="url(#cardNoise)" style={{ mixBlendMode: "overlay", pointerEvents: "none" }} />
                      </svg>
                      <svg width="100%" height="100%" viewBox="0 0 310 490" fill="none" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "1", pointerEvents: "none" }}>
                        <path d="M -50 80 C 80 180, 200 120, 360 220" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" fill="none" opacity="0.5" />
                        <path d="M -50 140 C 80 240, 200 180, 360 280" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" fill="none" opacity="0.4" />
                        <path d="M -50 200 C 80 300, 200 240, 360 340" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" fill="none" opacity="0.6" />
                        <path d="M -50 260 C 80 360, 200 300, 360 400" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.8" fill="none" opacity="0.3" />
                        <path d="M -50 320 C 80 420, 200 360, 360 460" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" fill="none" opacity="0.4" />
                      </svg>
                      <div className="card-glare-overlay" style={{ "--glare-x": "50%", "--glare-y": "50%", opacity: "0" }} />
                      <div className="card-punch-hole" />
                      <div className="card-header-row" style={{ zIndex: "2" }}>
                        <span className="card-header-label">
                          {"CREATIVE PASS"}
                        </span>
                        <span className="card-header-label">
                          {"MEMBER CARD"}
                        </span>
                      </div>
                      <div className="card-main-info" style={{ zIndex: "2" }}>
                        <span className="card-name-text">
                          {"EasySpark"}
                        </span>
                        <div className="card-divider-line" />
                        <span className="card-role-text">
                          {"COZY STUDIO"}
                        </span>
                      </div>
                      <div className="card-metadata-row" style={{ zIndex: "2" }}>
                        <div className="card-meta-item">
                          <span className="card-meta-label">
                            {"Reference ID"}
                          </span>
                          <span className="card-meta-value">
                            {"#2026-05-31"}
                          </span>
                        </div>
                        <div className="card-meta-item">
                          <span className="card-meta-label">
                            {"Departement"}
                          </span>
                          <span className="card-meta-value">
                            {"Brand Experience"}
                          </span>
                        </div>
                      </div>
                      <div className="card-email-container" style={{ zIndex: "2", marginTop: "16px" }}>
                        <span className="card-meta-label">
                          {"Email"}
                        </span>
                        <div className="card-email-value-row">
                          <span className="card-email-value">
                            {"contact@easyspark.io"}
                          </span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="card-email-icon">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </div>
                      </div>
                      <div className="card-footer-row" style={{ zIndex: "2" }}>
                        <div className="card-logo-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.15" />
                          </svg>
                        </div>
                        <div className="card-brand-details">
                          <span className="card-brand-name">
                            {"EasySpark"}
                          </span>
                          <span className="card-brand-subtext">
                            {"COZY"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: "132px", left: "calc(50% - 40px)", width: "80px", height: "90px", transformOrigin: "40px 65px", zIndex: "10", pointerEvents: "none", filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))", transform: "none" }}>
                      <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                        <defs>
                          <linearGradient id="chrome3D" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="12%" stopColor="#d8d8d8" />
                            <stop offset="42%" stopColor="#606060" />
                            <stop offset="55%" stopColor="#f5f5f5" />
                            <stop offset="85%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#484848" />
                          </linearGradient>
                          <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="25%" stopColor="#c5c5c5" />
                            <stop offset="50%" stopColor="#555555" />
                            <stop offset="72%" stopColor="#eaeaea" />
                            <stop offset="100%" stopColor="#383838" />
                          </linearGradient>
                          <linearGradient id="chromeDark" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#888888" />
                            <stop offset="50%" stopColor="#383838" />
                            <stop offset="100%" stopColor="#181818" />
                          </linearGradient>
                        </defs>
                        <path d="M 12 10 C 12 5, 68 5, 68 10 L 65 18 C 65 21, 15 21, 15 18 Z" fill="url(#chromeMetal)" />
                        <rect x="18" y="10" width="44" height="5" rx="2" fill="#0d0d0d" opacity="0.65" />
                        <rect x="34" y="18" width="12" height="14" rx="2" fill="url(#chromeMetal)" />
                        <ellipse cx="40" cy="32" rx="10" ry="3" fill="url(#chromeMetal)" />
                        <line x1="40" y1="32" x2="49" y2="58" stroke="url(#chromeDark)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 40 32 C 27 32, 25 43, 25 56 C 25 68, 32 70, 40 70" stroke="url(#chrome3D)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                        <circle cx="40" cy="25" r="2.5" fill="url(#chromeDark)" />
                      </svg>
                    </div>
                  </div>
                  <div className="card-action-bar" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                    <button className="card-action-btn" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>
                        {"Copy Info"}
                      </span>
                    </button>
                    <div className="card-action-divider" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                    <button className="card-action-btn" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                      </svg>
                      <span>
                        {"Share on X"}
                      </span>
                    </button>
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
          <div id="overlay" />
        </Suspense>
      </div>
      <span data-fnj-slot={"2"} />
      {"\n\t"}
      <span data-fnj-slot={"3"} />
      {"\n\t\n\t\n\t"}
      <span data-fnj-slot={"4"} />
      {"\n\t"}
      <span data-fnj-slot={"5"} />
      {"\n\t"}
      <span data-fnj-slot={"6"} />
      <span data-fnj-slot={"7"} />
      <span data-fnj-slot={"8"} />
      <span data-fnj-slot={"9"} />
      <span data-fnj-slot={"10"} />
      <span data-fnj-slot={"11"} />
      <span data-fnj-slot={"12"} />
      <div id="svg-templates" style={{ position: "absolute", overflow: "hidden", bottom: "0", left: "0", width: "0", height: "0", zIndex: "0", contain: "strict" }} aria-hidden="true">
        {"\n"}
      </div>
      {"\n\t"}
      <span data-fnj-slot={"13"} />
      {"\n    \n    "}
      <span data-fnj-slot={"14"} />
      {"\n\n\n"}
    </body>
  );
}
