"use client";

import { useEffect, useState } from "react";

const OBJECTIVES = [
  "Promote a Product",
  "Build Brand Awareness",
  "Announce an Event",
];

const POSTS = [
  {
    format: "Carousel",
    platform: "Instagram",
    title: "Day 1 · Family mobility",
    body: "Five seats. One Clavis. Weekend ready.",
    tone: "warm",
  },
  {
    format: "Reel",
    platform: "TikTok",
    title: "Day 2 · Open road",
    body: "From school run to Sunday drive — in 15s.",
    tone: "cool",
  },
  {
    format: "Static",
    platform: "LinkedIn",
    title: "Day 3 · Thought piece",
    body: "Why family SUVs are becoming the new sedan.",
    tone: "neutral",
  },
];

const GEN_STATES = ["Drafting posts…", "Matching brand voice…", "Scheduling…"];

export default function CopilotWindow() {
  const [activeObjective, setActiveObjective] = useState(0);
  const [genIndex, setGenIndex] = useState(0);
  const [postOffset, setPostOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const objectiveTimer = window.setInterval(() => {
      setActiveObjective((i) => (i + 1) % OBJECTIVES.length);
    }, 3200);

    const genTimer = window.setInterval(() => {
      setGenIndex((i) => (i + 1) % GEN_STATES.length);
    }, 2400);

    const postTimer = window.setInterval(() => {
      setPostOffset((i) => (i + 1) % POSTS.length);
    }, 3800);

    return () => {
      window.clearInterval(objectiveTimer);
      window.clearInterval(genTimer);
      window.clearInterval(postTimer);
    };
  }, []);

  const orderedPosts = POSTS.map((_, i) => POSTS[(i + postOffset) % POSTS.length]);

  return (
    <div className="project-window project-window--copilot" aria-hidden>
      <div className="project-window__stage">
        <div className="copilot-plane">
          <header className="copilot-hero">
            <p className="copilot-hero__eyebrow">✦ From brief to publish-ready</p>
            <h3 className="copilot-hero__title">
              <span>Social</span> Media Copilot
            </h3>
            <p className="copilot-hero__sub">
              Plan, create and schedule your next{" "}
              <strong>5 days</strong> of content.
            </p>
          </header>

          <div className="copilot-objectives">
            {OBJECTIVES.map((label, i) => (
              <span
                key={label}
                className={`copilot-objective${i === activeObjective ? " is-active" : ""}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="copilot-composer">
            <div className="copilot-composer__prompt">
              Launch a family mobility campaign for Kia Carens Clavis…
            </div>
            <div className="copilot-composer__footer">
              <span className="copilot-composer__platforms">
                <span className="copilot-dot copilot-dot--ig" />
                <span className="copilot-dot copilot-dot--x" />
                <span className="copilot-dot copilot-dot--li" />
                Instagram · X · LinkedIn
              </span>
              <span className="copilot-composer__generate">Generate</span>
            </div>
          </div>

          <div className="copilot-gen">
            <span className="copilot-gen__pulse" />
            {GEN_STATES[genIndex]}
          </div>

          <div className="copilot-posts">
            {orderedPosts.map((post) => (
              <article
                key={post.title}
                className={`copilot-post copilot-post--${post.tone}`}
              >
                <div className="copilot-post__media">
                  <span className="copilot-post__format">{post.format}</span>
                </div>
                <div className="copilot-post__meta">
                  <span className="copilot-post__platform">{post.platform}</span>
                  <strong>{post.title}</strong>
                  <p>{post.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="copilot-onboard">
          <div className="copilot-onboard__eyebrow">
            <span className="copilot-onboard__spark" />
            Get started
          </div>
          <p className="copilot-onboard__title">Set up your Social Media</p>
          <ol className="copilot-onboard__steps">
            <li>
              <span>1</span> Connect first account
            </li>
            <li>
              <span>2</span> Make your first post
            </li>
            <li className="is-highlight">
              <span>3</span> Build your first campaign
            </li>
          </ol>
          <div className="copilot-onboard__progress">
            <span>1 of 3 completed</span>
            <div className="copilot-onboard__bar">
              <i style={{ width: "34%" }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
