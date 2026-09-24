import React, { Suspense } from "react";


/** The "/404" page, composed from its Framer sections.
 *
 *  Rendered to static HTML by scripts/prerender.mts at build time — never
 *  shipped as a page.tsx, which would duplicate every byte of this markup into
 *  the RSC flight payload on top of the HTML itself. */
export default function Section404Page() {
  return (
    <body>
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
          {"Page Not Found"}
        </h1>
        {"\n    "}
        <div className="description">
          {"\n      The page you are looking for does not exist or may have been moved.\n    "}
        </div>
        {"\n    "}
        <a href="/" role="button" className="btn--back">
          {"Back to Home"}
        </a>
        {"\n  "}
      </main>
      {"\n\n"}
    </body>
  );
}
