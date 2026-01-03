import ScrollTop from "@/components/layout/footer/scroll-top";
import Feedback from "@/components/view/home/feedback";
import Hero from "@/components/view/home/hero";
import OurConversions from "@/components/view/home/our-conversions";
import OurStory from "@/components/view/home/our-story";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "TreatMeta is a free online tool for meta-analysis data conversion. Convert mean and SD, estimate effect sizes, combine study groups, and prepare data for systematic reviews.",
  openGraph: {
    title: "TreatMeta - Free Meta-Analysis Data Conversion Tool",
    description: "Convert effect sizes, combine study groups, and prepare your data for systematic reviews with our free online tool.",
  },
};


export default function Home() {

  return (
    <>
      <Hero />

      <OurStory />

      <OurConversions />

      {/* <Feedback /> */}
    </>
  );
}
