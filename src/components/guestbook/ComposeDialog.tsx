"use client";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import SlotCamera from "./SlotCamera";
import { preparePhoto } from "./photo";

export type Draft = { name: string; company: string; message: string; linkedin: string; photo: string; website: string };

type Props = {
  /** Resolves to an error to show in the form, or null when planted. */
  onPlant: (draft: Draft) => Promise<string | null>;
};

const PLANT_MS = 650;

/**
 * Signing the guestbook: you fill in the polaroid itself. The front holds your
 * photo (the camera opens right in the frame) and your name on the caption
 * strip; flip it to write your hello on the back, then it's planted.
 * Rendered in a native <dialog>; the parent opens it with `showModal()`.
 */
const ComposeDialog = forwardRef<HTMLDialogElement, Props>(function ComposeDialog({ onPlant }, ref) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [photo, setPhoto] = useState("");
  const [camera, setCamera] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [planting, setPlanting] = useState(false);
  const [planted, setPlanted] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const uploadVersion = useRef(0);
  const inner = useRef<HTMLDialogElement | null>(null);

  useEffect(() => () => void uploadVersion.current++, []);

  function setRefs(node: HTMLDialogElement | null) {
    inner.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function reset() {
    uploadVersion.current++;
    setName("");
    setCompany("");
    setMessage("");
    setLinkedin("");
    setWebsite("");
    setPhoto("");
    setPreparing(false);
    setFlipped(false);
    setPlanted(false);
  }

  function close() {
    setCamera(false);
    setError("");
    inner.current?.close();
  }

  function flip(toBack: boolean) {
    setError("");
    setCamera(false);
    setFlipped(toBack);
    // Focus the first field on the side that's turning toward the visitor.
    setTimeout(() => (toBack ? messageField.current : nameField.current)?.focus({ preventScroll: true }), 320);
  }

  async function upload(file?: File) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setPreparing(true);
    setError("");
    try {
      const result = await preparePhoto(file);
      if (version === uploadVersion.current) setPhoto(result);
    } catch (e) {
      if (version === uploadVersion.current) setError(e instanceof Error ? e.message : "Could not load that photo.");
    } finally {
      if (version === uploadVersion.current) setPreparing(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (planting) return;
    setError("");
    if (!name.trim()) {
      setError("Add your name on the front first.");
      if (flipped) flip(false);
      else nameField.current?.focus();
      return;
    }
    if (!message.trim()) {
      setError("Write your message on the back.");
      if (!flipped) flip(true);
      else messageField.current?.focus();
      return;
    }
    let profile = "";
    if (linkedin.trim()) {
      try {
        const raw = linkedin.trim();
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        if (url.protocol !== "https:" || !/(^|\.)linkedin\.com$/i.test(url.hostname)) throw new Error();
        profile = url.href;
      } catch {
        setError("That LinkedIn link doesn't look right. Try linkedin.com/in/yourname.");
        return;
      }
    }
    setPlanting(true);
    const failure = await onPlant({ name: name.trim(), company: company.trim(), message: message.trim(), linkedin: profile, photo, website });
    if (failure) {
      setPlanting(false);
      setError(failure);
      return;
    }
    // Let the card fly down into the bed before the dialog goes away.
    setPlanted(true);
    setTimeout(() => {
      setPlanting(false);
      close();
      reset();
    }, PLANT_MS);
  }

  const busy = preparing || planting;

  return (
    <dialog
      ref={setRefs}
      className="guest-dialog guest-sign"
      aria-labelledby="guest-sign-title"
      onCancel={(event) => {
        event.preventDefault();
        if (camera) setCamera(false);
        else if (!planting) close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !planting) close();
      }}
    >
      <button className="guest-sign-close" type="button" onClick={close} aria-label="Close" disabled={planting}>
        <X size={20} />
      </button>

      <form className={`guest-sign-form${planted ? " is-planted" : ""}`} onSubmit={submit} noValidate>
        <header className="guest-sign-header">
          <h2 id="guest-sign-title">Leave a message</h2>
          <p aria-live="polite">{flipped ? "What did you think of my work? Or just say hi." : "Add a photo and your name."}</p>
        </header>

        <div className="guest-sign-stage">
          <div className={`guest-sign-card${flipped ? " is-flipped" : ""}`}>
            {/* ---------- Front: photo + caption ---------- */}
            <div className="guest-sign-face guest-sign-front" inert={flipped}>
              <span className="guest-sign-tape" aria-hidden="true" />
              <div className={`guest-sign-photo${photo ? " has-photo" : ""}`}>
                {camera ? (
                  <SlotCamera
                    onPhoto={(value) => {
                      uploadVersion.current++;
                      setPhoto(value);
                      setCamera(false);
                    }}
                    onCancel={() => setCamera(false)}
                  />
                ) : photo ? (
                  <>
                    <img src={photo} alt="Your photo" />
                    <div className="guest-sign-photo-actions">
                      <button type="button" onClick={() => setCamera(true)} disabled={busy}>
                        Retake
                      </button>
                      <button type="button" onClick={() => input.current?.click()} disabled={busy}>
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          uploadVersion.current++;
                          setPhoto("");
                        }}
                        disabled={busy}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="guest-sign-snap"
                      onClick={() => {
                        setError("");
                        setCamera(true);
                      }}
                      disabled={busy}
                    >
                      <Camera className="guest-sign-lens" size={40} strokeWidth={1.4} aria-hidden="true" />
                      <span>{preparing ? "Developing…" : "Tap to take your photo"}</span>
                    </button>
                    <button type="button" className="guest-slot-link guest-sign-upload" onClick={() => input.current?.click()} disabled={busy}>
                      or upload one
                    </button>
                  </>
                )}
              </div>
              <div className="guest-sign-caption">
                <input
                  ref={nameField}
                  id="guest-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-label="Your name"
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span aria-hidden="true">·</span>
                <input
                  id="guest-company"
                  name="company"
                  autoComplete="organization"
                  placeholder="where you work"
                  aria-label="Where you work (optional)"
                  maxLength={60}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            {/* ---------- Back: the note ---------- */}
            <div className="guest-sign-face guest-sign-back" inert={!flipped}>
              <textarea
                ref={messageField}
                id="guest-message"
                name="message"
                placeholder="Feedback, a kind word, or just hi…"
                aria-label="Your message"
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <footer>
                <span className="guest-sign-signature">— {name.trim() || "you"}</span>
                <span className="guest-sign-count" aria-hidden="true">
                  {message.length}/300
                </span>
              </footer>
              <label className="guest-sign-linkedin">
                <span aria-hidden="true">in</span>
                <input
                  id="guest-linkedin"
                  name="linkedin"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="linkedin.com/in/you (optional)"
                  aria-label="LinkedIn profile (optional)"
                  maxLength={300}
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Honeypot: invisible to people, irresistible to bots. */}
        <input
          className="guest-honeypot"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <input
          ref={input}
          className="guest-file-input"
          type="file"
          accept="image/*"
          aria-label="Upload a photo"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <p className="guest-sign-error" role="alert">
          {error}
        </p>

        <div className="guest-sign-actions">
          {flipped ? (
            <>
              <button type="button" className="guest-sign-ghost" onClick={() => flip(false)} disabled={planting}>
                <ArrowLeft size={15} />
                Front
              </button>
              <button type="submit" className="guest-sign-primary" disabled={busy}>
                {planting ? "Sending…" : "Send message"}
              </button>
            </>
          ) : (
            <button type="button" className="guest-sign-primary" onClick={() => flip(true)} disabled={camera}>
              Write on the back
              <ArrowRight size={15} />
            </button>
          )}
        </div>
        <p className="guest-sign-note">Your photo and message will be public on this page.</p>
      </form>
    </dialog>
  );
});

export default ComposeDialog;
