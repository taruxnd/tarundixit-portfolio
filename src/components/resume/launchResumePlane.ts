import type { MouseEvent } from "react";

export const RESUME_DOWNLOAD_URL = "/resume-sample.pdf";
let flying = false;

/** Fly toward the browser's top-right corner, then download the sample PDF. */
export function launchResumePlane(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  if (flying) return;
  const download = () => {
    const link = document.createElement("a");
    link.href = RESUME_DOWNLOAD_URL;
    link.download = "Tarun-Dixit-Sample-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    download();
    return;
  }

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2 - 22;
  const y = bounds.top + bounds.height / 2 - 22;
  const dx = window.innerWidth - 28 - x;
  const dy = -70 - y;
  // The artwork points at -45deg. Rotate it to match the diagonal flight path.
  const rotation = Math.atan2(dy, dx) * 180 / Math.PI + 45;
  const plane = document.createElement("div");
  plane.setAttribute("aria-hidden", "true");
  Object.assign(plane.style, {
    position: "fixed", left: `${x}px`, top: `${y}px`,
    width: "44px", height: "44px", zIndex: "2147483646",
    pointerEvents: "none", color: "var(--text-primary)",
    filter: "drop-shadow(0 3px 8px rgba(0,0,0,.18))",
  });
  plane.innerHTML = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 22 44 5 32 43 22 29 4 22Z" fill="currentColor"/><path d="m22 29 22-24-29 19" stroke="var(--bg-page)" stroke-width="1.5" stroke-linejoin="round"/><path d="m22 29-1 11 6-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  document.body.appendChild(plane);
  flying = true;
  const animation = plane.animate([
    { transform: `translate(0, 0) rotate(${rotation}deg) scale(.4)`, opacity: 0, offset: 0 },
    { transform: `translate(${dx * .06}px, ${dy * .06}px) rotate(${rotation}deg) scale(1)`, opacity: 1, offset: .15 },
    { transform: `translate(${dx * .5}px, ${dy * .5}px) rotate(${rotation}deg) scale(1)`, opacity: 1, offset: .6 },
    { transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(.85)`, opacity: 1, offset: 1 },
  ], { duration: 1050, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "forwards" });
  animation.onfinish = () => { plane.remove(); flying = false; download(); };
  animation.oncancel = () => { plane.remove(); flying = false; };
}
