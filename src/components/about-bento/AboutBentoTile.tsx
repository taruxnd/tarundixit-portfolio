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

type CoverFocus = { x?: number; y?: number };

type RealMedia = HTMLImageElement | HTMLVideoElement;

type BentoTileProps = {
  cartoonSrc: string;
  realSrc?: string;
  realVideoSrc?: string;
  alt: string;
  label: string;
  index: number;
  sizes: string;
  /** 0–1 focus for object-fit: cover on the hover photo (default center). */
  realCoverFocus?: CoverFocus;
};

function coverDrawRect(
  sw: number,
  sh: number,
  cw: number,
  ch: number,
  focus: CoverFocus = {},
) {
  const fx = focus.x ?? 0.5;
  const fy = focus.y ?? 0.5;
  const scale = Math.max(cw / sw, ch / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  return {
    dx: (cw - dw) * fx,
    dy: (ch - dh) * fy,
    dw,
    dh,
  };
}

function mediaDimensions(source: RealMedia) {
  if (source instanceof HTMLVideoElement) {
    return { sw: source.videoWidth, sh: source.videoHeight };
  }
  return { sw: source.naturalWidth, sh: source.naturalHeight };
}

function mediaReady(source: RealMedia) {
  if (source instanceof HTMLVideoElement) {
    return source.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
  }
  return source.complete;
}

const PIXEL_MAX = 18;
const ANIM_MS = 900;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function AboutBentoTile({
  cartoonSrc,
  realSrc,
  realVideoSrc,
  alt,
  label,
  index,
  sizes,
  realCoverFocus,
}: BentoTileProps) {
  const { reducedMotion } = useTheme();
  const tileRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const cartoonRef = useRef<HTMLImageElement | null>(null);
  const realRef = useRef<RealMedia | null>(null);
  const rafRef = useRef<number | null>(null);
  const videoLoopRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);

  const stopVideoLoop = useCallback(() => {
    if (videoLoopRef.current !== null) {
      cancelAnimationFrame(videoLoopRef.current);
      videoLoopRef.current = null;
    }
  }, []);

  const startVideoLoop = useCallback(() => {
    if (videoLoopRef.current !== null) return;
    const tick = () => {
      if (progressRef.current >= 0.99) {
        drawRef.current?.(progressRef.current);
      }
      videoLoopRef.current = requestAnimationFrame(tick);
    };
    videoLoopRef.current = requestAnimationFrame(tick);
  }, []);

  const drawRef = useRef<(progress: number) => void>(() => {});

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      const cartoon = cartoonRef.current;
      const real = realRef.current;
      const tile = tileRef.current;
      if (!canvas || !cartoon || !real || !tile) return;
      if (!cartoon.complete || !mediaReady(real)) return;

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

      const { sw, sh } = mediaDimensions(source);
      if (!sw || !sh) return;

      octx.imageSmoothingEnabled = true;
      octx.clearRect(0, 0, smallW, smallH);
      const focus = showReal ? realCoverFocus : undefined;
      const { dx, dy, dw, dh } = coverDrawRect(sw, sh, smallW, smallH, focus);
      octx.drawImage(source, dx, dy, dw, dh);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(off, 0, 0, smallW, smallH, 0, 0, w, h);
    },
    [realCoverFocus],
  );

  drawRef.current = draw;

  const animateTo = useCallback(
    (target: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (target < 1) stopVideoLoop();

      if (reducedMotion) {
        progressRef.current = target;
        draw(target);
        if (target >= 1 && realVideoSrc) startVideoLoop();
        return;
      }

      const start = progressRef.current;
      const delta = target - start;
      if (Math.abs(delta) < 0.001) {
        progressRef.current = target;
        draw(target);
        if (target >= 1 && realVideoSrc) startVideoLoop();
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
          if (target >= 1 && realVideoSrc) startVideoLoop();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [draw, reducedMotion, realVideoSrc, startVideoLoop, stopVideoLoop],
  );

  useEffect(() => {
    let cancelled = false;
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const loadVideo = (src: string) =>
      new Promise<HTMLVideoElement>((resolve, reject) => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("playsinline", "");
        video.onloadeddata = () => resolve(video);
        video.onerror = () => reject(new Error("video load failed"));
        video.src = src;
        video.load();
      });

    const loadReal = realVideoSrc
      ? loadVideo(realVideoSrc)
      : realSrc
        ? loadImage(realSrc)
        : Promise.reject(new Error("missing real media"));

    Promise.all([loadImage(cartoonSrc), loadReal])
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
      stopVideoLoop();
      const real = realRef.current;
      if (real instanceof HTMLVideoElement) {
        real.pause();
        real.removeAttribute("src");
        real.load();
      }
    };
  }, [cartoonSrc, realSrc, realVideoSrc, draw, stopVideoLoop]);

  useEffect(() => {
    if (!ready) return;
    const onResize = () => draw(progressRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, draw]);

  const onEnter = (_event: PointerEvent<HTMLElement>) => {
    if (!ready) return;
    const real = realRef.current;
    if (real instanceof HTMLVideoElement) {
      void real.play().catch(() => {});
    }
    animateTo(1);
  };

  const onLeave = () => {
    if (!ready) return;
    const real = realRef.current;
    if (real instanceof HTMLVideoElement) {
      real.pause();
      real.currentTime = 0;
    }
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
