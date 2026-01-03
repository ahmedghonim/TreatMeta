import React from "react";
import type { Metadata } from "next";

import AboutMission from "@/components/view/about/about-mission";
import AboutHero from "@/components/view/about/about-hero";
import AboutVision from "@/components/view/about/about-vision";
import TreatmentSection from "@/components/view/about/treatmeta";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TreatMeta - our mission to simplify meta-analysis data preparation. Meet our team and discover our vision for evidence-based research tools.",
  openGraph: {
    title: "About Us | TreatMeta",
    description: "Learn about TreatMeta and our mission to simplify meta-analysis data preparation.",
  },
};

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutVision />
      <TreatmentSection />
    </>
  );
}

export default AboutPage;
