"use client";

import { useTheme } from "@/components/ThemeController";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type BentoTileProps = {
  cartoonSrc: string;
  realSrc: string;
  alt: string;
  label: string;
  index: number;
  sizes: string;
};

const PIXEL_MAX = 18;
const ANIM_MS = 900;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function AboutBentoTile({
  cartoonSrc,
  realSrc,
  alt,
  label,
  index,
  sizes,
}: BentoTileProps) {
  const { reducedMotion } = useTheme();
  const tileRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const cartoonRef = useRef<HTMLImageElement | null>(null);
  const realRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0); // 0 = cartoon sharp, 1 = real sharp
  const [ready, setReady] = useState(false);

  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const cartoon = cartoonRef.current;
    const real = realRef.current;
    const tile = tileRef.current;
    if (!canvas || !cartoon || !real || !tile) return;
    if (!cartoon.complete || !real.complete) return;

    const rect = tile.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Peak pixelation at mid-transition; sharp at ends.
    const peak = Math.sin(Math.PI * progress);
    const block = Math.max(1, Math.round(1 + peak * (PIXEL_MAX - 1)));
    const showReal = progress >= 0.5;
    const source = showReal ? real : cartoon;

    const smallW = Math.max(1, Math.ceil(w / block));
    const smallH = Math.max(1, Math.ceil(h / block));

    let off = offscreenRef.current;
    if (!off) {
      off = document.createElement("canvas");
      offscreenRef.current = off;
    }
    if (off.width !== smallW || off.height !== smallH) {
      off.width = smallW;
      off.height = smallH;
    }
    const octx = off.getContext("2d");
    if (!octx) return;

    octx.imageSmoothingEnabled = true;
    octx.clearRect(0, 0, smallW, smallH);
    const sw = source.naturalWidth;
    const sh = source.naturalHeight;
    const scale = Math.max(smallW / sw, smallH / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (smallW - dw) / 2;
    const dy = (smallH - dh) / 2;
    octx.drawImage(source, dx, dy, dw, dh);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0, smallW, smallH, 0, 0, w, h);
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (reducedMotion) {
        progressRef.current = target;
        draw(target);
        return;
      }

      const start = progressRef.current;
      const delta = target - start;
      if (Math.abs(delta) < 0.001) {
        progressRef.current = target;
        draw(target);
        return;
      }

      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / ANIM_MS);
        const next = start + delta * easeInOut(t);
        progressRef.current = next;
        draw(next);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          progressRef.current = target;
          draw(target);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [draw, reducedMotion],
  );

  useEffect(() => {
    let cancelled = false;
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([load(cartoonSrc), load(realSrc)])
      .then(([cartoon, real]) => {
        if (cancelled) return;
        cartoonRef.current = cartoon;
        realRef.current = real;
        setReady(true);
        draw(0);
      })
      .catch(() => {
        /* keep Next Image fallback visible */
      });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cartoonSrc, realSrc, draw]);

  useEffect(() => {
    if (!ready) return;
    const onResize = () => draw(progressRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, draw]);

  const onEnter = (_event: PointerEvent<HTMLElement>) => {
    if (!ready) return;
    animateTo(1);
  };

  const onLeave = () => {
    if (!ready) return;
    animateTo(0);
  };

  return (
    <figure
      ref={tileRef}
      className={`about-bento__tile about-bento__tile--${index + 1}${
        ready ? " about-bento__tile--ready" : ""
      }`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <Image
        src={cartoonSrc}
        alt={alt}
        fill
        className="about-bento__image about-bento__image--base"
        sizes={sizes}
        priority={index < 2}
      />
      <canvas
        ref={canvasRef}
        className="about-bento__canvas"
        aria-hidden
      />
      <div className="about-bento__scrim" aria-hidden />
      <span className="about-bento__label">{label}</span>
    </figure>
  );
}
