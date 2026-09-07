"use client";

import Image from "next/image";

export default function BrandHubWindow() {
  return (
    <div className="project-window project-window--mockup" aria-hidden>
      <Image
        src="/work/kumba-signin-mockup.jpg"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="mockup-fill"
        priority={false}
      />
    </div>
  );
}
