"use client";

import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef, useState } from "react";
import "./hero-garden.css";

const FLOWER_URLS = ["/garden/flower-1.png", "/garden/flower-2.png"];
const LEAF_URLS = ["/garden/leaves.png"];

const FLOWER_COUNT = 5000;
const LEAF_COUNT = 5000;
const FLOWER_SCALE = 10;
const LEAF_SCALE = 7.8;
const TERRAIN = "ushape" as const;
const GARDEN_THICKNESS = 240;
const CAMERA_ANGLE = -47;
const SCENE_DEPTH = 2000;
const SCROLL_SPEED = 1.25;
const WIND_STRENGTH = 37;
/** Composition tuned at this size; scales cleanly when leaving fullscreen. */
const LAYOUT_REF_WIDTH = 1440;
const LAYOUT_REF_HEIGHT = 900;

type Sprite = {
  type: 0 | 1;
  /** Normalized horizontal position in [-1, 1]; scaled by current width when painting. */
  x: number;
  yOffset: number;
  zOffset: number;
  imgIndex: number;
  scaleOffset: number;
  rotation: number;
  swayPhase: number;
  swaySpeed: number;
  relativeZ: number;
};

function densityForWidth(width: number) {
  if (width < 800) return 0.3;
  if (width < 1200) return 0.6;
  return 1;
}

/** Fixed seed so reload / resize always recreate the same garden layout. */
const SPAWN_SEED = 0x7a7a004d;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function loadImages(
  urls: string[],
  bucket: HTMLImageElement[],
  onReady: () => void,
) {
  bucket.length = 0;
  urls.forEach((src) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      bucket.push(image);
      onReady();
    };
  });
}

function spawnSprites(density: number): Sprite[] {
  const flowers = Math.floor(FLOWER_COUNT * density);
  const leaves = Math.floor(LEAF_COUNT * density);
  const sprites: Sprite[] = [];
  const random = createSeededRandom(SPAWN_SEED);

  const make = (type: 0 | 1, index: number): Sprite => {
    const raw = (random() - 0.5) * 2;
    const x = Math.sign(raw) * Math.abs(raw) ** 1.2;
    const depth = 1 - (1 - random()) ** 1.2;
    return {
      type,
      x,
      yOffset: (random() - 0.5) * GARDEN_THICKNESS,
      zOffset: depth,
      imgIndex: index,
      scaleOffset: random() * 0.8 + 0.4,
      rotation: (random() - 0.5) * 0.2,
      swayPhase: random() * Math.PI * 2,
      swaySpeed: random() * 0.3 + 0.7,
      relativeZ: 0,
    };
  };

  for (let i = 0; i < flowers; i++) sprites.push(make(0, i));
  for (let i = 0; i < leaves; i++) sprites.push(make(1, i));
  return sprites;
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sprites: Sprite[],
  flowers: HTMLImageElement[],
  leaves: HTMLImageElement[],
  time: number,
  travel: number,
) {
  ctx.clearRect(0, 0, width, height);
  if (width < 2 || height < 2) return;

  const centerX = width / 2;
  const pitch = Math.max(0.1, Math.cos((CAMERA_ANGLE * Math.PI) / 180));
  const layoutScale = Math.min(
    1,
    width / LAYOUT_REF_WIDTH,
    height / LAYOUT_REF_HEIGHT,
  );
  const worldSpan = width * 2.5;
  const visible: Sprite[] = [];

  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    sprite.relativeZ =
      ((sprite.zOffset * SCENE_DEPTH - travel) % SCENE_DEPTH + SCENE_DEPTH) %
      SCENE_DEPTH;
    if (sprite.relativeZ > 10 && sprite.relativeZ < SCENE_DEPTH * 0.99) {
      visible.push(sprite);
    }
  }

  visible.sort((a, b) => b.relativeZ - a.relativeZ);

  // Soften only the extreme depth wrap — keep the visible bed fully opaque
  // so soft PNG edges don't read as white/black haze on the silhouette.
  const fadeNearEnd = 48;
  const fadeFarStart = SCENE_DEPTH - 220;
  const fadeFarSpan = SCENE_DEPTH - fadeFarStart;

  for (let i = 0; i < visible.length; i++) {
    const sprite = visible[i];
    const perspective = 400 / Math.max(1, sprite.relativeZ);
    const size =
      perspective *
      (sprite.type === 0 ? FLOWER_SCALE : LEAF_SCALE) *
      sprite.scaleOffset *
      layoutScale;
    const worldX = sprite.x * worldSpan;
    const x = centerX + worldX * perspective;
    let y = height * 0.5;

    if (TERRAIN === "ushape") {
      // Same curve as before: abs(worldX)/(width*1.5), with normalized x.
      y -= (Math.abs(sprite.x) * (5 / 3)) ** 2 * 600 * layoutScale;
    }
    y += sprite.yOffset * layoutScale;

    const drawY = height * 0.78 + y * perspective * pitch;
    let alpha = 1;
    if (sprite.relativeZ < fadeNearEnd) {
      alpha *= (sprite.relativeZ / fadeNearEnd) ** 1.35;
    }
    if (sprite.relativeZ > fadeFarStart) {
      alpha *= 1 - ((sprite.relativeZ - fadeFarStart) / fadeFarSpan) ** 1.5;
    }
    // Drop ghost sprites — translucent paint was causing the silhouette haze.
    if (alpha < 0.72) continue;

    const sway = Math.sin(time * sprite.swaySpeed + sprite.swayPhase);
    const source = sprite.type === 0 ? flowers : leaves;
    if (!source.length) continue;
    const spriteImage = source[sprite.imgIndex % source.length];
    if (!spriteImage?.complete) continue;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.translate(
      x + sway * WIND_STRENGTH * perspective * 0.2 * layoutScale,
      drawY,
    );
    ctx.rotate(sprite.rotation + sway * 0.01 * (WIND_STRENGTH / 50));
    ctx.drawImage(
      spriteImage,
      -(spriteImage.width * size * 0.05) / 2,
      -(spriteImage.height * size * 0.05),
      spriteImage.width * size * 0.05,
      spriteImage.height * size * 0.05,
    );
    ctx.restore();
  }
}

