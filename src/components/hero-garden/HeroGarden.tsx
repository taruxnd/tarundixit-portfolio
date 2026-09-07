"use client";

import { useTheme } from "@/components/ThemeController";
import { useEffect, useRef } from "react";
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
const AUTO_MOVE_SPEED = 0.45;
const WIND_STRENGTH = 37;

type Sprite = {
  type: 0 | 1;
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

function spawnSprites(width: number, density: number): Sprite[] {
  const span = width * 5;
  const flowers = Math.floor(FLOWER_COUNT * density);
  const leaves = Math.floor(LEAF_COUNT * density);
  const sprites: Sprite[] = [];

  const make = (type: 0 | 1, index: number): Sprite => {
    const raw = (Math.random() - 0.5) * 2;
    const x = Math.sign(raw) * Math.abs(raw) ** 1.2 * span * 0.5;
    const depth = 1 - (1 - Math.random()) ** 1.2;
    return {
      type,
      x,
      yOffset: (Math.random() - 0.5) * GARDEN_THICKNESS,
      zOffset: depth,
      imgIndex: index,
      scaleOffset: Math.random() * 0.8 + 0.4,
      rotation: (Math.random() - 0.5) * 0.2,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.3 + 0.7,
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

  const centerX = width / 2;
  const pitch = Math.max(0.1, Math.cos((CAMERA_ANGLE * Math.PI) / 180));
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

  // Soften both ends of the depth loop so the wrap doesn't leave a hard seam.
  const fadeNearEnd = 140;
  const fadeFarStart = SCENE_DEPTH - 900;
  const fadeFarSpan = SCENE_DEPTH - fadeFarStart;

  for (let i = 0; i < visible.length; i++) {
    const sprite = visible[i];
    const perspective = 400 / Math.max(1, sprite.relativeZ);
    const size =
      perspective *
      (sprite.type === 0 ? FLOWER_SCALE : LEAF_SCALE) *
      sprite.scaleOffset;
    const x = centerX + sprite.x * perspective;
    let y = height * 0.5;

    if (TERRAIN === "ushape") {
      y -= (Math.abs(sprite.x) / (width * 1.5)) ** 2 * 600;
    }
    y += sprite.yOffset;

    const drawY = height * 0.78 + y * perspective * pitch;
    let alpha = 1;
    if (sprite.relativeZ < fadeNearEnd) {
      alpha *= (sprite.relativeZ / fadeNearEnd) ** 1.35;
    }
    if (sprite.relativeZ > fadeFarStart) {
      alpha *= 1 - ((sprite.relativeZ - fadeFarStart) / fadeFarSpan) ** 1.5;
    }
    if (alpha <= 0.01) continue;

    const sway = Math.sin(time * sprite.swaySpeed + sprite.swayPhase);
    const source = sprite.type === 0 ? flowers : leaves;
    if (!source.length) continue;
    const spriteImage = source[sprite.imgIndex % source.length];
    if (!spriteImage?.complete) continue;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(x + sway * WIND_STRENGTH * perspective * 0.2, drawY);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const flowers: HTMLImageElement[] = [];
    const leaves: HTMLImageElement[] = [];
    let sprites: Sprite[] = [];
    let width = 0;
    let height = 0;
    let time = 0;
    let travel = 0;
    let scrollSmoothed = 0;
    let idleTravel = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites = spawnSprites(width, densityForWidth(width));
    };

    const render = () => {
      if (!running) return;
      if (!reducedMotion) {
        idleTravel += AUTO_MOVE_SPEED;
        time += 0.02;
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
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-garden" aria-hidden>
      <canvas ref={canvasRef} className="hero-garden__canvas" />
    </div>
  );
}
