"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, TriangleAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSiteConfig } from "@/context/site-config-context";
import { computeCancellation } from "@/lib/cancellation";
import { cancelBooking, type Booking, type CancelledBy } from "@/lib/bookings";

export function CancelBookingDialog({
  booking,
  cancelledBy,
  open,
  onOpenChange,
  onCancelled,
}: {
  booking: Booking;
  cancelledBy: CancelledBy;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCancelled?: () => void;
}) {
  const { config } = useSiteConfig();
  const [submitting, setSubmitting] = React.useState(false);

  const preview = computeCancellation(booking, config.settings);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await cancelBooking(booking, cancelledBy, preview);
      toast.success("Booking cancelled.");
      onOpenChange(false);
      onCancelled?.();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast.error("Couldn't cancel — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            {booking.vehicleName} · {booking.startDate} to {booking.endDate}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border border-border p-4 text-sm">
          {preview.refundStatus === "not_applicable" ? (
            <p className="flex items-start gap-2 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
              Nothing was charged for this booking yet, so cancelling is free — there&apos;s no
              refund to process either.
            </p>
          ) : (
            <>
              {preview.isOnlinePaid ? (
                <p className="flex items-start gap-2 text-muted-foreground">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
                  This was paid online, so the configured cancellation charge applies.
                </p>
              ) : (
                <p className="flex items-start gap-2 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                  This was paid offline — no cancellation charge applies, full amount refundable.
                </p>
              )}

              <Separator className="my-3" />

              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total paid</span>
                  <span className="font-mono-num">₹{booking.total.toLocaleString("en-IN")}</span>
                </div>
                {preview.chargeAmount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Cancellation charge</span>
                    <span className="font-mono-num">−₹{preview.chargeAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                  <span>Refund amount</span>
                  <span className="font-mono-num">₹{preview.refundAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Refunds are processed manually by the team after cancellation — this simulated
                checkout doesn&apos;t call a real payment gateway refund API.
              </p>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep booking
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Cancel booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
