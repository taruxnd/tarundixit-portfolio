// React stays imported even though the passthrough below has no JSX: this
// project compiles JSX with the classic runtime, so the moment you write a
// <div> here, React must be in scope or the prerender fails with
// "React is not defined".
import React, { type ReactNode } from "react";

/**
 * Wraps the content of every page, inside <body>.
 *
 * This is a passthrough: it renders nothing of its own, so until you change it
 * every page is exactly what Framer published. Put a cookie banner, a chat
 * widget or a provider here and it appears on every page. Nothing regenerates
 * this file, so it survives a re-conversion.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
