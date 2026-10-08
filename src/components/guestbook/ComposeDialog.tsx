"use client";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Camera, Upload, X } from "lucide-react";
import CameraCapture from "./CameraCapture";
import { preparePhoto } from "./photo";

export type Draft = { name: string; company: string; message: string; linkedin: string; photo: string; website: string };

type Props = {
  /** Resolves to an error to show in the form, or null when planted. */
  onPlant: (draft: Draft) => Promise<string | null>;
};

/**
 * The signing form, rendered in a native <dialog>. The parent opens it with
 * `ref.current?.showModal()`; it closes itself on submit, Escape, or backdrop click.
 */
const ComposeDialog = forwardRef<HTMLDialogElement, Props>(function ComposeDialog({ onPlant }, ref) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [planting, setPlanting] = useState(false);
  const [message, setMessage] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [photo, setPhoto] = useState("");
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const uploadVersion = useRef(0);
  const inner = useRef<HTMLDialogElement | null>(null);

  useEffect(() => () => void uploadVersion.current++, []);

  function setRefs(node: HTMLDialogElement | null) {
    inner.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function close() {
    setCamera(false);
    setError("");
    inner.current?.close();
  }

  async function upload(file?: File) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setLoading(true);
    setError("");
    try {
      const result = await preparePhoto(file);
      if (version === uploadVersion.current) setPhoto(result);
    } catch (e) {
      if (version === uploadVersion.current) setError(e instanceof Error ? e.message : "Could not load that photo.");
    } finally {
      if (version === uploadVersion.current) setLoading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (planting) return;
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Add your name and a little hello first.");
      return;
    }
    let profile = "";
    if (linkedin.trim()) {
      try {
        const url = new URL(linkedin.trim());
        if (url.protocol !== "https:" || !/(^|\.)linkedin\.com$/i.test(url.hostname)) throw new Error();
        profile = url.href;
      } catch {
        setError("Use a full LinkedIn link, starting with https://www.linkedin.com/.");
        return;
      }
    }
    setPlanting(true);
    const failure = await onPlant({ name: name.trim(), company: company.trim(), message: message.trim(), linkedin: profile, photo, website });
    setPlanting(false);
    if (failure) {
      setError(failure);
      return;
    }
    setName("");
    setCompany("");
    setMessage("");
    setLinkedin("");
    setPhoto("");
    close();
  }

  return (
    <dialog
      ref={setRefs}
      className="guest-dialog guest-compose"
      aria-labelledby="guest-compose-title"
      onCancel={(event) => {
        event.preventDefault();
        if (camera) setCamera(false);
        else close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section className="guest-dialog-panel">
        <button className="guest-icon-button guest-dialog-close" type="button" onClick={close} aria-label="Close guestbook form">
          <X size={20} />
        </button>
        <h2 id="guest-compose-title">Leave a hello.</h2>
        <form onSubmit={submit}>
          <div className="guest-photo-controls">
            <div className="guest-photo-preview">
              {photo ? <img src={photo} alt="Your photo preview" /> : <Camera size={34} strokeWidth={1.2} />}
            </div>
            <div className="guest-photo-buttons">
              <span className="guest-photo-label">Start with a photo.</span>
              <span className="guest-photo-hint">Put a face to your hello.</span>
              <button
                type="button"
                className="guest-photo-primary"
                onClick={() => {
                  setError("");
                  setCamera(true);
                }}
                disabled={loading}
              >
                <Camera size={16} />
                {photo ? "Retake photo" : "Take a photo"}
              </button>
              <button type="button" onClick={() => input.current?.click()} disabled={loading}>
                <Upload size={16} />
                {loading ? "Preparing…" : "Upload"}
              </button>
              <button
                type="button"
                className="guest-photo-remove"
                onClick={() => {
                  uploadVersion.current++;
                  setPhoto("");
                  setLoading(false);
                  document.getElementById("guest-name")?.focus();
                }}
              >
                {photo ? "Remove photo" : "Skip for now"}
              </button>
            </div>
          </div>
          <input
            className="guest-file-input"
            ref={input}
            type="file"
            accept="image/*"
            aria-label="Upload a photo"
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <div className="guest-fields">
            <label htmlFor="guest-name">Name</label>
            <input
              id="guest-name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              maxLength={60}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="guest-company">
              Company <span>· optional</span>
            </label>
            <input
              id="guest-company"
              name="company"
              autoComplete="organization"
              placeholder="Where you work"
              maxLength={60}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <div className="guest-message-label">
              <label htmlFor="guest-message">Message</label>
              <span>{message.length}/300</span>
            </div>
            <textarea
              id="guest-message"
              name="message"
              placeholder="A little hello…"
              maxLength={300}
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label htmlFor="guest-linkedin">
              LinkedIn <span>· optional</span>
            </label>
            <input
              id="guest-linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={linkedin}
              maxLength={300}
              onChange={(e) => setLinkedin(e.target.value)}
            />
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
          </div>
          {error && (
            <p className="guest-error" role="alert">
              {error}
            </p>
          )}
          <div className="guest-compose-footer">
            <p className="guest-compose-note">Your photo and hello will be public on this page.</p>
            <button type="submit" className="guest-submit" disabled={loading || planting}>
              {planting ? "Planting…" : "Plant my hello"}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </section>
      {camera && <CameraCapture onPhoto={setPhoto} onClose={() => setCamera(false)} />}
    </dialog>
  );
});

export default ComposeDialog;
