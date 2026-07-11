"use client";

import { ShieldCheck, BadgeIndianRupee, MapPinned, Headset } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { useSiteConfig } from "@/context/site-config-context";

const ICONS = [BadgeIndianRupee, ShieldCheck, MapPinned, Headset];

export function Features() {
  const { config } = useSiteConfig();
  const { features } = config;

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {features.heading}
          </h2>
          <p className="mt-3 text-muted-foreground">{features.subheading}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
