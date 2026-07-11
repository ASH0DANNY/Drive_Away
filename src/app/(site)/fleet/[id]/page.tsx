"use client";

import * as React from "react";
import { use as usePromise } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Gauge, Fuel, Users, MapPin, Check, CarFront } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { BookingWidget } from "@/components/site/booking-widget";
import { VehicleCard } from "@/components/site/vehicle-card";
import { useVehicle } from "@/lib/hooks/use-vehicle";
import { useVehicles } from "@/lib/hooks/use-vehicles";

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const { vehicle, loading, notFound } = useVehicle(id);
  const { vehicles } = useVehicles();

  const related = React.useMemo(() => {
    if (!vehicle) return [];
    return vehicles.filter((v) => v.type === vehicle.type && v.id !== vehicle.id).slice(0, 3);
  }, [vehicle, vehicles]);

  if (notFound) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-24 text-center">
        <CarFront className="size-10 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="mt-4 font-display text-2xl font-semibold">Vehicle not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been unlisted or the link is off.</p>
        <Button className="mt-6" asChild>
          <Link href="/fleet">Back to fleet</Link>
        </Button>
      </div>
    );
  }

  if (loading || !vehicle) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="aspect-[4/3] w-full rounded-xl sm:aspect-[16/10]" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
      <Link
        href="/fleet"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to fleet
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <VehicleGallery vehicle={vehicle} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={vehicle.type === "car" ? "default" : "secondary"} className="capitalize">
                  {vehicle.category}
                </Badge>
                {!vehicle.available && <Badge variant="destructive">Booked out</Badge>}
              </div>
              <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{vehicle.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" /> {vehicle.location}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Star className="size-4 fill-primary text-primary" /> {vehicle.rating}
              <span className="text-muted-foreground">rating</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-5 sm:max-w-md">
            {vehicle.transmission && (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Gauge className="size-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{vehicle.transmission}</span>
              </div>
            )}
            {vehicle.fuel && (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Fuel className="size-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{vehicle.fuel}</span>
              </div>
            )}
            {vehicle.seats && (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Users className="size-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{vehicle.seats} seats</span>
              </div>
            )}
          </div>

          {vehicle.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold">About this {vehicle.type}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{vehicle.description}</p>
            </div>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold">What's included</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-3.5 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <BookingWidget vehicle={vehicle} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl font-semibold">
            More {vehicle.type === "car" ? "cars" : "bikes"} nearby
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
