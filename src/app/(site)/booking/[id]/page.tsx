"use client";

import * as React from "react";
import { use as usePromise } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVehicle } from "@/lib/hooks/use-vehicle";

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { vehicle } = useVehicle(id);
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <Card>
        <CardContent className="flex flex-col items-center p-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Construction className="size-6" />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold">Checkout is next up</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The full checkout flow — sign-in, license verification, and the dummy payment
            gateway — is being built in the next phase. Your selection is saved below.
          </p>

          {vehicle && (
            <div className="mt-6 w-full rounded-lg border border-border bg-muted/40 p-4 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium">{vehicle.name}</span>
              </div>
              {start && end && (
                <div className="mt-1.5 flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-mono-num">
                    {format(new Date(start), "d MMM")} – {format(new Date(end), "d MMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          )}

          <Button variant="outline" className="mt-6" asChild>
            <Link href="/fleet">
              <ArrowLeft className="size-4" /> Back to fleet
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
