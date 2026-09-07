"use client";

import { useEffect, useState } from "react";
import DraggableTags from "./DraggableTags";

type DraggableTagsHeroProps = {
  className?: string;
};

/** Hero embed — chunky pill tags, scaled for bottom-left placement. */
export default function DraggableTagsHero({
  className = "",
}: DraggableTagsHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [rowAligned, setRowAligned] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`pointer-events-auto origin-bottom-left scale-[0.38] sm:scale-[0.44] md:scale-[0.5] ${
        rowAligned
          ? "min-h-[46px] min-w-[280px] sm:min-h-[53px] sm:min-w-[320px] md:min-h-[60px] md:min-w-[360px]"
          : "min-h-[106px] min-w-[152px] sm:min-h-[123px] sm:min-w-[176px] md:min-h-[140px] md:min-w-[200px]"
      } ${className}`}
    >
      {mounted ? (
        <DraggableTags
          ambientGlow={false}
          backgroundColor="transparent"
          expandOnTap={false}
          alignOnTap
          onRowAlignChange={setRowAligned}
          className="!overflow-visible"
        />
      ) : null}
    </div>
  );
}
