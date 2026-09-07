"use client";

import { useEffect, useState } from "react";

function formatLiveTime(date: Date) {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  const zone =
    new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return { time, zone };
}

export default function HeroLiveTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const { time, zone } = now
    ? formatLiveTime(now)
    : { time: "\u00a0", zone: "" };

  return (
    <time
      className="hero-live-time theme-transition"
      dateTime={now?.toISOString()}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="hero-live-time__label">Local time</span>
      <span className="hero-live-time__value">{time}</span>
      {zone ? <span className="hero-live-time__zone">{zone}</span> : null}
    </time>
  );
}
