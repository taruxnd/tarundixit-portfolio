"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { cardTransform, DRAG_FOLLOW } from "./layout";

const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 300;

interface CarouselState {
  index: number;
  isDragging: boolean;
}

type CarouselAction =
  | { type: "GO_TO"; index: number; total: number }
  | { type: "DRAG_START" }
  | { type: "DRAG_END" };

function carouselReducer(
  state: CarouselState,
  action: CarouselAction,
): CarouselState {
  switch (action.type) {
    case "GO_TO":
      return {
        ...state,
        index: ((action.index % action.total) + action.total) % action.total,
      };
    case "DRAG_START":
      return { ...state, isDragging: true };
    case "DRAG_END":
      return { ...state, isDragging: false };
    default:
      return state;
  }
}

function paintCards(stage: HTMLElement | null, offset: number) {
  if (!stage) return;

  stage.querySelectorAll<HTMLElement>("[data-rack-card]").forEach((el) => {
    const base = Number(el.dataset.baseX ?? 0);
    const scale = Number(el.dataset.scale ?? 1);
    const transform = cardTransform(base + offset * DRAG_FOLLOW, scale);

    el.style.transition = "none";
    el.style.transform = transform;
    el.style.webkitTransform = transform;
  });
}

function clearCardPaint(stage: HTMLElement | null) {
  if (!stage) return;

  stage.querySelectorAll<HTMLElement>("[data-rack-card]").forEach((el) => {
    el.style.transition = "";
    el.style.transform = "";
    el.style.webkitTransform = "";
  });
}

interface UseFanCarouselOptions {
  total: number;
}

export function useFanCarousel({ total }: UseFanCarouselOptions) {
  const [state, dispatch] = useReducer(carouselReducer, {
    index: 0,
    isDragging: false,
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  indexRef.current = state.index;

  const goTo = useCallback(
    (index: number) => dispatch({ type: "GO_TO", index, total }),
    [total],
  );

  const goNext = useCallback(
    () => goTo(state.index + 1),
    [goTo, state.index],
  );

  const goPrev = useCallback(
    () => goTo(state.index - 1),
    [goTo, state.index],
  );

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let dragging = false;
    let startX = 0;
    let startTime = 0;
    let pointerId: number | null = null;

    const finish = (clientX: number) => {
      if (!dragging) return;

      dragging = false;
      pointerId = null;
      dispatch({ type: "DRAG_END" });
      surface.classList.remove("is-dragging");

      const offset = clientX - startX;
      const elapsed = Math.max(performance.now() - startTime, 1);
      const velocity = (offset / elapsed) * 1000;

      if (offset < -SWIPE_OFFSET || velocity < -SWIPE_VELOCITY) {
        goTo(indexRef.current + 1);
      } else if (offset > SWIPE_OFFSET || velocity > SWIPE_VELOCITY) {
        goTo(indexRef.current - 1);
      }

      clearCardPaint(stageRef.current);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      dragging = true;
      startX = event.clientX;
      startTime = performance.now();
      pointerId = event.pointerId;
      dispatch({ type: "DRAG_START" });
      surface.classList.add("is-dragging");

      try {
        surface.setPointerCapture(event.pointerId);
      } catch {
        // Document-level fallback not needed — capture handles move/up.
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      event.preventDefault();
      paintCards(stageRef.current, event.clientX - startX);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      finish(event.clientX);
    };

    surface.addEventListener("pointerdown", onPointerDown);
    surface.addEventListener("pointermove", onPointerMove);
    surface.addEventListener("pointerup", onPointerUp);
    surface.addEventListener("pointercancel", onPointerUp);

    return () => {
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("pointercancel", onPointerUp);
    };
  }, [goTo]);

  return {
    activeIndex: state.index,
    isDragging: state.isDragging,
    stageRef,
    surfaceRef,
    goTo,
    goNext,
    goPrev,
  };
}
