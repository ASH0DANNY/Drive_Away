"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Loader2, TriangleAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { findClashingBookings } from "@/lib/availability";
import { adminEditDates } from "@/lib/reschedule";
import type { Booking } from "@/lib/bookings";

export function EditDatesDialog({
  booking,
  open,
  onOpenChange,
  onSaved,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
}) {
  const [start, setStart] = React.useState(booking.startDate);
  const [end, setEnd] = React.useState(booking.endDate);
  const [checking, setChecking] = React.useState(false);
  const [clashes, setClashes] = React.useState<Booking[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStart(booking.startDate);
      setEnd(booking.endDate);
      setClashes([]);
    }
  }, [open, booking.startDate, booking.endDate]);

  React.useEffect(() => {
    if (!open || end <= start) return;
    setChecking(true);
    const handle = setTimeout(() => {
      findClashingBookings(booking.vehicleId, start, end, booking.id)
        .then(setClashes)
        .catch((err) => {
          console.error("Failed to check for clashes:", err);
          setClashes([]);
        })
        .finally(() => setChecking(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [open, start, end, booking.vehicleId, booking.id]);

  const handleSave = async () => {
    if (end <= start) {
      toast.error("Return date needs to be after pick-up.");
      return;
    }
    setSubmitting(true);
    try {
      await adminEditDates(booking, start, end);
      toast.success("Dates updated.");
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      console.error("Failed to update dates:", err);
      toast.error("Couldn't update — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit booking dates</DialogTitle>
          <DialogDescription>
            {booking.customerName} · {booking.vehicleName} — applies immediately, no approval step.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Pick-up</Label>
              <Input
                type="date"
                className="mt-1.5"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  if (e.target.value >= end) setEnd(format(addDays(new Date(e.target.value), 1), "yyyy-MM-dd"));
                }}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Return</Label>
              <Input
                type="date"
                className="mt-1.5"
                min={format(addDays(new Date(start), 1), "yyyy-MM-dd")}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {checking ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking availability…
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
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-success">
              <ShieldCheck className="size-4 shrink-0" /> This vehicle is free for these dates.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Price recalculates for the new duration — discount amount and deposit carry over
            unchanged.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={clashes.length > 0 ? "destructive" : "default"}
            onClick={handleSave}
            disabled={submitting || checking}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {clashes.length > 0 ? "Save anyway" : "Save dates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
