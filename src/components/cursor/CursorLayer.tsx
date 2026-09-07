"use client";

import { useEffect, useState } from "react";
import {
  FigmaNameTag,
  FigmaPointer,
  YouPointer,
  YouTag,
} from "./CursorParts";
import { usePointerFollow } from "./usePointerFollow";
import { useRoamingCursor } from "./useRoamingCursor";
import { useAmbientHeroSelect } from "./useAmbientHeroSelect";
import FigmaMarquee from "./FigmaMarquee";
import {
  isFinePointerDevice,
  resolveCursorMode,
  type CursorMode,
} from "./utils";
import "./cursor.css";

const FIGMA_COLOR = "#0D99FF";
const ROAMING_NAME = "Tarun Dixit";

function YouCursor({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<CursorMode>("default");
  const nodeRef = usePointerFollow(enabled, () => setVisible(true));

  useEffect(() => {
    if (!enabled) return;

    const hide = () => setVisible(false);

    const onOver = (event: MouseEvent) => {
      setVisible(true);
      setMode(resolveCursorMode(event.target));
    };

    // Safari rarely fires document.mouseenter — use mouseout on <html> instead.
    document.documentElement.addEventListener("mouseleave", hide);
    document.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={nodeRef}
      className="you-cursor"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <YouPointer mode={mode} />
      <div className="you-cursor__tag-wrap">
        <YouTag mode={mode} />
      </div>
    </div>
  );
}

function RoamingFigmaCursor({ enabled }: { enabled: boolean }) {
  const roaming = useRoamingCursor(enabled);
  const { marquee, color } = useAmbientHeroSelect(enabled, roaming);

  if (!enabled) return null;

  return (
    <>
      <div ref={roaming.nodeRef} className="figma-cursor" aria-hidden>
        <FigmaPointer color={FIGMA_COLOR} />
        <div className="figma-cursor__tag-wrap">
          <FigmaNameTag name={ROAMING_NAME} color={FIGMA_COLOR} />
        </div>
      </div>
      {marquee ? <FigmaMarquee rect={marquee} color={color} /> : null}
    </>
  );
}

export default function CursorLayer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isFinePointerDevice()) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    return () => {
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <RoamingFigmaCursor enabled={enabled} />
      <YouCursor enabled={enabled} />
    </>
  );
}
