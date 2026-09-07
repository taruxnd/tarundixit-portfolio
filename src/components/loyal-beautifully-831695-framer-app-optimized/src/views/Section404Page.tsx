import React, { Suspense } from "react";
import Layout from "@/src/Layout";


/** The repeated copy in this section: every visible string, and every link.
 *
 *  Framer inlines one subtree per breakpoint — desktop, tablet, phone — so
 *  each of these appears once per breakpoint in the markup. Edit it here and
 *  all of them change. */
export const copy = {
  pageNotFound: "Page Not Found",
  thePageYouAre: "\n      The page you are looking for does not exist or may have been moved.\n    ",
  backToHome: "Back to Home",
} as const;

/** The "/404" page, composed from its Framer sections.
 *
 *  Rendered to static HTML by scripts/prerender.mts at build time — never
 *  shipped as a page.tsx, which would duplicate every byte of this markup into
 *  the RSC flight payload on top of the HTML itself. */
export default function Section404Page() {
  return (
    <body>
      <Layout>
      <main>
        {"\n    "}
        <div className="logo">
          {"\n      "}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="21" fill="currentColor" className="framer-logo">
            {"\n        "}
            <path d="M 14 0 L 14 7 L 7 7 L 0 0 Z M 14 14 L 7 14 L 7 21 L 0 14 L 0 7 L 7 7 Z" />
            {"\n      "}
          </svg>
          {"\n    "}
        </div>
        {"\n    "}
        <h1 className="title">
          {copy.pageNotFound}
        </h1>
        {"\n    "}
        <div className="description">
          {copy.thePageYouAre}
        </div>
        {"\n    "}
        <a href="/" role="button" className="btn--back">
          {copy.backToHome}
        </a>
        {"\n  "}
      </main>
      {"\n\n"}
      </Layout>
    </body>
  );
}
