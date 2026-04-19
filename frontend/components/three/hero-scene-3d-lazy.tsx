"use client";

import dynamic from "next/dynamic";

const HeroScene3D = dynamic(
  () => import("./hero-scene-3d").then((mod) => mod.HeroScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(241,96,114,0.18),transparent_70%)]" />
    ),
  },
);

export function HeroScene3DLazy() {
  return <HeroScene3D />;
}
