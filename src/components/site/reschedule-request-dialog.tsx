"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { requestReschedule } from "@/lib/reschedule";
import type { Booking } from "@/lib/bookings";

export function RescheduleRequestDialog({
  booking,
  open,
  onOpenChange,
  onRequested,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRequested?: () => void;
}) {
  const [start, setStart] = React.useState(booking.startDate);
  const [end, setEnd] = React.useState(booking.endDate);
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStart(booking.startDate);
      setEnd(booking.endDate);
      setReason("");
    }
  }, [open, booking.startDate, booking.endDate]);

  const today = format(new Date(), "yyyy-MM-dd");
  const unchanged = start === booking.startDate && end === booking.endDate;

  const handleSubmit = async () => {
    if (end <= start) {
      toast.error("Return date needs to be after pick-up.");
      return;
    }
    setSubmitting(true);
    try {
      await requestReschedule(booking, start, end, reason);
      toast.success("Reschedule requested — we'll email you once it's reviewed.");
      onOpenChange(false);
      onRequested?.();
    } catch (err) {
      console.error("Failed to request reschedule:", err);
      toast.error("Couldn't submit that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request new dates</DialogTitle>
          <DialogDescription>
            {booking.vehicleName} — subject to admin approval and vehicle availability.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">New pick-up</Label>
              <Input
                type="date"
                className="mt-1.5"
                min={today}
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  if (e.target.value >= end) setEnd(format(addDays(new Date(e.target.value), 1), "yyyy-MM-dd"));
                }}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">New return</Label>
              <Input
                type="date"
                className="mt-1.5"
                min={format(addDays(new Date(start), 1), "yyyy-MM-dd")}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Reason (optional)</Label>
            <Textarea
              className="mt-1.5"
              rows={2}
              placeholder="Trip moved a few days, need different dates…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Your current booking stays active and unchanged until an admin approves this — you'll
            see the outcome here in My Bookings.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Never mind
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || unchanged}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
