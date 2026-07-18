"use client";

import * as React from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { where } from "firebase/firestore";
import { Loader2, Tag, RefreshCw, Ban, BadgeIndianRupee, CalendarClock, PackageCheck, TriangleAlert } from "lucide-react";
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
import { CancelBookingDialog } from "@/components/site/cancel-booking-dialog";
import { RescheduleReviewDialog } from "@/components/admin/reschedule-review-dialog";
import { EditDatesDialog } from "@/components/admin/edit-dates-dialog";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { updateBookingFields } from "@/lib/bookings-admin";
import { markBookingPaidOffline, markRefunded, markReturned, isOverdue } from "@/lib/bookings";
import { isCancellable } from "@/lib/cancellation";
import type { Booking, BookingStatus, PaymentStatus, DiscountType } from "@/lib/bookings";

function paymentBadgeVariant(status: PaymentStatus) {
  if (status === "paid") return "success" as const;
  if (status === "failed") return "destructive" as const;
  return "outline" as const;
}

function refundBadgeVariant(status: Booking["refundStatus"]) {
  if (status === "refunded") return "success" as const;
  if (status === "pending") return "destructive" as const;
  return "outline" as const;
}

function MarkPaidDialog({
  booking,
  open,
  onOpenChange,
  onChanged,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChanged: () => void;
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
      onChanged();
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

function DatesCell({ booking }: { booking: Booking }) {
  const overdue = isOverdue(booking);
  return (
    <div>
      <p className={`font-mono-num text-xs ${overdue ? "text-destructive font-medium" : ""}`}>
        {format(new Date(booking.startDate), "d MMM")} – {format(new Date(booking.endDate), "d MMM yyyy")}
      </p>
      {overdue && (
        <span className="mt-1 flex items-center gap-1 text-xs text-destructive">
          <TriangleAlert className="size-3" /> Not returned
        </span>
      )}
      {booking.rescheduleStatus === "pending" && (
        <span className="mt-1 flex items-center gap-1 text-xs text-primary">
          <CalendarClock className="size-3" /> Reschedule requested
        </span>
      )}
    </div>
  );
}

function BookingActions({ booking, onChanged }: { booking: Booking; onChanged: () => void }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [editDatesOpen, setEditDatesOpen] = React.useState(false);
  const [refunding, setRefunding] = React.useState(false);
  const [returning, setReturning] = React.useState(false);

  const handleStatus = async (value: BookingStatus) => {
    try {
      await updateBookingFields(booking.id, { status: value });
      toast.success("Booking status updated.");
      onChanged();
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  const handlePayment = async (value: PaymentStatus) => {
    try {
      await updateBookingFields(booking.id, { paymentStatus: value });
      toast.success("Payment status updated.");
      onChanged();
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  const handleMarkRefunded = async () => {
    setRefunding(true);
    try {
      await markRefunded(booking.id);
      toast.success("Marked as refunded.");
      onChanged();
    } catch {
      toast.error("Couldn't update — try again.");
    } finally {
      setRefunding(false);
    }
  };

  const handleMarkReturned = async () => {
    setReturning(true);
    try {
      await markReturned(booking.id);
      toast.success("Marked as returned.");
      onChanged();
    } catch {
      toast.error("Couldn't update — try again.");
    } finally {
      setReturning(false);
    }
  };

  const isClosed = booking.status === "completed";

  if (isClosed) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Completed — no further action</span>
        {booking.paymentStatus === "paid" && <InvoiceActions booking={booking} />}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={booking.status} onValueChange={(v) => handleStatus(v as BookingStatus)}>
        <SelectTrigger className="h-9 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
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

      {booking.rescheduleStatus === "pending" ? (
        <Button size="sm" onClick={() => setRescheduleOpen(true)}>
          <CalendarClock className="size-3.5" /> Review request
        </Button>
      ) : (
        booking.status !== "cancelled" && (
          <Button size="sm" variant="outline" onClick={() => setEditDatesOpen(true)}>
            <CalendarClock className="size-3.5" /> Edit dates
          </Button>
        )
      )}

      {booking.status === "confirmed" && (
        <Button size="sm" variant="outline" onClick={handleMarkReturned} disabled={returning}>
          {returning ? <Loader2 className="size-3.5 animate-spin" /> : <PackageCheck className="size-3.5" />}
          Mark returned
        </Button>
      )}

      {isCancellable(booking) && (
        <Button size="sm" variant="outline" onClick={() => setCancelOpen(true)}>
          <Ban className="size-3.5" /> Cancel
        </Button>
      )}

      {booking.refundStatus === "pending" && (
        <Button size="sm" variant="outline" onClick={handleMarkRefunded} disabled={refunding}>
          {refunding ? <Loader2 className="size-3.5 animate-spin" /> : <BadgeIndianRupee className="size-3.5" />}
          Mark refunded
        </Button>
      )}

      <MarkPaidDialog booking={booking} open={dialogOpen} onOpenChange={setDialogOpen} onChanged={onChanged} />
      <CancelBookingDialog
        booking={booking}
        cancelledBy="admin"
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onCancelled={onChanged}
      />
      <RescheduleReviewDialog
        booking={booking}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onDecided={onChanged}
      />
      <EditDatesDialog booking={booking} open={editDatesOpen} onOpenChange={setEditDatesOpen} onSaved={onChanged} />
    </div>
  );
}

export default function BookingsManagerPage() {
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all");

  const {
    items: bookings,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedQuery<Booking>(
    "bookings",
    filter === "all" ? [] : [where("status", "==", filter)],
    "createdAt",
    { pageSize: 20, resetKey: filter }
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing the most recent {bookings.length}
            {hasMore ? "+" : ""} — load more below, or filter by status.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refresh} aria-label="Refresh">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : bookings.length === 0 ? (
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
                  <TableHead>Refund</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id} className={b.status === "completed" ? "opacity-60" : undefined}>
                    <TableCell>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerPhone}
                        {b.bookedByAdmin && " · walk-in"}
                      </p>
                    </TableCell>
                    <TableCell>{b.vehicleName}</TableCell>
                    <TableCell>
                      <DatesCell booking={b} />
                    </TableCell>
                    <TableCell className="font-mono-num">
                      ₹{b.total.toLocaleString("en-IN")}
                      {b.couponCode && (
                        <p className="mt-0.5 flex items-center gap-1 font-sans text-xs font-normal text-success">
                          <Tag className="size-3" /> {b.couponCode}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={paymentBadgeVariant(b.paymentStatus)} className="capitalize">
                        {b.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {b.refundStatus !== "not_applicable" && (
                        <Badge variant={refundBadgeVariant(b.refundStatus)} className="capitalize">
                          {b.refundStatus === "pending"
                            ? `₹${b.refundAmount.toLocaleString("en-IN")} due`
                            : "Refunded"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <BookingActions booking={b} onChanged={refresh} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {hasMore && !loading && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore && <Loader2 className="size-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
