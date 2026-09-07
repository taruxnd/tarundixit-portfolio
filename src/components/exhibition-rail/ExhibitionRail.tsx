import "./exhibition-rail.css";

const RAIL_ITEMS = [
  "AI Products",
  "Design Systems",
  "Agentic UX",
  "Vibe Coding",
  "Human-Centered AI",
  "Rapid Prototyping",
  "Design Engineering",
  "Product Thinking",
] as const;

function RailGroup({
  hidden,
}: {
  hidden?: boolean;
}) {
  return (
    <ul
      className="exhibition-rail__group"
      aria-hidden={hidden || undefined}
    >
      {RAIL_ITEMS.map((label, index) => (
        <li key={`${label}-${index}`} className="exhibition-rail__item">
          <span className="exhibition-rail__index">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="exhibition-rail__mark" aria-hidden>
            ✦
          </span>
          <span className="exhibition-rail__label">{label}</span>
          <span className="exhibition-rail__divider" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export default function ExhibitionRail() {
  return (
    <div className="exhibition-rail theme-transition" aria-label="Focus areas">
      <div className="exhibition-rail__track">
        <RailGroup />
        <RailGroup hidden />
      </div>
    </div>
  );
}
