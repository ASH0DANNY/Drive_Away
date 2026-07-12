"use client";

import * as React from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllBookings } from "@/lib/hooks/use-all-bookings";
import { updateBookingFields } from "@/lib/bookings-admin";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/bookings";

function paymentBadgeVariant(status: PaymentStatus) {
  if (status === "paid") return "success" as const;
  if (status === "failed") return "destructive" as const;
  return "outline" as const;
}

function BookingActions({ booking }: { booking: Booking }) {
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
    <div className="flex gap-2">
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
                  <TableHead>Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
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
