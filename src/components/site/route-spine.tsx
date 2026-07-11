"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Navigation } from "lucide-react";

/**
 * The site's signature scroll element. A dashed route line runs down the
 * spine of the homepage; a marker travels along it as the visitor scrolls,
 * literalizing "pick a route, pick a ride." Desktop-only (lg+) — on
 * smaller screens the metaphor doesn't have room to breathe, so it's
 * hidden rather than cramped.
 */
export function RouteSpine({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 85%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  const top = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const rotate = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0, 6, -6, 0]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-6 hidden w-px lg:block xl:left-10"
    >
      <div className="sticky top-0 h-screen">
        <svg
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 overflow-visible"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            stroke="var(--color-route-line)"
            strokeWidth="2"
            className="route-dash"
          />
        </svg>
        <motion.div
          style={{ top, rotate }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_5px_var(--color-background)]">
            <Navigation className="size-4" fill="currentColor" />
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
