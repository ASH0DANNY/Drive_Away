"use client";

import { use as usePromise } from "react";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { useVehicle } from "@/lib/hooks/use-vehicle";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { vehicle, loading, notFound } = useVehicle(id);

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (notFound || !vehicle) return <p className="text-sm text-muted-foreground">Vehicle not found.</p>;

  return <VehicleForm existing={vehicle} />;
}
