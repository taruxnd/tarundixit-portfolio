"use client";

import { useServerInsertedHTML } from "next/navigation";

/** Forces dark before paint so stored light prefs can't flash. */
const THEME_INIT = `(function(){try{localStorage.setItem("portfolio-lamp-theme","dark");}catch(e){}var r=document.documentElement;r.dataset.theme="dark";r.style.colorScheme="dark";})();`;

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
