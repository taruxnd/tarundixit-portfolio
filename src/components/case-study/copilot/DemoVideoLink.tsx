"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import VideoLightbox from "@/components/work-strip/VideoLightbox";
import "@/components/work-strip/work-strip.css";

/** Inline text link that opens the Copilot walkthrough in the video lightbox. */
export default function DemoVideoLink({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // The link sits inside a paragraph; the player is rendered at the end of
  // <body> instead, since a <dialog> can't live inside a <p>.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      <button
        type="button"
        className="cs-video-link"
        data-cursor="interactive"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {mounted
        ? createPortal(
            <VideoLightbox
              open={open}
              onClose={() => setOpen(false)}
              src="/work/copilot/smc-copilot-demo.mp4"
              poster="/work/copilot/smc-copilot-demo-poster.jpg"
              title="Social Media Copilot: walkthrough video"
            />,
            document.body,
          )
        : null}
    </>
  );
}
