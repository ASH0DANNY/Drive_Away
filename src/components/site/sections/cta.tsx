"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { useSiteConfig } from "@/context/site-config-context";

export function CTASection() {
  const { config } = useSiteConfig();
  const { cta } = config;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-foreground px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(90deg,var(--color-background)_0,var(--color-background)_2px,transparent_2px,transparent_40px)]"
          />
          <h2 className="font-display text-3xl font-semibold tracking-tight text-background sm:text-4xl">
            {cta.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">{cta.subheading}</p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/fleet">
              {cta.buttonLabel} <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
