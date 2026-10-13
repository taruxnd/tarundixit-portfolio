import "./wip.css";

/** Fills its container with a quiet "Work in progress" card. */
export default function WipPlaceholder({ label = "Work in progress" }: { label?: string }) {
  return (
    <div className="wip-placeholder" role="img" aria-label={label}>
      <span className="wip-placeholder__dot" aria-hidden />
      <span className="wip-placeholder__label">{label}</span>
    </div>
  );
}
