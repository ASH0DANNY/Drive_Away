"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car, Bike, Star, Gauge, Users, Fuel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/default-content";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const hasImage = vehicle.images.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              vehicle.type === "car"
                ? "from-primary/15 via-muted to-secondary/10"
                : "from-secondary/15 via-muted to-primary/10"
            )}
          >
            {vehicle.type === "car" ? (
              <Car className="size-14 text-foreground/20" strokeWidth={1.25} />
            ) : (
              <Bike className="size-14 text-foreground/20" strokeWidth={1.25} />
            )}
          </div>
        )}
        <Badge
          variant={vehicle.type === "car" ? "default" : "secondary"}
          className="absolute left-3 top-3 backdrop-blur-sm bg-background/70 capitalize"
        >
          {vehicle.type === "car" ? <Car className="size-3" /> : <Bike className="size-3" />}
          {vehicle.category}
        </Badge>
        {!vehicle.available && (
          <Badge variant="destructive" className="absolute right-3 top-3 bg-background/80">
            Booked out
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight">{vehicle.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" /> {vehicle.rating}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{vehicle.location}</p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {vehicle.transmission && (
            <span className="flex items-center gap-1"><Gauge className="size-3.5" /> {vehicle.transmission}</span>
          )}
          {vehicle.fuel && (
            <span className="flex items-center gap-1"><Fuel className="size-3.5" /> {vehicle.fuel}</span>
          )}
          {vehicle.seats && (
            <span className="flex items-center gap-1"><Users className="size-3.5" /> {vehicle.seats}</span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div>
            <span className="font-mono-num text-lg font-semibold">₹{vehicle.pricePerDay.toLocaleString("en-IN")}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <Button size="sm" variant="outline" disabled={!vehicle.available}>
            {vehicle.available ? "View details" : "Unavailable"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
