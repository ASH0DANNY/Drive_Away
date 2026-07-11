"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { VehicleCard } from "@/components/site/vehicle-card";
import { useVehicles } from "@/lib/hooks/use-vehicles";

export function FleetPreview() {
  const { vehicles } = useVehicles(4);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            On the lot right now
          </h2>
          <p className="mt-2 text-muted-foreground">
            A slice of what&apos;s live — full fleet has live filters by type, price and city.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/fleet">
            View full fleet <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((vehicle, i) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
        ))}
      </div>
    </section>
  );
}
