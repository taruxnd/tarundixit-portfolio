/** Fired on window once the polaroid timeline's Framer runtime has loaded. */
export const TIMELINE_READY_EVENT = "polaroid-timeline:ready";

declare global {
  interface Window {
    __polaroidTimelineReady?: boolean;
  }
}

/** Resolves when the timeline is ready, or after `maxWaitMs` so callers never stall. */
export function whenTimelineReady(maxWaitMs = 10000): Promise<void> {
  return new Promise((resolve) => {
    if (window.__polaroidTimelineReady) {
      resolve();
      return;
    }
    const done = () => {
      window.clearTimeout(timer);
      window.removeEventListener(TIMELINE_READY_EVENT, done);
      resolve();
    };
    const timer = window.setTimeout(done, maxWaitMs);
    window.addEventListener(TIMELINE_READY_EVENT, done);
  });
}
