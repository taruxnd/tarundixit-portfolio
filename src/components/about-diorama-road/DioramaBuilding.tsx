"use client";

import DioramaProp from "./DioramaProp";

/** Kenney building near the start of the road (no logo). */
export default function DioramaBuilding() {
  return (
    <DioramaProp
      modelUrl="/models/kenney-large-building.glb"
      targetHeight={2}
      withLogo={false}
    />
  );
}
