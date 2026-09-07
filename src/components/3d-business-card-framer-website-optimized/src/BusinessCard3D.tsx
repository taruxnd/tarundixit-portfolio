"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/components/ThemeController";
import { businessCardDefaults } from "./cardData";
import "./business-card.css";

const TILT_AMOUNT = 14;
const SPRING_CONFIG = { damping: 25, stiffness: 150, mass: 0.6 };
const HANG_SPRING = { type: "spring" as const, stiffness: 90, damping: 16, mass: 0.85 };
const STRAP_BASE_HEIGHT = 148;
const STRAP_PIVOT_BELOW = 49;
/** Design-size canvas; visual size via --card-scale (default 0.7). */
const CARD_DESIGN_WIDTH = 310;
const CARD_DESIGN_HEIGHT = 662;
const DEFAULT_CARD_SCALE = 0.7;
/** Desktop ceiling when matching the experience panel height. */
const MATCH_SCALE_MAX = 1;

interface BusinessCard3DProps {
  interactive3d?: boolean;
  /** Selector for the section top the lanyard hangs from */
  hangFromSelector?: string;
  /** Selector whose height the hanging composition should match (desktop). */
  matchHeightSelector?: string;
}

export default function BusinessCard3D({
  interactive3d = true,
  hangFromSelector,
  matchHeightSelector,
}: BusinessCard3DProps) {
  const { reducedMotion } = useTheme();
  const tiltEnabled = interactive3d && !reducedMotion;
  const uid = useId().replace(/:/g, "");
  const [cardScale, setCardScale] = useState(DEFAULT_CARD_SCALE);

  const {
    lanyardText,
    lanyardColor,
    lanyardTextColor,
    name,
    photoSrc,
    photoAlt,
    role,
    currentFocusLabel,
    currentFocus,
    buildingLabel,
    building,
    locationLabel,
    location,
    status,
    email,
    bgGradientStart,
    bgGradientMiddle,
    bgGradientEnd,
    accentColor1,
    accentColor2,
    accentColor3,
  } = businessCardDefaults;

  const hangControls = useAnimationControls();
  const [hovering, setHovering] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [TILT_AMOUNT, -TILT_AMOUNT]),
    SPRING_CONFIG,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-TILT_AMOUNT, TILT_AMOUNT]),
    SPRING_CONFIG,
  );
  const glareX = useTransform(pointerX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(
    useTransform(pointerX, [-0.5, 0, 0.5], [0.8, 0, 0.8]),
    SPRING_CONFIG,
  );

  const [emailCopyState, setEmailCopyState] = useState<"idle" | "success">(
    "idle",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [lanyardExtension, setLanyardExtension] = useState(0);
  const cardScaleRef = useRef(cardScale);
  cardScaleRef.current = cardScale;

  useLayoutEffect(() => {
    if (!matchHeightSelector) {
      setCardScale(DEFAULT_CARD_SCALE);
      return;
    }

    const measureScale = () => {
      if (window.innerWidth < 1024) {
        setCardScale(DEFAULT_CARD_SCALE);
        return;
      }

      const target = document.querySelector(matchHeightSelector);
      if (!(target instanceof HTMLElement)) return;

      const targetHeight = target.getBoundingClientRect().height;
      if (targetHeight < 8) return;

      const next = Math.min(
        MATCH_SCALE_MAX,
        Math.max(DEFAULT_CARD_SCALE, targetHeight / CARD_DESIGN_HEIGHT),
      );
      setCardScale((prev) => (Math.abs(prev - next) < 0.004 ? prev : next));
    };

    measureScale();

    const target = document.querySelector(matchHeightSelector);
    const observer = new ResizeObserver(measureScale);
    if (target) observer.observe(target);
    window.addEventListener("resize", measureScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureScale);
    };
  }, [matchHeightSelector]);

  useLayoutEffect(() => {
    if (!hangFromSelector) {
      setLanyardExtension(0);
      return;
    }

    const measure = () => {
      const container = containerRef.current;
      const anchor = document.querySelector(hangFromSelector);
      if (!container || !anchor) return;

      if (window.innerWidth < 1024) {
        setLanyardExtension(0);
        return;
      }

      // Hang from the section's outer top so the strap touches the top edge.
      // Extension is in design-space px (pre-scale) so the scaled visual still reaches.
      // Slight overshoot so the strap disappears into the ceiling (clipped by section).
      const anchorTop = anchor.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      const LANYARD_OVERSHOOT = 3;
      const scale = cardScaleRef.current;
      setLanyardExtension(
        Math.max(
          0,
          Math.round((containerTop - anchorTop) / scale) + LANYARD_OVERSHOOT,
        ),
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    const container = containerRef.current;
    const anchor = document.querySelector(hangFromSelector);
    if (container) observer.observe(container);
    if (anchor) observer.observe(anchor);

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [hangFromSelector, cardScale]);

  const strapHeight = STRAP_BASE_HEIGHT + lanyardExtension;
  const strapPivotY = strapHeight + STRAP_PIVOT_BELOW;
  const hangOriginY = -lanyardExtension;

  useEffect(() => {
    if (reducedMotion) {
      void hangControls.start({ rotate: 0, y: 0 });
      return;
    }

    if (hovering) {
      void hangControls.start({
        rotate: 3.2,
        y: -6,
        transition: HANG_SPRING,
      });
      return;
    }

    let cancelled = false;

    void hangControls
      .start({ rotate: 0, y: 0, transition: HANG_SPRING })
      .then(() => {
        if (cancelled || reducedMotion) return;
        void hangControls.start({
          rotate: [0, 2.1, -0.35, -1.9, 0.25, 2.1, 0],
          y: [0, 1.4, 0.5, -1.1, 0.2, 0.9, 0],
          transition: {
            duration: 10.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        });
      });

    return () => {
      cancelled = true;
    };
  }, [hangControls, hovering, reducedMotion]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!tiltEnabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(x);
      pointerY.set(y);
    },
    [pointerX, pointerY, tiltEnabled],
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
    setHovering(false);
  }, [pointerX, pointerY]);

  const handlePointerEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const handleCopyEmail = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      try {
        await navigator.clipboard.writeText(email);
        setEmailCopyState("success");
        setTimeout(() => setEmailCopyState("idle"), 2000);
      } catch (error) {
        console.error("Failed to copy email: ", error);
      }
    },
    [email],
  );

  const tiltRotateX = tiltEnabled ? rotateX : 0;
  const tiltRotateY = tiltEnabled ? rotateY : 0;

  return (
    <div
      className={`card-mockup-wrapper${hovering ? " is-hovering" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={
        {
          "--font-family-title": "Outfit",
          "--font-family-body": "Plus Jakarta Sans",
          "--card-scale": String(cardScale),
        } as React.CSSProperties
      }
    >
      <div
        ref={containerRef}
        className="card-3d-container"
        style={{ height: CARD_DESIGN_HEIGHT * cardScale }}
      >
        <div className="card-3d-scale">
        <motion.div
          className="card-hang-sway"
          animate={hangControls}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformOrigin: `${CARD_DESIGN_WIDTH / 2}px ${hangOriginY}px`,
            transformStyle: "preserve-3d",
          }}
        >
        <motion.div
          className="lanyard-strap"
          style={{
            backgroundColor: lanyardColor,
            top: -lanyardExtension,
            height: strapHeight,
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformOrigin: `22px ${strapPivotY}px`,
          }}
        >
          <div className="lanyard-strap-texture" />
          <span
            className="lanyard-strap-text"
            style={{ color: lanyardTextColor }}
          >
            {lanyardText}
          </span>
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            top: 132,
            left: "calc(50% - 40px)",
            width: 80,
            height: 90,
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformOrigin: "40px 65px",
            zIndex: 1,
          }}
        >
          <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
            <defs>
              <linearGradient
                id={`${uid}-chromeBack`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="20%" stopColor="#a8a8a8" />
                <stop offset="50%" stopColor="#585858" />
                <stop offset="72%" stopColor="#d4d4d4" />
                <stop offset="100%" stopColor="#707070" />
              </linearGradient>
            </defs>
            <path
              d="M 40 68 C 44 68, 48 64, 48 56 C 48 48, 44 34, 40 34"
              stroke={`url(#${uid}-chromeBack)`}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>

        <motion.div
          className="card-id-assembly"
          style={{
            position: "absolute",
            top: 172,
            left: "calc(50% - 161px)",
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformOrigin: "161px 25px",
            zIndex: 2,
          }}
        >
          <div className="card-glass-casing">
            <span
              className="card-glass-casing__glint card-glass-casing__glint--tl"
              aria-hidden
            />
            <span
              className="card-glass-casing__glint card-glass-casing__glint--br"
              aria-hidden
            />
            <div
              className="front-card-body"
              style={
                {
                  borderRadius: 24,
                  "--card-text-color": "#f5f0f2",
                  "--card-text-secondary": "rgba(245, 240, 242, 0.78)",
                  "--card-text-muted": "rgba(245, 240, 242, 0.42)",
                  "--card-divider-color": "rgba(255, 255, 255, 0.14)",
                } as CSSProperties
              }
            >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 310 490"
            fill="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              opacity: 1,
            }}
          >
            <defs>
              <linearGradient
                id={`${uid}-cardBg`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={bgGradientStart} />
                <stop offset="50%" stopColor={bgGradientMiddle} />
                <stop offset="100%" stopColor={bgGradientEnd} />
              </linearGradient>
              <radialGradient
                id={`${uid}-meshGlowTopLeft`}
                cx="18%"
                cy="15%"
                r="55%"
              >
                <stop offset="0%" stopColor={accentColor1} stopOpacity="0.55" />
                <stop
                  offset="55%"
                  stopColor={accentColor2}
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor={bgGradientStart}
                  stopOpacity="0"
                />
              </radialGradient>
              <radialGradient
                id={`${uid}-meshGlowCenterRight`}
                cx="88%"
                cy="38%"
                r="50%"
              >
                <stop offset="0%" stopColor={accentColor3} stopOpacity="0.35" />
                <stop
                  offset="60%"
                  stopColor={accentColor2}
                  stopOpacity="0.12"
                />
                <stop
                  offset="100%"
                  stopColor={bgGradientEnd}
                  stopOpacity="0"
                />
              </radialGradient>
              <filter
                id={`${uid}-cardNoise`}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="4"
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0"
                />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
              <filter
                id={`${uid}-meshBlur`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="42" />
              </filter>
            </defs>
            <rect width="310" height="490" fill={`url(#${uid}-cardBg)`} />
            <g filter={`url(#${uid}-meshBlur)`} opacity="0.85">
              <rect
                width="310"
                height="490"
                fill={`url(#${uid}-meshGlowTopLeft)`}
              />
              <rect
                width="310"
                height="490"
                fill={`url(#${uid}-meshGlowCenterRight)`}
              />
            </g>
            <rect
              width="310"
              height="490"
              fill="#ffffff"
              filter={`url(#${uid}-cardNoise)`}
              style={{ mixBlendMode: "soft-light", pointerEvents: "none" }}
            />
          </svg>

          {tiltEnabled && (
            <motion.div
              className="card-glare-overlay"
              style={
                {
                  "--glare-x": glareX,
                  "--glare-y": glareY,
                  opacity: glareOpacity,
                } as unknown as CSSProperties
              }
            />
          )}

          <div className="card-punch-hole" />

          <div className="card-header-row" style={{ zIndex: 2 }}>
            <span className="card-header-label">{currentFocusLabel}</span>
            <span className="card-status-badge">
              <span className="card-status-dot" aria-hidden />
              {status}
            </span>
          </div>

          <div className="card-photo-frame" style={{ zIndex: 2 }}>
            <Image
              src={photoSrc}
              alt={photoAlt}
              width={246}
              height={198}
              className="card-photo-image"
              sizes="246px"
              priority={false}
            />
          </div>

          <div className="card-main-info" style={{ zIndex: 2 }}>
            <span className="card-name-text">{name}</span>
            <div className="card-divider-line" />
            <span className="card-role-text">{role}</span>
          </div>

          <div className="card-focus-block" style={{ zIndex: 2 }}>
            <span className="card-focus-text">{currentFocus}</span>
          </div>

          <div className="card-metadata-row" style={{ zIndex: 2 }}>
            <div className="card-meta-item">
              <span className="card-meta-label">{buildingLabel}</span>
              <span className="card-meta-value">{building}</span>
            </div>
            <div className="card-meta-item">
              <span className="card-meta-label">{locationLabel}</span>
              <span className="card-meta-value card-location-value">
                <span aria-hidden>📍</span> {location}
              </span>
            </div>
          </div>

          <div
            className="card-email-container"
            style={{ zIndex: 2 }}
            onClick={handleCopyEmail}
          >
            <span className="card-meta-label">Email</span>
            <div className="card-email-value-row">
              <span className="card-email-value">{email}</span>
              {emailCopyState === "success" ? (
                <span className="card-email-copied">Copied!</span>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="card-email-icon"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </div>
          </div>

          <div className="card-footer-row" style={{ zIndex: 2 }}>
            <div className="card-logo-container" aria-hidden>
              TD
            </div>
            <div className="card-brand-details">
              <span className="card-brand-name">{building}</span>
              <span className="card-brand-subtext">{buildingLabel}</span>
            </div>
          </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            top: 132,
            left: "calc(50% - 40px)",
            width: 80,
            height: 90,
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformOrigin: "40px 65px",
            zIndex: 10,
            pointerEvents: "none",
            filter: "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.28))",
          }}
        >
          <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
            <defs>
              <linearGradient
                id={`${uid}-chrome3D`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="18%" stopColor="#c8c8c8" />
                <stop offset="45%" stopColor="#686868" />
                <stop offset="58%" stopColor="#e2e2e2" />
                <stop offset="88%" stopColor="#fafafa" />
                <stop offset="100%" stopColor="#505050" />
              </linearGradient>
              <linearGradient
                id={`${uid}-chromeMetal`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ececec" />
                <stop offset="28%" stopColor="#b0b0b0" />
                <stop offset="52%" stopColor="#484848" />
                <stop offset="74%" stopColor="#d8d8d8" />
                <stop offset="100%" stopColor="#303030" />
              </linearGradient>
              <linearGradient
                id={`${uid}-chromeDark`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7a7a7a" />
                <stop offset="50%" stopColor="#323232" />
                <stop offset="100%" stopColor="#141414" />
              </linearGradient>
            </defs>
            <path
              d="M 14 11 C 14 7, 66 7, 66 11 L 63 17 C 63 19.5, 17 19.5, 17 17 Z"
              fill={`url(#${uid}-chromeMetal)`}
            />
            <rect x="19" y="11" width="42" height="4" rx="1.5" fill="#0a0a0a" opacity="0.55" />
            <rect
              x="35"
              y="18"
              width="10"
              height="12"
              rx="1.5"
              fill={`url(#${uid}-chromeMetal)`}
            />
            <ellipse
              cx="40"
              cy="30"
              rx="8"
              ry="2.5"
              fill={`url(#${uid}-chromeMetal)`}
            />
            <line
              x1="40"
              y1="30"
              x2="47"
              y2="52"
              stroke={`url(#${uid}-chromeDark)`}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 40 30 C 29 30, 27 40, 27 52 C 27 62, 33 64, 40 64"
              stroke={`url(#${uid}-chrome3D)`}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="40" cy="24" r="2" fill={`url(#${uid}-chromeDark)`} />
          </svg>
        </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
