"use client";

import { useId, useState } from "react";
import { CircleHelp } from "lucide-react";

export default function UxTerm({ term, explanation }: { term: string; explanation: string }) {
  const id = useId();
  const [position, setPosition] = useState({ left: 16, top: 16 });

  return (
    <span className="cs-ux-term">
      {term}
      <button
        type="button"
        className="cs-ux-term__help"
        aria-label={`What does ${term.toLowerCase()} mean?`}
        popoverTarget={id}
        data-cursor="interactive"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPosition({
            left: Math.max(16, Math.min(rect.left, window.innerWidth - 280)),
            top: Math.max(16, Math.min(rect.bottom + 8, window.innerHeight - 160)),
          });
        }}
      >
        <CircleHelp size={15} aria-hidden="true" />
      </button>
      <span id={id} popover="auto" className="cs-ux-term__explanation" style={position}>
        {explanation}
      </span>
    </span>
  );
}
