"use client";

interface CommentBubbleProps {
  text: string;
  className?: string;
  avatarInitials?: string;
  floating?: boolean;
}

export default function CommentBubble({
  text,
  className = "",
  avatarInitials = "RS",
  floating = true,
}: CommentBubbleProps) {
  return (
    <div
      className={`comment-bubble group ${floating ? "absolute" : "relative"} ${className}`}
      data-cursor="interactive"
    >
      <div className="relative">
        <div
          className="comment-bubble-shell relative flex items-center overflow-hidden rounded-full bg-[#BDE3F8] pl-1 shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
          style={{ paddingTop: 4, paddingBottom: 4, paddingRight: 4 }}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-br from-neutral-200 to-neutral-400">
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tracking-wide text-white">
              {avatarInitials}
            </span>
          </div>

          <span className="comment-bubble-text block overflow-hidden whitespace-nowrap text-sm font-medium tracking-[-0.01em] text-neutral-900">
            {text}
          </span>
        </div>

        <div
          className="comment-bubble-tail absolute -bottom-[5px] left-[14px] h-0 w-0"
          style={{
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "9px solid #BDE3F8",
          }}
        />
      </div>
    </div>
  );
}
