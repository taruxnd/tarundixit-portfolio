"use client";

import { useEffect, useState } from "react";
import { isSafari } from "@/lib/browserSupport";

export function useSafari() {
  const [safari, setSafari] = useState(false);

  useEffect(() => {
    setSafari(isSafari());
  }, []);

  return safari;
}
