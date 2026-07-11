"use client";

import { Quote } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { useSiteConfig } from "@/context/site-config-context";

export function Testimonials() {
  const { config } = useSiteConfig();
  const { testimonials } = config;

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {testimonials.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="h-full rounded-xl border border-border bg-card p-6">
                <Quote className="size-6 text-primary" />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
