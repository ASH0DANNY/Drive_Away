import type { Booking } from "@/lib/bookings";
import type { SiteConfig } from "@/lib/default-content";

export type CancellationPreview = {
  isOnlinePaid: boolean;
  chargeAmount: number;
  refundAmount: number;
  refundStatus: "not_applicable" | "pending";
};

/**
 * A booking can be cancelled if it's still active (not already cancelled),
 * and its pickup date hasn't passed yet — once the rental has started,
 * cancellation no longer makes sense.
 */
export function isCancellable(booking: Booking): boolean {
  if (booking.status === "cancelled") return false;
  const today = new Date().toISOString().slice(0, 10);
  return booking.startDate >= today;
}

/**
 * Computes what cancelling `booking` right now would charge/refund, given
 * the admin's configured cancellation charge.
 *
 * Rule: the charge only ever applies to bookings paid through the online
 * gateway (card/UPI/wallet + paymentStatus "paid"). Offline/pay-at-pickup
 * bookings, and bookings that were never paid at all, are cancelled free.
 * The charge is taken from the rental cost only — the refundable deposit
 * always flows through untouched.
 */
export function computeCancellation(
  booking: Booking,
  settings: SiteConfig["settings"]
): CancellationPreview {
  const isPaid = booking.paymentStatus === "paid";
  const isOnlinePaid = isPaid && booking.paymentMethod !== "offline" && booking.paymentMethod !== null;
  const isOfflinePaid = isPaid && booking.paymentMethod === "offline";

  if (!isPaid) {
    return { isOnlinePaid: false, chargeAmount: 0, refundAmount: 0, refundStatus: "not_applicable" };
  }

  const rentalPortion = Math.max(0, booking.subtotal - booking.discountAmount + booking.serviceFee);

  let chargeAmount = 0;
  if (isOnlinePaid) {
    chargeAmount =
      settings.cancellationChargeType === "percentage"
        ? Math.round((rentalPortion * settings.cancellationChargeValue) / 100)
        : Math.min(settings.cancellationChargeValue, rentalPortion);
  }

  const refundAmount = booking.total - chargeAmount;

  return {
    isOnlinePaid,
    chargeAmount,
    refundAmount,
    refundStatus: isOnlinePaid || isOfflinePaid ? "pending" : "not_applicable",
  };
}
