import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking } from "@/lib/bookings";

export function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && aEnd >= bStart;
}

/**
 * Finds other CONFIRMED bookings for the same vehicle whose dates overlap
 * the given range. Used before approving a reschedule request or applying
 * a direct admin date edit, so a vehicle never ends up double-booked.
 *
 * Only two equality filters are used (vehicleId, status) — Firestore
 * handles that without needing a composite index. The overlap check itself
 * runs client-side, which is fine since a single vehicle's confirmed
 * booking count is naturally small and bounded.
 */
export async function findClashingBookings(
  vehicleId: string,
  startDate: string,
  endDate: string,
  excludeBookingId?: string
): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, "bookings"), where("vehicleId", "==", vehicleId), where("status", "==", "confirmed"))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Booking)
    .filter((b) => b.id !== excludeBookingId && datesOverlap(b.startDate, b.endDate, startDate, endDate));
}
