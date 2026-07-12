"use client";

import * as React from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceActions } from "@/components/site/invoice-actions";
import { useAllBookings } from "@/lib/hooks/use-all-bookings";
import { updateBookingFields } from "@/lib/bookings-admin";
import { markBookingPaidOffline } from "@/lib/bookings";
import type { Booking, BookingStatus, PaymentStatus, DiscountType } from "@/lib/bookings";

function paymentBadgeVariant(status: PaymentStatus) {
  if (status === "paid") return "success" as const;
  if (status === "failed") return "destructive" as const;
  return "outline" as const;
}

function MarkPaidDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [discountType, setDiscountType] = React.useState<Exclude<DiscountType, "coupon">>("none");
  const [discountValue, setDiscountValue] = React.useState(0);
  const [saving, setSaving] = React.useState(false);

  const discountAmount =
    discountType === "percentage"
      ? Math.round((booking.subtotal * discountValue) / 100)
      : discountType === "fixed"
      ? Math.min(discountValue, booking.subtotal)
      : 0;
  const total = booking.subtotal + booking.serviceFee + booking.deposit - discountAmount;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await markBookingPaidOffline(booking, { type: discountType, value: discountValue });
      toast.success("Marked as paid.");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't update — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark {booking.vehicleName} as paid</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Discount at the counter</Label>
            <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as typeof discountType)} className="mt-1.5">
              <TabsList>
                <TabsTrigger value="none">None</TabsTrigger>
                <TabsTrigger value="percentage">Percentage</TabsTrigger>
                <TabsTrigger value="fixed">Fixed (₹)</TabsTrigger>
              </TabsList>
            </Tabs>
            {discountType !== "none" && (
              <Input
                type="number"
                className="mt-2"
                placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 150"}
                value={discountValue || ""}
                onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
              />
            )}
          </div>

          <div className="rounded-lg border border-border p-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Rental + fees + deposit</span>
              <span className="font-mono-num">
                ₹{(booking.subtotal + booking.serviceFee + booking.deposit).toLocaleString("en-IN")}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span className="font-mono-num">−₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold">
              <span>Collect</span>
              <span className="font-mono-num">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Confirm payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BookingActions({ booking }: { booking: Booking }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleStatus = async (value: BookingStatus) => {
    try {
      await updateBookingFields(booking.id, { status: value });
      toast.success("Booking status updated.");
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  const handlePayment = async (value: PaymentStatus) => {
    try {
      await updateBookingFields(booking.id, { paymentStatus: value });
      toast.success("Payment status updated.");
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={booking.status} onValueChange={(v) => handleStatus(v as BookingStatus)}>
        <SelectTrigger className="h-9 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={booking.paymentStatus} onValueChange={(v) => handlePayment(v as PaymentStatus)}>
        <SelectTrigger className="h-9 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {booking.paymentStatus !== "paid" && (
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          <Tag className="size-3.5" /> Mark paid
        </Button>
      )}
      {booking.paymentStatus === "paid" && <InvoiceActions booking={booking} />}

      <MarkPaidDialog booking={booking} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export default function BookingsManagerPage() {
  const { bookings, loading } = useAllBookings();
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">{bookings.length} total bookings.</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No bookings match this filter.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerPhone}
                        {b.bookedByAdmin && " · walk-in"}
                      </p>
                    </TableCell>
                    <TableCell>{b.vehicleName}</TableCell>
                    <TableCell className="font-mono-num text-xs">
                      {format(new Date(b.startDate), "d MMM")} – {format(new Date(b.endDate), "d MMM yyyy")}
                    </TableCell>
                    <TableCell className="font-mono-num">₹{b.total.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={paymentBadgeVariant(b.paymentStatus)} className="capitalize">
                        {b.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <BookingActions booking={b} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
