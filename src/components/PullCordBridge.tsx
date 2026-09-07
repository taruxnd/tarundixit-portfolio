"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";

export default function PullCordBridge({
  cordPull,
  render,
}: {
  cordPull: MotionValue<number>;
  render: (pull: number) => React.ReactNode;
}) {
  const [pull, setPull] = useState(0);

  useMotionValueEvent(cordPull, "change", setPull);

  return <>{render(pull)}</>;
}
