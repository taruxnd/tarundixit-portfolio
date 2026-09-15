"use client";

/** Editorial fragments for the AI Design System bento. */
export default function DesignSystemBento() {
  return (
    <div className="bento-visual bento-visual--system" aria-hidden>
      <div className="bento-tile bento-tile--tokens">
        <span className="bento-tile__label">Tokens</span>
        <div className="bento-token-row">
          <span className="bento-token">
            <i style={{ background: "#6d28d9" }} />
            Brand
          </span>
          <span className="bento-token">
            <i style={{ background: "#f7f7f5" }} />
            Surface
          </span>
          <span className="bento-token">
            <i style={{ background: "#141414" }} />
            Ink
          </span>
        </div>
      </div>

      <div className="bento-tile bento-tile--states">
        <span className="bento-tile__label">Button states</span>
        <div className="bento-state-row">
          <button type="button" tabIndex={-1} className="bento-mini-btn">
            Default
          </button>
          <button type="button" tabIndex={-1} className="bento-mini-btn is-active">
            Hover
          </button>
          <button type="button" tabIndex={-1} className="bento-mini-btn is-focus">
            Focus
          </button>
        </div>
      </div>

      <div className="bento-tile bento-tile--pattern">
        <span className="bento-tile__label">AI pattern</span>
        <strong>Prompt field</strong>
        <p>Composer + attach · generating · accept / edit</p>
      </div>

      <div className="bento-tile bento-tile--score">
        <strong>4.4</strong>
        <span>/5 speed</span>
      </div>
    </div>
  );
}
