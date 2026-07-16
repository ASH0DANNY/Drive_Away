"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, TriangleAlert, ShieldCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { findClashingBookings } from "@/lib/availability";
import { approveReschedule, rejectReschedule } from "@/lib/reschedule";
import type { Booking } from "@/lib/bookings";

export function RescheduleReviewDialog({
  booking,
  open,
  onOpenChange,
  onDecided,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDecided?: () => void;
}) {
  const [checking, setChecking] = React.useState(true);
  const [clashes, setClashes] = React.useState<Booking[]>([]);
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setChecking(true);
    setNote("");
    const start = booking.rescheduleRequestedStartDate ?? booking.startDate;
    const end = booking.rescheduleRequestedEndDate ?? booking.endDate;
    findClashingBookings(booking.vehicleId, start, end, booking.id)
      .then(setClashes)
      .catch((err) => {
        console.error("Failed to check for clashes:", err);
        setClashes([]);
      })
      .finally(() => setChecking(false));
  }, [open, booking]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await approveReschedule(booking, note || undefined);
      toast.success("Reschedule approved — dates and price updated.");
      onOpenChange(false);
      onDecided?.();
    } catch (err) {
      console.error("Failed to approve reschedule:", err);
      toast.error("Couldn't approve — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await rejectReschedule(booking.id, note || undefined);
      toast.success("Reschedule request declined.");
      onOpenChange(false);
      onDecided?.();
    } catch (err) {
      console.error("Failed to reject reschedule:", err);
      toast.error("Couldn't update — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule request</DialogTitle>
          <DialogDescription>
            {booking.customerName} · {booking.vehicleName}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="flex items-center justify-center gap-4 rounded-lg border border-border p-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Current dates</p>
              <p className="mt-1 font-mono-num">
                {booking.startDate} → {booking.endDate}
              </p>
            </div>
            <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Requested dates</p>
              <p className="mt-1 font-mono-num font-semibold text-primary">
                {booking.rescheduleRequestedStartDate} → {booking.rescheduleRequestedEndDate}
              </p>
            </div>
          </div>

          {booking.rescheduleReason && (
            <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              &ldquo;{booking.rescheduleReason}&rdquo;
            </p>
          )}

          <Separator />

          {checking ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking this vehicle&apos;s other bookings…
            </p>
          ) : clashes.length > 0 ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="flex items-center gap-2 font-medium text-destructive">
                <TriangleAlert className="size-4 shrink-0" />
                Clashes with {clashes.length} other booking{clashes.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {clashes.map((c) => (
                  <li key={c.id}>
                    {c.customerName} — {c.startDate} to {c.endDate}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Approving anyway will double-book this vehicle. Consider declining instead.
              </p>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-success">
              <ShieldCheck className="size-4 shrink-0" /> No clash — this vehicle is free for the requested dates.
            </p>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Note (optional, visible to customer)</Label>
            <Textarea
              className="mt-1.5"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={clashes.length > 0 ? "e.g. Those dates are already booked out." : ""}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReject} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Decline
          </Button>
          <Button
            variant={clashes.length > 0 ? "destructive" : "default"}
            onClick={handleApprove}
            disabled={submitting || checking}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {clashes.length > 0 ? "Approve anyway" : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
