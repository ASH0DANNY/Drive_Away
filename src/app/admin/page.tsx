"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CarFront, Ticket, IndianRupee, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles } from "@/lib/hooks/use-vehicles";
import { useAllBookings } from "@/lib/hooks/use-all-bookings";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="mt-2 font-mono-num text-2xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { vehicles } = useVehicles();
  const { bookings, loading } = useAllBookings();

  const revenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.total, 0);
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.paymentStatus === "pending").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live snapshot of the fleet and bookings.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CarFront} label="Vehicles listed" value={String(vehicles.length)} />
        <StatCard icon={Ticket} label="Confirmed bookings" value={String(confirmed)} />
        <StatCard
          icon={IndianRupee}
          label="Revenue (paid)"
          value={`₹${revenue.toLocaleString("en-IN")}`}
        />
        <StatCard icon={Clock} label="Awaiting payment" value={String(pending)} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent bookings</h2>
          <Link href="/admin/bookings" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <Card className="mt-3">
          <CardContent className="divide-y divide-border p-0">
            {loading ? (
              <div className="space-y-3 p-5">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              bookings.slice(0, 6).map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">{b.vehicleName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.customerName} · {format(new Date(b.startDate), "d MMM")}–{format(new Date(b.endDate), "d MMM")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-num text-sm">₹{b.total.toLocaleString("en-IN")}</span>
                    <Badge
                      variant={
                        b.paymentStatus === "paid"
                          ? "success"
                          : b.paymentStatus === "failed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {b.paymentStatus === "paid" ? "Confirmed" : b.paymentStatus === "failed" ? "Failed" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
