/** Fan-carousel layout math — pure functions, no React. */

export const CARD_WIDTH = 350;
export const CARD_GAP = 352;
export const DRAG_FOLLOW = 0.35;
export const STAGE_HEIGHT = 354;

const ROTATIONS: Record<string, number> = {
  "0": 0,
  "1": 4.03,
  "-1": -0.44,
  "2": -4.87,
  "-2": 0.64,
  "3": -1.39,
  "-3": 1.2,
};

export interface CardLayout {
  x: number;
  opacity: number;
  scale: number;
  rotate: number;
  zIndex: number;
}

export function wrapOffset(
  index: number,
  activeIndex: number,
  total: number,
): number {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export function cardLayout(
  offset: number,
  gap: number = CARD_GAP,
): CardLayout {
  const abs = Math.abs(offset);

  let opacity = 1;
  let scale = 1;

  if (abs === 1) {
    opacity = 0.78;
    scale = 0.843;
  } else if (abs === 2) {
    opacity = 0.56;
    scale = 0.82;
  } else if (abs >= 3) {
    opacity = 0.34;
    scale = 0.82;
  }

  return {
    x: offset * gap,
    opacity,
    scale,
    rotate: ROTATIONS[String(offset)] ?? offset * 1.5,
    zIndex: 20 - abs,
  };
}

export function cardTransform(x: number, scale: number): string {
  return `translateX(${x}px) scale(${scale})`;
}

export function responsiveGap(viewportWidth: number): number {
  if (viewportWidth < 480) return 240;
  if (viewportWidth < 768) return 280;
  if (viewportWidth < 1024) return 320;
  return CARD_GAP;
}
