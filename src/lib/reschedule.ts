import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { computePricing } from "@/lib/pricing";
import type { Booking, RequestedBy } from "@/lib/bookings";

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

/**
 * Only confirmed, online-paid bookings can go through the self-service
 * request flow (case A from the spec) — offline/pay-at-pickup bookings are
 * admin-managed directly (case B), and there can only be one request in
 * flight at a time. Like cancellation, once the rental has started there's
 * nothing left to reschedule.
 */
export function isRescheduleRequestable(booking: Booking): boolean {
  if (booking.status !== "confirmed") return false;
  if (booking.paymentStatus !== "paid") return false;
  if (booking.paymentMethod === "offline" || booking.paymentMethod === null) return false;
  if (booking.rescheduleStatus === "pending") return false;
  const today = new Date().toISOString().slice(0, 10);
  return booking.startDate >= today;
}

/** Customer requests new dates for an online-paid booking — admin must approve it. */
export async function requestReschedule(
  booking: Booking,
  newStart: string,
  newEnd: string,
  reason: string
): Promise<void> {
  await updateDoc(doc(db, "bookings", booking.id), {
    rescheduleStatus: "pending",
    rescheduleRequestedStartDate: newStart,
    rescheduleRequestedEndDate: newEnd,
    rescheduleReason: reason,
    rescheduleRequestedBy: "customer" as RequestedBy,
    rescheduleRequestedAt: serverTimestamp(),
  });
}

/** Customer (or admin) withdraws a still-pending request without deciding it. */
export async function withdrawReschedule(bookingId: string): Promise<void> {
  await updateDoc(doc(db, "bookings", bookingId), {
    rescheduleStatus: "none",
    rescheduleRequestedStartDate: null,
    rescheduleRequestedEndDate: null,
    rescheduleReason: null,
    rescheduleRequestedBy: null,
    rescheduleRequestedAt: null,
  });
}

/**
 * Admin approves a pending request: applies the new dates to the booking
 * and recalculates pricing (days/subtotal/service fee/total) for the new
 * range. The discount amount and deposit are carried over unchanged.
 */
export async function approveReschedule(booking: Booking, note?: string): Promise<void> {
  const newStart = booking.rescheduleRequestedStartDate ?? booking.startDate;
  const newEnd = booking.rescheduleRequestedEndDate ?? booking.endDate;
  const days = daysBetween(newStart, newEnd);
  const { subtotal, serviceFee } = computePricing(booking.pricePerDay, days);
  const total = subtotal - booking.discountAmount + serviceFee + booking.deposit;

  await updateDoc(doc(db, "bookings", booking.id), {
    startDate: newStart,
    endDate: newEnd,
    days,
    subtotal,
    serviceFee,
    total,
    rescheduleStatus: "approved",
    rescheduleReviewedAt: serverTimestamp(),
    rescheduleReviewNote: note ?? null,
  });
}

export async function rejectReschedule(bookingId: string, note?: string): Promise<void> {
  await updateDoc(doc(db, "bookings", bookingId), {
    rescheduleStatus: "rejected",
    rescheduleReviewedAt: serverTimestamp(),
    rescheduleReviewNote: note ?? null,
  });
}

/**
 * Admin directly changes a booking's dates with no approval step — the
 * offline-management path. Also recalculates pricing for the new range.
 */
export async function adminEditDates(booking: Booking, newStart: string, newEnd: string): Promise<void> {
  const days = daysBetween(newStart, newEnd);
  const { subtotal, serviceFee } = computePricing(booking.pricePerDay, days);
  const total = subtotal - booking.discountAmount + serviceFee + booking.deposit;

  await updateDoc(doc(db, "bookings", booking.id), {
    startDate: newStart,
    endDate: newEnd,
    days,
    subtotal,
    serviceFee,
    total,
    rescheduleStatus: "none",
    rescheduleRequestedStartDate: null,
    rescheduleRequestedEndDate: null,
    rescheduleReason: null,
    rescheduleRequestedBy: null,
    rescheduleRequestedAt: null,
    rescheduleReviewedAt: serverTimestamp(),
    rescheduleReviewNote: "Dates updated directly by admin.",
  });
}
