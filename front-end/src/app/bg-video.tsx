"use client";
import { usePathname } from "next/navigation";
import React from "react";

function BgVideo() {
  const pathname = usePathname();

  return (
    pathname === "/" && (
      <>
      
      <video
        className="w-full object-cover absolute top-[-110px] left-0 z-[-2] h-[100vh]"
        autoPlay
        loop
        muted
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>
      <div  className="w-full bg-[rgba(0,0,0,0.45)]   object-cover absolute top-[-110px] left-0 z-[-1] h-[100vh]">
      </div>
      </>
    )
  );
}

export default BgVideo;
