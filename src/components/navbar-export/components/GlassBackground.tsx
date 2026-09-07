"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { generateLensDisplacementMap } from "./lensDisplacement";
import { lacksSvgBackdropFilterSupport } from "./browserSupport";
import { LIQUID_GLASS_SHADOW } from "./utils";
import type { NavbarBackground } from "../types";

interface GlassBackgroundProps extends NavbarBackground {
  cornerRadius?: number;
  style?: CSSProperties;
  children: ReactNode;
}

function OverlayGlass({
  blur = 0,
  bevelDepth = 0.5,
  bevelWidth = 0.5,
  edgeHighlight = 0.85,
  magnify = 0,
  shadowOffset = 10,
  specularIntensity = 1,
  rainbowIntensity = 0.5,
  refraction = 60,
  cornerRadius = 100,
  style,
  children,
}: GlassBackgroundProps) {
  const filterId = useId().replace(/:/g, "");
  const lensFilterId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensMap, setLensMap] = useState("");
  const [lensScale, setLensScale] = useState(0);
  const sizeRef = useRef<{ width: number; height: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      sizeRef.current = { width: rect.width, height: rect.height };
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const size = sizeRef.current;
        if (!size) return;
        setLensMap(generateLensDisplacementMap(size.width, size.height));
        setLensScale(Math.min(size.width, size.height) * 0.18);
        timeoutRef.current = null;
      }, 80);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cornerRadius]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        borderRadius: cornerRadius,
        isolation: "isolate",
        ...style,
      }}
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="2"
              seed="5"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bevelWidth * 5} 0`}
              in="SourceAlpha"
              result="alphaNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={Math.min(refraction * 2, 120)}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced1"
            />
            <feOffset dx={rainbowIntensity * 3} dy={0} in="displaced1" result="redShift" />
            <feOffset dx={-rainbowIntensity * 3} dy={0} in="displaced1" result="blueShift" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              in="redShift"
              result="redChannel"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              in="displaced1"
              result="greenChannel"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              in="blueShift"
              result="blueChannel"
            />
            <feBlend mode="screen" in="redChannel" in2="greenChannel" result="rgBlend" />
            <feBlend mode="screen" in="rgBlend" in2="blueChannel" result="chromatic" />
            <feComponentTransfer in="chromatic" result="magnified">
              <feFuncR type="linear" slope={1 + magnify} />
              <feFuncG type="linear" slope={1 + magnify} />
              <feFuncB type="linear" slope={1 + magnify} />
            </feComponentTransfer>
            <feSpecularLighting
              in="SourceAlpha"
              surfaceScale={bevelDepth * 5}
              specularConstant={specularIntensity}
              specularExponent="60"
              lightingColor="#ffffff"
              result="highlightRaw"
            >
              <fePointLight x="50" y="-50" z="100" />
            </feSpecularLighting>
            <feColorMatrix
              in="highlightRaw"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
              result="highlight"
            />
            <feDropShadow
              dx="0"
              dy={shadowOffset}
              stdDeviation={shadowOffset * 0.8}
              floodOpacity="0.25"
              result="shadow"
            />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="magnified" />
              <feMergeNode in="highlight" />
            </feMerge>
          </filter>
          {lensMap && (
            <filter
              id={lensFilterId}
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feImage
                href={lensMap}
                // Safari older builds expect xlink:href on feImage
                {...({ xlinkHref: lensMap } as Record<string, string>)}
                preserveAspectRatio="none"
                result="lensMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lensMap"
                scale={lensScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          )}
        </defs>
      </svg>

      {lensMap && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: cornerRadius,
            zIndex: 0,
            backdropFilter: `blur(${blur * 0.25}px) url(#${lensFilterId}) contrast(1.1) brightness(1.0) saturate(1.05)`,
            WebkitBackdropFilter: `blur(${blur * 0.25}px) url(#${lensFilterId}) contrast(1.1) brightness(1.0) saturate(1.05)`,
            boxShadow:
              "0 4px 8px rgba(0,0,0,0.25), 0 -10px 25px inset rgba(0,0,0,0.15)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: cornerRadius,
          zIndex: 1,
          backdropFilter: `blur(${blur}px) url(#${filterId})`,
          WebkitBackdropFilter: `blur(${blur}px) url(#${filterId})`,
          boxShadow: [
            `inset 0 ${bevelDepth * 2}px ${bevelWidth * 10}px rgba(255,255,255,0.22)`,
            `inset 0 0 0 ${Math.max(0, edgeHighlight * 2)}px rgba(255,255,255,${edgeHighlight * 0.12})`,
          ].join(", "),
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export function GlassBackground({
  mode = "overlay",
  blur = 0,
  saturation = 160,
  tintColor = "#ffffff",
  tintOpacity = 0.08,
  glassTint = "rgba(255,255,255,0.15)",
  solidColor = "rgba(255,255,255,0.9)",
  edgeHighlight = 0.85,
  cornerRadius = 100,
  style,
  children,
  ...overlayProps
}: GlassBackgroundProps) {
  const liquidShadow = useMemo(() => {
    const extra = style?.boxShadow;
    return extra ? `${LIQUID_GLASS_SHADOW}, ${extra}` : LIQUID_GLASS_SHADOW;
  }, [style?.boxShadow]);

  const [supportsOverlayGlass, setSupportsOverlayGlass] = useState(false);

  useLayoutEffect(() => {
    setSupportsOverlayGlass(
      mode === "overlay" && !lacksSvgBackdropFilterSupport(),
    );
  }, [mode]);

  const cssGlass = (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: cornerRadius,
        isolation: "isolate",
        boxShadow: liquidShadow,
        border: "1px solid rgba(0, 0, 0, 0.06)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: tintColor,
          opacity: tintOpacity,
          pointerEvents: "none",
        }}
      />
      {edgeHighlight > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: cornerRadius,
            pointerEvents: "none",
            boxShadow: [
              `inset 0 1px 0 rgba(255,255,255,${edgeHighlight * 0.7})`,
              `inset 0 -1px 0 rgba(255,255,255,${edgeHighlight * 0.2})`,
              `inset 1px 0 0 rgba(255,255,255,${edgeHighlight * 0.3})`,
              `inset -1px 0 0 rgba(255,255,255,${edgeHighlight * 0.15})`,
            ].join(", "),
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );

  if (mode === "overlay") {
    if (!supportsOverlayGlass) return cssGlass;

    return (
      <OverlayGlass
        blur={blur}
        cornerRadius={cornerRadius}
        edgeHighlight={edgeHighlight}
        style={style}
        {...overlayProps}
      >
        {children}
      </OverlayGlass>
    );
  }

  if (mode === "liquid") {
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: cornerRadius,
          isolation: "isolate",
          background: glassTint,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          boxShadow: liquidShadow,
          ...style,
        }}
      >
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    );
  }

  if (mode === "solid") {
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: cornerRadius,
          isolation: "isolate",
          background: solidColor,
          ...style,
        }}
      >
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    );
  }

  if (mode === "css") {
    return cssGlass;
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: cornerRadius,
        isolation: "isolate",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: tintColor,
          opacity: tintOpacity,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
