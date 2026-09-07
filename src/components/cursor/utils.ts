export function isFinePointerDevice() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  );
}

export type CursorMode = "default" | "interactive" | "label";

export function resolveCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";

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
