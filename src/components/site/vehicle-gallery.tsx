"use client";

import * as React from "react";
import Image from "next/image";
import { Car, Bike } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/default-content";

export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = React.useState(0);
  const hasImages = vehicle.images.length > 0;
  const Icon = vehicle.type === "car" ? Car : Bike;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[16/10]">
        {hasImages ? (
          <Image
            src={vehicle.images[active]}
            alt={vehicle.name}
            fill
            priority
            className="object-cover"
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
            <Icon className="size-24 text-foreground/20" strokeWidth={1} />
          </div>
        )}
      </div>

      {hasImages && vehicle.images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {vehicle.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
