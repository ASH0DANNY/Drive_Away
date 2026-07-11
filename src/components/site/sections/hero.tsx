"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Car, Bike, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/context/site-config-context";

export function Hero() {
  const { config } = useSiteConfig();
  const { hero } = config;

  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-28 lg:pt-24">
      {/* ambient road-marking backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [background-image:repeating-linear-gradient(90deg,var(--color-foreground)_0,var(--color-foreground)_2px,transparent_2px,transparent_48px)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-success" />
            {hero.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {hero.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <Link href="/fleet">
                {hero.ctaPrimary} <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">{hero.ctaSecondary}</Link>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono-num text-2xl font-semibold sm:text-3xl">{stat.value}</dt>
                <dd className="text-xs text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* draggable showcase card — tactile, on-brand "moveable" element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <motion.div
            drag
            dragElastic={0.15}
            dragConstraints={{ top: -24, bottom: 24, left: -24, right: 24 }}
            whileDrag={{ scale: 1.03, cursor: "grabbing" }}
            className="relative cursor-grab rounded-2xl border border-border bg-card p-5 shadow-xl active:cursor-grabbing"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Car className="size-3.5" /> Available now
              </span>
              <GripHorizontal className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-muted to-secondary/10">
              <Car className="size-16 text-foreground/25" strokeWidth={1.1} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-display text-sm font-semibold">Vantage Sedan</p>
                <p className="text-xs text-muted-foreground">Automatic · Petrol · Bengaluru</p>
              </div>
              <p className="font-mono-num text-lg font-semibold">₹2,199<span className="text-xs text-muted-foreground">/day</span></p>
            </div>
          </motion.div>

          <motion.div
            drag
            dragElastic={0.2}
            dragConstraints={{ top: -20, bottom: 20, left: -20, right: 20 }}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -left-8 -bottom-8 flex cursor-grab items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lg active:cursor-grabbing sm:-left-10"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-secondary/15">
              <Bike className="size-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-semibold">Ridgeline 350</p>
              <p className="font-mono-num text-xs text-muted-foreground">₹799/day</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
