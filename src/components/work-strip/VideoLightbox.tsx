"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * A full-screen player for a project walkthrough. Uses the native <dialog>,
 * so Escape, focus trapping and the backdrop come for free. The video only
 * starts loading when the dialog opens.
 */
export default function VideoLightbox({
  open,
  onClose,
  src,
  poster,
  title,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      if (!video.src) video.src = src;
      void video.play().catch(() => {});
    } else if (!open && dialog.open) {
      video.pause();
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, src]);

  return (
    <dialog
      ref={dialogRef}
      className="video-lightbox"
      aria-label={title}
      onClose={() => {
        videoRef.current?.pause();
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop (the dialog itself, not its contents) closes it.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="video-lightbox__frame">
        <video
          ref={videoRef}
          className="video-lightbox__video"
          poster={poster}
          controls
          playsInline
          preload="none"
        />
        <button
          type="button"
          className="video-lightbox__close"
          aria-label="Close video"
          data-cursor="interactive"
          onClick={onClose}
        >
          <X size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
