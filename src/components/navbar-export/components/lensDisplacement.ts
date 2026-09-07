const LENS_CACHE = new Map<string, string>();
const LENS_MAX_DIM = 256;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function roundedRectSDF(x: number, y: number, rx: number, ry: number, radius: number): number {
  const ax = Math.abs(x) - rx + radius;
  const ay = Math.abs(y) - ry + radius;
  return (
    Math.min(Math.max(ax, ay), 0) +
    Math.sqrt(Math.max(ax, 0) ** 2 + Math.max(ay, 0) ** 2) -
    radius
  );
}

/** Generates a lens displacement map for advanced glass refraction. */
export function generateLensDisplacementMap(width: number, height: number): string {
  const scale = Math.min(1, LENS_MAX_DIM / Math.max(width, height, 1));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const key = `${w}x${h}`;
  const cached = LENS_CACHE.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const pixels = new Uint8ClampedArray(w * h * 4);
  const displacements: number[] = [];
  let maxDisp = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w - 0.5;
      const ny = y / h - 0.5;
      const mask = smoothstep(
        0,
        1,
        roundedRectSDF(nx, ny, 0.3, 0.2, 0.6) - 0.15,
      );
      const sx = nx * mask + 0.5;
      const sy = ny * mask + 0.5;
      const dx = sx * w - x;
      const dy = sy * h - y;
      maxDisp = Math.max(maxDisp, Math.abs(dx), Math.abs(dy));
      displacements.push(dx, dy);
    }
  }

  maxDisp *= 0.5;
  let offset = 0;
  for (let i = 0; i < w * h; i++) {
    const r = displacements[offset++] / (maxDisp || 1) + 0.5;
    const g = displacements[offset++] / (maxDisp || 1) + 0.5;
    const px = i * 4;
    pixels[px] = Math.round(Math.max(0, Math.min(255, r * 255)));
    pixels[px + 1] = Math.round(Math.max(0, Math.min(255, g * 255)));
    pixels[px + 2] = 0;
    pixels[px + 3] = 255;
  }

  ctx.putImageData(new ImageData(pixels, w, h), 0, 0);
  const dataUrl = canvas.toDataURL();
  LENS_CACHE.set(key, dataUrl);
  return dataUrl;
}
