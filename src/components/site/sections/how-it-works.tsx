"use client";

import { Reveal } from "@/components/site/reveal";
import { useSiteConfig } from "@/context/site-config-context";

export function HowItWorks() {
  const { config } = useSiteConfig();
  const { howItWorks } = config;

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
      <Reveal>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {howItWorks.heading}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
        {howItWorks.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.12}>
            <div className="relative border-t-2 border-route-line pt-5">
              <span className="font-mono-num text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
