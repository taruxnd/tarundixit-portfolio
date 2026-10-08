"use client";
import { useEffect, useRef, useState } from "react";

/**
 * A live camera feed that fills the polaroid's photo square, with an
 * instant-camera shutter. Captures a centred square JPEG (≤800px).
 */
export default function SlotCamera({ onPhoto, onCancel }: { onPhoto: (photo: string) => void; onCancel: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const shutter = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error();
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 800 } }, audio: false });
        if (!active) return stream.getTracks().forEach((track) => track.stop());
        if (video.current) {
          video.current.srcObject = stream;
          await video.current.play();
        }
      } catch {
        if (active) setError("Couldn't open your camera.");
      }
    })();
    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (ready) shutter.current?.focus();
  }, [ready]);

  function capture() {
    const source = video.current;
    if (!source?.videoWidth) return;
    const size = Math.min(source.videoWidth, source.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.min(800, size);
    const context = canvas.getContext("2d");
    if (!context) return;
    // Mirror to match the preview, so the photo looks like what they saw.
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(source, (source.videoWidth - size) / 2, (source.videoHeight - size) / 2, size, size, 0, 0, canvas.width, canvas.height);
    setFlash(true);
    const photo = canvas.toDataURL("image/jpeg", 0.85);
    setTimeout(() => onPhoto(photo), 180);
  }

  return (
    <div className="guest-slot-camera">
      <video ref={video} autoPlay muted playsInline onLoadedData={() => setReady(true)} />
      {!ready && <p className="guest-slot-status">{error || "Opening your camera…"}</p>}
      {flash && <span className="guest-slot-flash" aria-hidden="true" />}
      <div className="guest-slot-controls">
        <button type="button" className="guest-slot-link" onClick={onCancel}>
          Cancel
        </button>
        <button
          ref={shutter}
          type="button"
          className="guest-shutter"
          onClick={capture}
          disabled={!ready || Boolean(error)}
          aria-label="Take photo"
        />
        <span className="guest-slot-link" aria-hidden="true" style={{ visibility: "hidden" }}>
          Cancel
        </span>
      </div>
    </div>
  );
}
