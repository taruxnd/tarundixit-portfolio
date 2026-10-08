"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

export default function CameraCapture({
  onPhoto,
  onClose,
}: {
  onPhoto: (photo: string) => void;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const previous = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const stop = () => stream.current?.getTracks().forEach((track) => track.stop());
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("Camera is unavailable here. Please upload a photo instead.");
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 800 } },
          audio: false,
        });
        if (!active) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          await video.current.play();
        }
      } catch {
        if (active) setError("Could not open your camera. Allow camera access, or close this and upload a photo.");
        stop();
      }
    })();
    return () => {
      active = false;
      stop();
      previous?.focus();
    };
  }, []);

  function capture() {
    const source = video.current;
    if (!source?.videoWidth) return;
    const canvas = document.createElement("canvas");
    const size = Math.min(source.videoWidth, source.videoHeight);
    canvas.width = canvas.height = Math.min(800, size);
    canvas
      .getContext("2d")
      ?.drawImage(
        source,
        (source.videoWidth - size) / 2,
        (source.videoHeight - size) / 2,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    onPhoto(canvas.toDataURL("image/jpeg", 0.85));
    onClose();
  }

  function trapTab(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
    if (event.key !== "Tab") return;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
    );
    const first = buttons[0];
    const last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <div
      className="guest-camera-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="guest-camera"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-camera-title"
        onKeyDown={trapTab}
      >
        <button ref={close} className="guest-icon-button guest-camera-close" type="button" onClick={onClose} aria-label="Close camera">
          <X size={20} />
        </button>
        <h2 id="guest-camera-title">A face for your hello.</h2>
        <video ref={video} autoPlay muted playsInline onLoadedData={() => setReady(true)} />
        {error ? <p role="alert">{error}</p> : <p>{ready ? "Make yourself at home." : "Opening your camera…"}</p>}
        <button type="button" className="guest-submit" disabled={!ready || !!error} onClick={capture}>
          <Camera size={18} />
          Take photo
        </button>
      </div>
    </div>
  );
}
