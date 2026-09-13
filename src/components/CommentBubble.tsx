"use client";

import { useTheme } from "@/components/ThemeController";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import "./comment-bubble.css";

interface CommentBubbleProps {
  text: string;
  className?: string;
  author?: string;
  timestamp?: string;
  avatarInitials?: string;
  avatarSrc?: string;
  floating?: boolean;
}

export default function CommentBubble({
  text,
  className = "",
  author = "Tarun",
  timestamp = "Just now",
  avatarInitials = "TD",
  avatarSrc,
  floating = true,
}: CommentBubbleProps) {
  const { reducedMotion } = useTheme();
  const [open, setOpen] = useState(false);

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.7 };

  return (
    <div
      className={`figma-comment ${floating ? "absolute" : "relative"} ${className}`}
      data-cursor="interactive"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="card"
            className="figma-comment__card"
            initial={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 10, scale: 0.9 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.94 }
            }
            transition={spring}
          >
            <div className="figma-comment__header">
              <div className="figma-comment__avatar figma-comment__avatar--sm">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover object-[72%_38%]"
                  />
                ) : (
                  <span>{avatarInitials}</span>
                )}
              </div>
              <div className="figma-comment__meta">
                <span className="figma-comment__author">{author}</span>
                <span className="figma-comment__time">{timestamp}</span>
              </div>
            </div>
            <p className="figma-comment__body">{text}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="figma-comment__pin"
        aria-label={`${author}: ${text}`}
        aria-expanded={open}
        animate={
          reducedMotion
            ? undefined
            : { scale: open ? 1.05 : 1 }
        }
        transition={spring}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      >
        <span className="figma-comment__avatar figma-comment__avatar--pin">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt=""
              fill
              sizes="44px"
              className="object-cover object-[72%_38%]"
            />
          ) : (
            <span>{avatarInitials}</span>
          )}
        </span>
        <span className="figma-comment__tip" aria-hidden />
      </motion.button>
    </div>
  );
}
