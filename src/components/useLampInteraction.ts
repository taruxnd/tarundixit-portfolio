"use client";

import { useTheme } from "@/components/ThemeController";
import {
  animate,
  useAnimationControls,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const PULL_THRESHOLD = 22;
const MAX_PULL = 46;
const RESUME_DELAY_MS = 1500;
const INTERACTION_HIT_PAD = 24;

export function useLampInteraction() {
  const { isLampOn, toggleTheme, reducedMotion, hydrated, theme } = useTheme();
  const pendulum = useAnimationControls();
  const [hovering, setHoveringState] = useState(false);
  const [ambientSuspended, setAmbientSuspended] = useState(false);
  const [pulling, setPulling] = useState(false);
  const pullRaw = useMotionValue(0);
  const cordPull = useSpring(pullRaw, {
    stiffness: 520,
    damping: 34,
    mass: 0.55,
  });
  const bulbOpacity = useMotionValue(1);
  const dragStartY = useRef(0);
  const pulled = useRef(false);
  const dragging = useRef(false);
  const pullingRef = useRef(false);
  const pendulumBusy = useRef(false);
  const hoveringRef = useRef(false);
  const ambientSuspendedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const lampRootRef = useRef<HTMLDivElement>(null);

  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const settlePendulum = useCallback(async () => {
    if (dragging.current || reducedMotion) return;

    pendulum.stop();
    pendulumBusy.current = true;
    try {
      await pendulum.start({
        rotate: 0,
        transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
      });
    } finally {
      pendulumBusy.current = false;
    }
  }, [pendulum, reducedMotion]);

  const suspendAmbient = useCallback(() => {
    clearResumeTimeout();

    if (ambientSuspendedRef.current) return;

    ambientSuspendedRef.current = true;
    setAmbientSuspended(true);

    if (!dragging.current) {
      void settlePendulum();
    }
  }, [clearResumeTimeout, settlePendulum]);

  const resumeAmbient = useCallback(() => {
    ambientSuspendedRef.current = false;
    setAmbientSuspended(false);
    void pendulum.start({
      rotate: 0,
      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
    });
  }, [pendulum]);

  const scheduleResumeAmbient = useCallback(() => {
    if (dragging.current || pullingRef.current || hoveringRef.current) return;

    clearResumeTimeout();
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null;
      if (dragging.current || pullingRef.current || hoveringRef.current) return;
      resumeAmbient();
    }, RESUME_DELAY_MS);
  }, [clearResumeTimeout, resumeAmbient]);

  const runSwing = useCallback(
    async (impulse: number) => {
      if (reducedMotion) return;
      pendulumBusy.current = true;
      const direction = impulse >= 0 ? 1 : -1;
      try {
        await pendulum.start({
          rotate: direction * (7 + Math.abs(impulse) * 0.15),
          transition: { type: "spring", stiffness: 180, damping: 7, mass: 1.1 },
        });
        await pendulum.start({
          rotate: direction * -3.5,
          transition: { type: "spring", stiffness: 90, damping: 10, mass: 1 },
        });
        await pendulum.start({
          rotate: 0,
          transition: { type: "spring", stiffness: 70, damping: 14, mass: 0.9 },
        });
      } finally {
        pendulumBusy.current = false;
      }
    },
    [pendulum, reducedMotion],
  );

  const runHeavyBlow = useCallback(async () => {
    if (
      reducedMotion ||
      dragging.current ||
      pullingRef.current ||
      pendulumBusy.current ||
      ambientSuspendedRef.current ||
      hoveringRef.current
    ) {
      return;
    }

    pendulumBusy.current = true;
    const direction = Math.random() > 0.5 ? 1 : -1;

    try {
      await pendulum.start({
        rotate: direction * 11,
        transition: { type: "spring", stiffness: 110, damping: 5.5, mass: 1.35 },
      });

      if (ambientSuspendedRef.current || dragging.current) return;

      await pendulum.start({
        rotate: direction * -6.5,
        transition: { type: "spring", stiffness: 75, damping: 8.5, mass: 1.15 },
      });

      if (ambientSuspendedRef.current || dragging.current) return;

      await pendulum.start({
        rotate: direction * 3,
        transition: { type: "spring", stiffness: 58, damping: 11, mass: 1 },
      });

      if (ambientSuspendedRef.current || dragging.current) return;

      await pendulum.start({
        rotate: 0,
        transition: { type: "spring", stiffness: 52, damping: 13, mass: 0.9 },
      });
    } finally {
      pendulumBusy.current = false;
    }
  }, [pendulum, reducedMotion]);

  const runFlicker = useCallback(async () => {
    if (reducedMotion) return;
    const turningOff = isLampOn;
    const steps = turningOff
      ? [1, 0.55, 0.9, 0.35, 0.12]
      : [0.15, 0.5, 0.2, 0.7, 0.95, 1];

    for (const opacity of steps) {
      await animate(bulbOpacity, opacity, {
        duration: 0.07,
        ease: "linear",
      });
    }

    bulbOpacity.set(1);
  }, [bulbOpacity, isLampOn, reducedMotion]);

  const handleRelease = useCallback(
    async (triggered: boolean) => {
      dragging.current = false;
      pullingRef.current = false;
      setPulling(false);
      pullRaw.set(0);

      if (!triggered) {
        await runSwing(2);
      } else {
        await runFlicker();
        toggleTheme();
        bulbOpacity.set(1);
        await runSwing(10);
      }

      scheduleResumeAmbient();
    },
    [
      bulbOpacity,
      pullRaw,
      runFlicker,
      runSwing,
      scheduleResumeAmbient,
      toggleTheme,
    ],
  );

  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!dragging.current) return;
      const delta = Math.max(
        0,
        Math.min(MAX_PULL, event.clientY - dragStartY.current),
      );
      pullRaw.set(delta);
      if (delta >= PULL_THRESHOLD) pulled.current = true;

      if (!reducedMotion) {
        pendulum.start({
          rotate: delta * 0.06,
          transition: { type: "spring", stiffness: 260, damping: 22 },
        });
      }
    },
    [pendulum, pullRaw, reducedMotion],
  );

  const onDocumentPointerUp = useCallback(() => {
    if (!dragging.current) return;
    document.removeEventListener("pointermove", onDocumentPointerMove);
    document.removeEventListener("pointerup", onDocumentPointerUp);
    document.removeEventListener("pointercancel", onDocumentPointerUp);
    void handleRelease(pulled.current);
  }, [handleRelease, onDocumentPointerMove]);

  const handlePullPointerDown = useCallback(
    (event: React.PointerEvent<Element>) => {
      event.preventDefault();
      event.stopPropagation();
      clearResumeTimeout();
      suspendAmbient();
      dragging.current = true;
      pullingRef.current = true;
      setPulling(true);
      pulled.current = false;
      dragStartY.current = event.clientY;
      pullRaw.set(0);

      document.addEventListener("pointermove", onDocumentPointerMove);
      document.addEventListener("pointerup", onDocumentPointerUp);
      document.addEventListener("pointercancel", onDocumentPointerUp);
    },
    [
      clearResumeTimeout,
      onDocumentPointerMove,
      onDocumentPointerUp,
      pullRaw,
      suspendAmbient,
    ],
  );

  const handlePullPointerMove = useCallback(
    (event: React.PointerEvent<Element>) => {
      event.preventDefault();
      onDocumentPointerMove(event.nativeEvent);
    },
    [onDocumentPointerMove],
  );

  const handlePullPointerUp = useCallback(
    (event: React.PointerEvent<Element>) => {
      event.preventDefault();
      onDocumentPointerUp();
    },
    [onDocumentPointerUp],
  );

  const handlePullKeyToggle = useCallback(() => {
    suspendAmbient();
    void handleRelease(true);
  }, [handleRelease, suspendAmbient]);

  const setHovering = useCallback(
    (inZone: boolean) => {
      if (dragging.current) return;

      if (hoveringRef.current === inZone) return;
      hoveringRef.current = inZone;
      setHoveringState(inZone);

      if (inZone) {
        suspendAmbient();
      } else {
        scheduleResumeAmbient();
      }
    },
    [scheduleResumeAmbient, suspendAmbient],
  );

  useEffect(() => {
    pullingRef.current = pulling;
  }, [pulling]);

  useEffect(() => {
    if (!hydrated || reducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (dragging.current) return;

      const root = lampRootRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const inZone =
        event.clientX >= rect.left - INTERACTION_HIT_PAD &&
        event.clientX <= rect.right + INTERACTION_HIT_PAD &&
        event.clientY >= rect.top - INTERACTION_HIT_PAD &&
        event.clientY <= rect.bottom + INTERACTION_HIT_PAD;

      setHovering(inZone);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [hydrated, reducedMotion, setHovering]);

  useEffect(() => {
    if (!hydrated || reducedMotion) return;

    const intervalId = window.setInterval(() => {
      void runHeavyBlow();
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [hydrated, reducedMotion, runHeavyBlow]);

  useEffect(() => {
    return () => {
      clearResumeTimeout();
      document.removeEventListener("pointermove", onDocumentPointerMove);
      document.removeEventListener("pointerup", onDocumentPointerUp);
      document.removeEventListener("pointercancel", onDocumentPointerUp);
    };
  }, [clearResumeTimeout, onDocumentPointerMove, onDocumentPointerUp]);

  return {
    isLampOn,
    theme,
    hydrated,
    reducedMotion,
    pendulum,
    hovering,
    ambientSuspended,
    pulling,
    cordPull,
    bulbOpacity,
    lampRootRef,
    handlePullPointerDown,
    handlePullPointerMove,
    handlePullPointerUp,
    handlePullKeyToggle,
  };
}
