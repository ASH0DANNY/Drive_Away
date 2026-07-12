import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BookingStatus, PaymentStatus } from "@/lib/bookings";

export async function updateBookingFields(
  id: string,
  fields: Partial<{ status: BookingStatus; paymentStatus: PaymentStatus }>
): Promise<void> {
  await updateDoc(doc(db, "bookings", id), fields);
}
