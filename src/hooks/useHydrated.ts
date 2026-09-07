"use client";

import { useEffect, useState } from "react";

/** True after the client has mounted — safe to run entrance animations. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
