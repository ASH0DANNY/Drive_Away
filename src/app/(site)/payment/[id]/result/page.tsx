"use client";

import { use as usePromise } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Ticket, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceActions } from "@/components/site/invoice-actions";
import { useBooking } from "@/lib/hooks/use-booking";

export default function PaymentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { booking, loading } = useBooking(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-5 py-14">
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl font-semibold">Booking not found</p>
        <Button className="mt-6" asChild>
          <Link href="/fleet">Back to fleet</Link>
        </Button>
      </div>
    );
  }

  // Derived from the live booking record rather than a URL param, so this
  // page is correct whether it's reached from a successful/failed online
  // payment, or straight from checkout when online payments are off.
  const state: "paid" | "failed" | "awaiting-offline" =
    booking.paymentStatus === "paid" ? "paid" : booking.paymentStatus === "failed" ? "failed" : "awaiting-offline";

  const visual = {
    paid: { icon: CheckCircle2, tone: "success" as const },
    failed: { icon: XCircle, tone: "destructive" as const },
    "awaiting-offline": { icon: Clock, tone: "secondary" as const },
  }[state];

  const Icon = visual.icon;
  const toneClass =
    visual.tone === "success"
      ? "bg-success/10 text-success"
      : visual.tone === "destructive"
      ? "bg-destructive/10 text-destructive"
      : "bg-secondary/10 text-secondary";

  const heading =
    state === "paid"
      ? "Booking confirmed"
      : state === "failed"
      ? "Payment didn't go through"
      : "Reservation confirmed — pay at pickup";

  const subtext =
    state === "paid"
      ? `${booking.vehicleName} is reserved for your dates. A confirmation is on your account.`
      : state === "failed"
      ? "No charge was made. You can try again with the same or a different payment method."
      : `${booking.vehicleName} is held for your dates. Bring your license and pay ₹${booking.total.toLocaleString("en-IN")} in person at pickup.`;

  return (
    <div className="mx-auto max-w-md px-5 py-14 lg:py-20">
      <Card>
        <CardContent className="flex flex-col items-center p-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`flex size-16 items-center justify-center rounded-full ${toneClass}`}
          >
            <Icon className="size-9" />
          </motion.div>

          <h1 className="mt-5 font-display text-xl font-semibold">{heading}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>

          <div className="mt-6 w-full rounded-lg border border-border bg-muted/40 p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium">{booking.vehicleName}</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-muted-foreground">Dates</span>
              <span className="font-mono-num">
                {format(new Date(booking.startDate), "d MMM")} – {format(new Date(booking.endDate), "d MMM yyyy")}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-mono-num">₹{booking.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {state === "paid" && (
            <div className="mt-4 w-full">
              <InvoiceActions booking={booking} />
            </div>
          )}

          <div className="mt-6 flex w-full flex-col gap-2">
            {state === "paid" && (
              <>
                <Button asChild size="lg">
                  <Link href="/my-bookings">
                    <Ticket className="size-4" /> View my bookings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/fleet">Book another vehicle</Link>
                </Button>
              </>
            )}
            {state === "failed" && (
              <>
                <Button asChild size="lg">
                  <Link href={`/payment/${booking.id}`}>
                    <RotateCcw className="size-4" /> Try again
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/fleet/${booking.vehicleId}`}>Back to vehicle</Link>
                </Button>
              </>
            )}
            {state === "awaiting-offline" && (
              <Button asChild size="lg">
                <Link href="/my-bookings">
                  <Ticket className="size-4" /> View my bookings
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
