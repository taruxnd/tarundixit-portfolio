import type { MarqueeRect } from "./useAmbientHeroSelect";

export default function FigmaMarquee({
  rect,
  color,
}: {
  rect: MarqueeRect;
  color: string;
}) {
  return (
    <div
      className="figma-marquee"
      style={{
        left: rect.left,
        top: rect.top,
        width: Math.max(rect.width, 2),
        height: Math.max(rect.height, 2),
        opacity: rect.opacity,
        borderColor: color,
      }}
      aria-hidden
    >
      <span className="figma-marquee__handle" data-corner="tl" />
      <span className="figma-marquee__handle" data-corner="tr" />
      <span className="figma-marquee__handle" data-corner="bl" />
      <span className="figma-marquee__handle" data-corner="br" />
    </div>
  );
}
