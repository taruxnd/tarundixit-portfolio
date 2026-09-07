/** WebKit browsers (Safari, all iOS browsers). */
export function isSafari(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua)) return true;

  return (
    /Safari/.test(ua) &&
    !/Chrome|CriOS|Chromium|Edg|OPR|Firefox|FxiOS/.test(ua)
  );
}

/** Safari cannot use SVG url() filters inside backdrop-filter. */
export function lacksSvgBackdropFilterSupport(): boolean {
  return isSafari();
}
