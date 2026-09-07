import type { CursorMode } from "./utils";

export const YOU_TAG_COLOR = "#6366f1";

export function FigmaPointer({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      aria-hidden
      className="figma-cursor__arrow"
    >
      <path
        d="M1 1L1 13.8L4.1 10.7L6.2 15.2L8.1 14.4L6 9.9H10.5L1 1Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function YouPointer({ mode }: { mode: CursorMode }) {
  const scale = mode === "interactive" ? 1.06 : mode === "label" ? 1.04 : 1;
  const rotate = mode === "label" ? -5 : 0;

  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      aria-hidden
      className="you-cursor__arrow"
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <path
        d="M1 1L1 13.8L4.1 10.7L6.2 15.2L8.1 14.4L6 9.9H10.5L1 1Z"
        fill={YOU_TAG_COLOR}
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function YouTag({ mode }: { mode: CursorMode }) {
  const shiftX = mode === "label" ? 2 : 0;
  const shiftY = mode === "label" ? -1 : 0;
  const scale = mode === "interactive" ? 1.05 : 1;

  return (
    <span
      className="figma-cursor__tag"
      style={{
        backgroundColor: YOU_TAG_COLOR,
        transform: `translate(${shiftX}px, ${shiftY}px) scale(${scale})`,
      }}
    >
      You
    </span>
  );
}

export function FigmaNameTag({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <span className="figma-cursor__tag" style={{ backgroundColor: color }}>
      {name}
    </span>
  );
}
