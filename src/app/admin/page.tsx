"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CarFront, Ticket, IndianRupee, Clock, ArrowUpRight, RefreshCw, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewStats } from "@/lib/hooks/use-overview-stats";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import type { Booking } from "@/lib/bookings";

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-20" />
        ) : (
          <p className="mt-2 font-mono-num text-2xl font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { stats, loading: statsLoading, refresh: refreshStats } = useOverviewStats();

  // Bounded to the 6 most recent bookings — this page's cost stays flat
  // no matter how many bookings exist in total. Full history lives in
  // the Bookings tab, which paginates instead of loading everything.
  const {
    items: recentBookings,
    loading: recentLoading,
    refresh: refreshRecent,
  } = usePaginatedQuery<Booking>("bookings", [], "createdAt", { pageSize: 6 });

  const handleRefresh = () => {
    refreshStats();
    refreshRecent();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot of the fleet and bookings — refresh for the latest.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="size-3.5" /> Refresh
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={CarFront} label="Vehicles listed" value={String(stats?.vehicleCount ?? 0)} loading={statsLoading} />
        <StatCard icon={Ticket} label="Confirmed bookings" value={String(stats?.confirmedBookings ?? 0)} loading={statsLoading} />
        <StatCard
          icon={IndianRupee}
          label="Revenue (paid)"
          value={`₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`}
          loading={statsLoading}
        />
        <StatCard icon={Clock} label="Awaiting payment" value={String(stats?.pendingPayments ?? 0)} loading={statsLoading} />
        <StatCard icon={TriangleAlert} label="Overdue returns" value={String(stats?.overdueReturns ?? 0)} loading={statsLoading} />
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
            {recentLoading ? (
              <div className="space-y-3 p-5">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              recentBookings.map((b) => (
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
