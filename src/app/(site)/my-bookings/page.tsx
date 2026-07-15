"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Car, Bike, Ticket, LogIn, CalendarDays, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceActions } from "@/components/site/invoice-actions";
import { CancelBookingDialog } from "@/components/site/cancel-booking-dialog";
import { useAuth } from "@/context/auth-context";
import { useSiteConfig } from "@/context/site-config-context";
import { useMyBookings } from "@/lib/hooks/use-my-bookings";
import { isCancellable } from "@/lib/cancellation";
import type { Booking } from "@/lib/bookings";
import { cn } from "@/lib/utils";

function StatusBadge({ booking }: { booking: Booking }) {
  if (booking.status === "cancelled") {
    return <Badge variant="outline">Cancelled</Badge>;
  }
  if (booking.paymentStatus === "paid" && booking.status === "confirmed") {
    return <Badge variant="success">Confirmed</Badge>;
  }
  if (booking.paymentStatus === "failed") {
    return <Badge variant="destructive">Payment failed</Badge>;
  }
  return <Badge variant="outline">Awaiting payment</Badge>;
}

function RefundNote({ booking }: { booking: Booking }) {
  if (booking.status !== "cancelled" || booking.refundStatus === "not_applicable") return null;
  return (
    <p className="mt-1.5 text-xs text-muted-foreground">
      {booking.refundStatus === "refunded"
        ? `Refunded ₹${booking.refundAmount.toLocaleString("en-IN")}`
        : `Refund of ₹${booking.refundAmount.toLocaleString("en-IN")} pending`}
      {booking.cancellationCharge > 0 && ` (₹${booking.cancellationCharge.toLocaleString("en-IN")} cancellation charge applied)`}
    </p>
  );
}

function BookingRow({ booking, onlinePaymentsEnabled }: { booking: Booking; onlinePaymentsEnabled: boolean }) {
  const Icon = booking.vehicleType === "car" ? Car : Bike;
  const isPaid = booking.paymentStatus === "paid";
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const canCancel = isCancellable(booking);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
              booking.vehicleType === "car"
                ? "from-primary/15 via-muted to-secondary/10"
                : "from-secondary/15 via-muted to-primary/10"
            )}
          >
            <Icon className="size-6 text-foreground/40" strokeWidth={1.25} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">{booking.vehicleName}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {format(new Date(booking.startDate), "d MMM")} – {format(new Date(booking.endDate), "d MMM yyyy")}
            </p>
            <div className="mt-1.5">
              <StatusBadge booking={booking} />
            </div>
            <RefundNote booking={booking} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="font-mono-num text-base font-semibold">
            ₹{booking.total.toLocaleString("en-IN")}
          </span>
          <div className="flex items-center gap-2">
            {isPaid && <InvoiceActions booking={booking} />}
            {!isPaid && booking.status !== "cancelled" && (
              onlinePaymentsEnabled ? (
                <Button size="sm" asChild>
                  <Link href={`/payment/${booking.id}`}>
                    {booking.paymentStatus === "failed" ? "Retry payment" : "Complete payment"}
                  </Link>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Pay at pickup</span>
              )
            )}
            {canCancel && (
              <Button size="sm" variant="outline" onClick={() => setCancelOpen(true)}>
                <Ban className="size-3.5" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <CancelBookingDialog
        booking={booking}
        cancelledBy="customer"
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </Card>
  );
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading } = useMyBookings();
  const { config } = useSiteConfig();

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-6" />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold">Sign in to see your bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your rental history and receipts live here once you're signed in.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/login?redirect=/my-bookings">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">My bookings</h1>
      <p className="mt-1 text-muted-foreground">Every rental, receipt, and pending payment in one place.</p>

      <div className="mt-8 space-y-3">
        {loading || authLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : bookings.length > 0 ? (
          bookings.map((b) => (
            <BookingRow key={b.id} booking={b} onlinePaymentsEnabled={config.settings.onlinePaymentsEnabled} />
          ))
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
            <Ticket className="size-8 text-muted-foreground" strokeWidth={1.25} />
            <p className="mt-3 font-display text-base font-semibold">No bookings yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Once you reserve a car or bike, it'll show up here.
            </p>
            <Button className="mt-4" size="sm" asChild>
              <Link href="/fleet">Browse the fleet</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
