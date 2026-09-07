import React, { Suspense } from "react";
import Layout from "@/src/Layout";


/** The repeated copy in this section: every visible string, and every link.
 *
 *  Framer inlines one subtree per breakpoint — desktop, tablet, phone — so
 *  each of these appears once per breakpoint in the markup. Edit it here and
 *  all of them change. */
export const copy = {
  theme: "THEME",
  mi: "MI",
  ds: "DS",
  an: "AN",
  ti: "TI",
  style: "STYLE",
  minimal: "Minimal",
  classic: "Classic",
  comet: "Comet",
  streak: "Streak",
  neon: "Neon",
  direction: "DIRECTION",
  interval: "INTERVAL",
  text2: "2",
  s: "s",
  meteors: "METEORS",
} as const;

/** The "/" page, composed from its Framer sections.
 *
 *  Rendered to static HTML by scripts/prerender.mts at build time — never
 *  shipped as a page.tsx, which would duplicate every byte of this markup into
 *  the RSC flight payload on top of the HTML itself. */
export default function HomePage() {
  return (
    <body>
      <Layout>
      {"\n\t\n\t"}
      <span data-fnj-slot={"0"} />
      {"\n    \n    "}
      <span data-fnj-slot={"1"} />
      {"\n\t\n\t"}
      <div id="main" data-framer-hydrate-v2={"{\"routeId\":\"augiA20Il\",\"localeId\":\"default\",\"breakpoints\":[{\"hash\":\"72rtr7\",\"mediaQuery\":\"(min-width: 1200px)\"},{\"hash\":\"gsij4b\",\"mediaQuery\":\"(min-width: 810px) and (max-width: 1199.98px)\"},{\"hash\":\"12idv62\",\"mediaQuery\":\"(max-width: 809.98px)\"}]}"} data-framer-ssr-released-at="2026-07-21T06:52:36.655Z" data-framer-page-optimized-at="2026-07-25T18:12:55.681Z" data-framer-generated-page="">
        <Suspense fallback={null}>
          <style data-framer-html-style="" dangerouslySetInnerHTML={{ __html: "html body { background: rgb(255, 255, 255); }" }} />
          <div data-framer-root="" className="framer-wZjfP framer-72rtr7" style={{ minHeight: "100vh", width: "auto" }}>
            <div className="framer-9ox55w-container">
              <Suspense fallback={null}>
                <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }} height="100%" id="U1ZTUXjRD" width="100%">
                  <canvas style={{ position: "absolute", inset: "0", width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", top: "16px", left: "16px", right: "16px", display: "flex", justifyContent: "center", zIndex: "10" }}>
                    <div style={{ background: "rgba(10, 10, 14, 0.88)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: "12px 20px", alignItems: "flex-end", justifyContent: "center", userSelect: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.8px", color: "rgba(255,255,255,0.35)", marginBottom: "9px", textTransform: "uppercase", fontFamily: "system-ui,-apple-system,sans-serif", fontWeight: "500" }}>
                          {copy.theme}
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.92)", color: "#111", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.mi}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.ds}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.an}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.ti}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.8px", color: "rgba(255,255,255,0.35)", marginBottom: "9px", textTransform: "uppercase", fontFamily: "system-ui,-apple-system,sans-serif", fontWeight: "500" }}>
                          {copy.style}
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.92)", color: "#111", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.minimal}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.classic}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.comet}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.streak}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {copy.neon}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.8px", color: "rgba(255,255,255,0.35)", marginBottom: "9px", textTransform: "uppercase", fontFamily: "system-ui,-apple-system,sans-serif", fontWeight: "500" }}>
                          {copy.direction}
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.92)", color: "#111", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {"→"}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {"↔"}
                          </button>
                          <button style={{ padding: "5px 9px", borderRadius: "7px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "system-ui,-apple-system,sans-serif", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", transition: "background 0.15s, color 0.15s", outline: "none" }}>
                            {"←"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.8px", color: "rgba(255,255,255,0.35)", marginBottom: "9px", textTransform: "uppercase", fontFamily: "system-ui,-apple-system,sans-serif", fontWeight: "500" }}>
                          {copy.interval}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "700", cursor: "pointer", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}>
                            {"−"}
                          </button>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.8)", fontFamily: "system-ui,-apple-system,sans-serif", minWidth: "28px", textAlign: "center" }}>
                            {copy.text2}
                            <span data-fnj-slot={"2"} />
                            {copy.s}
                          </span>
                          <button style={{ width: "22px", height: "22px", borderRadius: "6px", border: "none", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "700", cursor: "pointer", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}>
                            {"+"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.8px", color: "rgba(255,255,255,0.35)", marginBottom: "9px", textTransform: "uppercase", fontFamily: "system-ui,-apple-system,sans-serif", fontWeight: "500" }}>
                          {copy.meteors}
                        </div>
                        <div style={{ width: "38px", height: "22px", borderRadius: "11px", background: "#00C897", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: "0" }}>
                          <div style={{ position: "absolute", top: "3px", left: "18px", width: "16px", height: "16px", borderRadius: "8px", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
          <div id="overlay" />
        </Suspense>
      </div>
      <span data-fnj-slot={"3"} />
      {"\n\t"}
      <span data-fnj-slot={"4"} />
      {"\n\t\n\t\n\t"}
      <span data-fnj-slot={"5"} />
      {"\n\t"}
      <span data-fnj-slot={"6"} />
      {"\n\t"}
      <span data-fnj-slot={"7"} />
      <span data-fnj-slot={"8"} />
      <span data-fnj-slot={"9"} />
      <span data-fnj-slot={"10"} />
      <span data-fnj-slot={"11"} />
      <span data-fnj-slot={"12"} />
      <span data-fnj-slot={"13"} />
      <div id="svg-templates" style={{ position: "absolute", overflow: "hidden", bottom: "0", left: "0", width: "0", height: "0", zIndex: "0", contain: "strict" }} aria-hidden="true">
        {"\n"}
      </div>
      {"\n\t"}
      <span data-fnj-slot={"14"} />
      {"\n    \n    "}
      <span data-fnj-slot={"15"} />
      {"\n\n\n"}
      </Layout>
    </body>
  );
}
