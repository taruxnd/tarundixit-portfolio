export function isFinePointerDevice() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  );
}

export type CursorMode = "default" | "interactive" | "label";

/**
 * Elements with data-cursor-text keep the plain cursor (no hover change) and
 * swap the "You" tag for their own word instead, e.g. "Inspect".
 */
export function resolveCursorText(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-cursor-text]")?.dataset.cursorText ?? null;
}

export function resolveCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";

  if (target.closest("[data-cursor-text]")) return "default";

  if (target.closest('[data-cursor="label"]')) return "label";
  if (
    target.closest(
      'a, button, [data-cursor="interactive"], input, textarea, select, label, [role="button"]',
    )
  ) {
    return "interactive";
  }

  return "default";
}
