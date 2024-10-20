"use client";
import { usePathname } from "next/navigation";
import React from "react";

function BgVideo() {
  const pathname = usePathname();

  return (
    pathname === "/" && (
      <video
        className="w-full object-cover absolute top-[110px] z-[-1] h-[90%]"
        autoPlay
        loop
        muted
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>
    )
  );
}

export default BgVideo;
