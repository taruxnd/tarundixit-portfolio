"use client";

import { useServerInsertedHTML } from "next/navigation";

/** Only touches data-theme / colorScheme — CSS owns backgrounds (avoids body style hydration mismatch). */
const THEME_INIT = `(function(){try{var t=localStorage.getItem("portfolio-lamp-theme");var d=t!=="light";var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark";}})();`;

/**
 * Injects theme boot into the SSR HTML stream. Always returns null so:
 * - React 19 never client-renders a <script>
 * - No server/client branch hydration mismatch
 */
export default function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script
      id="portfolio-theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_INIT }}
    />
  ));

  return null;
}
