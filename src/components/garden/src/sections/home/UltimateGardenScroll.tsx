import React, { Suspense } from "react";

/** Generated from the Framer section "UltimateGardenScroll".
 *  Renders to the same DOM as the original — the Suspense boundaries here are
 *  Framer's hydration markers, so removing them would break its runtime.
 *  Everything else is ordinary JSX: edit it like any other component. */
export default function UltimateGardenScroll() {
  return (
    <div className="framer-ea39x2" data-framer-name="UltimateGardenScroll">
      <div className="framer-1nrlubt" style={{ transform: "translateX(-50%)" }} data-framer-component-type="RichTextContainer">
        <h5 dir="auto" style={{ "--font-selector": "SW50ZXItQm9sZA==", "--framer-font-open-type-features": "'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on", "--framer-font-size": "80px", "--framer-font-weight": "700", "--framer-letter-spacing": "-0.04em", "--framer-text-alignment": "center", "--framer-text-color": "var(--token-250cf0d2-604d-4605-b07d-1fd17e948256, rgb(241, 248, 248))" }} className="framer-text">
          <span style={{ "--framer-font-size": "82px" }} className="framer-text">
            {"ULTIMATE GARDEN"}
          </span>
          <span style={{ "--framer-font-size": "82px" }} className="framer-text">
            <br className="framer-text" />
          </span>
          <span style={{ "--framer-font-size": "82px" }} className="framer-text">
            {"SCROLL"}
          </span>
        </h5>
      </div>
      <div className="framer-2p38bg-container">
        <Suspense fallback={null}>
          <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "rgba(14, 18, 14, 0)", overflow: "hidden" }}>
            <canvas style={{ width: "100%", height: "100%", pointerEvents: "none", display: "block" }} />
            <div style={{ position: "absolute", inset: "0", pointerEvents: "none", boxShadow: "inset 0 0 110px rgb(0, 0, 0)" }} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
