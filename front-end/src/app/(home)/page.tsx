import ScrollTop from "@/components/layout/footer/scroll-top";
import Feedback from "@/components/view/home/feedback";
import Hero from "@/components/view/home/hero";
import OurConversions from "@/components/view/home/our-conversions";
import OurStory from "@/components/view/home/our-story";
import React from "react";

export default function Home() {
  return (
    <>
      <Hero />

      <OurStory />

      <OurConversions />

      <Feedback />
    </>
  );
}
