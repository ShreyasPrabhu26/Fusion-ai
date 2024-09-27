import React from "react";

import LandingNavbar from "@/components/landing-navbar";
import LandingContent from "@/components/landing-content";
import LandingHero from "@/components/landing-hero";

export default function LandingPage() {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
}
