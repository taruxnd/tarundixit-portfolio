"use client";

import { useEffect } from "react";

const STYLE_ID = "nbg-v13-glass";

export function useInjectNavbarStyles(): void {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
@keyframes nbg-link-in { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.nbg-link-enter { animation: nbg-link-in .34s cubic-bezier(.22,1,.36,1) both; }
`;
    document.head.appendChild(style);
  }, []);
}
