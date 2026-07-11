"use client";

import { useRef } from "react";
import { RouteSpine } from "@/components/site/route-spine";
import { Hero } from "@/components/site/sections/hero";
import { HowItWorks } from "@/components/site/sections/how-it-works";
import { Features } from "@/components/site/sections/features";
import { FleetPreview } from "@/components/site/sections/fleet-preview";
import { Testimonials } from "@/components/site/sections/testimonials";
import { CTASection } from "@/components/site/sections/cta";

export default function HomePage() {
  const spineRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={spineRef} className="relative">
      <RouteSpine containerRef={spineRef} />
      <Hero />
      <HowItWorks />
      <Features />
      <FleetPreview />
      <Testimonials />
      <CTASection />
    </div>
  );
}