export default function HeroGarden() {
  const { reducedMotion } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const sync = () => setEnabled(desktopQuery.matches);
    sync();
    desktopQuery.addEventListener("change", sync);
    return () => desktopQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reload always starts at the decided idle depth (travel = 0).
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const flowers: HTMLImageElement[] = [];
    const leaves: HTMLImageElement[] = [];
    let sprites: Sprite[] = [];
    let width = 0;
    let height = 0;
    let spawnDensity = -1;
    let time = 0;
    let travel = 0;
    let scrollSmoothed = 0;
    // Canonical idle frame = travel at first paint (scroll 0 + no idle drift).
    const initialIdleTravel = 0;
    let idleTravel = initialIdleTravel;
    let frame = 0;
    let running = true;

    const resize = () => {
      const nextWidth = canvas.offsetWidth;
      const nextHeight = canvas.offsetHeight;
      // Skip dock-minimize / transient 0-size frames so we don't nuke the layout.
      if (nextWidth < 2 || nextHeight < 2) return;

      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Spawn once — resizing (fullscreen ↔ windowed) only scales the canvas.
      if (spawnDensity < 0) {
        spawnDensity = densityForWidth(width);
        sprites = spawnSprites(spawnDensity);
      }
    };

    const render = () => {
      if (!running) return;
      if (!reducedMotion) {
        // Keep idle pinned to the load-time depth; wind/sway keeps moving.
        idleTravel = initialIdleTravel;
        time += 0.052;
      }
      scrollSmoothed += (window.scrollY - scrollSmoothed) * 0.08;
      travel = scrollSmoothed * SCROLL_SPEED + idleTravel;
      paintFrame(ctx, width, height, sprites, flowers, leaves, time, travel);
      if (!reducedMotion) {
        frame = requestAnimationFrame(render);
      }
    };

    const onScroll = () => {
      if (reducedMotion) {
        scrollSmoothed = window.scrollY;
        travel = scrollSmoothed * SCROLL_SPEED + idleTravel;
        paintFrame(ctx, width, height, sprites, flowers, leaves, time, travel);
      }
    };

    loadImages(FLOWER_URLS, flowers, () => {
      if (reducedMotion) render();
    });
    loadImages(LEAF_URLS, leaves, () => {
      if (reducedMotion) render();
    });

    resize();
    render();

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) render();
    });
    observer.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [reducedMotion, enabled]);

  // Always render the same markup on server + client to avoid hydration mismatch.
  // Mobile hides via CSS; the canvas loop only runs when `enabled`.
  return (
    <div className="hero-garden" aria-hidden>
      <canvas ref={canvasRef} className="hero-garden__canvas" />
    </div>
  );
}
