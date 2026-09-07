"use client";

import { useEffect, useState } from "react";

const TOKENS = [
  { name: "Brand", value: "#6d28d9" },
  { name: "Surface", value: "#f7f7f5" },
  { name: "Ink", value: "#141414" },
  { name: "Success", value: "#16a34a" },
];

const STATES = ["Default", "Hover", "Focus", "Disabled"];

const AI_PATTERNS = [
  { label: "Prompt field", detail: "Composer + attach" },
  { label: "Generating", detail: "Cycling status" },
  { label: "Suggestion", detail: "Accept / edit" },
];

export default function DesignSystemWindow() {
  const [stateIndex, setStateIndex] = useState(1);
  const [patternIndex, setPatternIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const stateTimer = window.setInterval(() => {
      setStateIndex((i) => (i + 1) % STATES.length);
    }, 2200);

    const patternTimer = window.setInterval(() => {
      setPatternIndex((i) => (i + 1) % AI_PATTERNS.length);
    }, 2800);

    return () => {
      window.clearInterval(stateTimer);
      window.clearInterval(patternTimer);
    };
  }, []);

  return (
    <div className="project-window project-window--system" aria-hidden>
      <div className="project-window__stage project-window__stage--system">
        <div className="system-plane">
          <header className="system-hero">
            <p className="system-hero__eyebrow">Foundation</p>
            <h3 className="system-hero__title">AI Design System</h3>
            <p className="system-hero__sub">
              Tokens, components, and AI patterns for shipping product UI.
            </p>
          </header>

          <div className="system-tokens">
            {TOKENS.map((token) => (
              <div key={token.name} className="system-token">
                <span
                  className="system-token__swatch"
                  style={{ background: token.value }}
                />
                <div>
                  <strong>{token.name}</strong>
                  <em>{token.value}</em>
                </div>
              </div>
            ))}
          </div>

          <div className="system-row">
            <div className="system-buttons">
              <p className="system-label">Button states</p>
              <div className="system-buttons__row">
                {STATES.map((state, i) => (
                  <button
                    key={state}
                    type="button"
                    tabIndex={-1}
                    className={`system-btn${i === stateIndex ? " is-active" : ""}`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <div className="system-ai">
              <p className="system-label">AI patterns</p>
              <ul>
                {AI_PATTERNS.map((pattern, i) => (
                  <li
                    key={pattern.label}
                    className={i === patternIndex ? "is-active" : undefined}
                  >
                    <strong>{pattern.label}</strong>
                    <span>{pattern.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="system-spec">
            <div className="system-spec__field">
              <span className="system-spec__spark">✦</span>
              Describe the interface you want to generate…
            </div>
            <div className="system-spec__meta">
              <span>Radius 8</span>
              <span>Type roles</span>
              <span>Semantic color</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
