import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/lib/default-content";

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "card" | "upi" | "wallet";

export type Booking = {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: Vehicle["type"];
  vehicleImage: string | null;
  pricePerDay: number;
  startDate: string; // yyyy-MM-dd
  endDate: string;
  days: number;
  subtotal: number;
  serviceFee: number;
  deposit: number;
  total: number;
  customerName: string;
  customerPhone: string;
  licenseNumber: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt?: unknown;
};

export type NewBookingInput = Omit<Booking, "id" | "status" | "paymentStatus" | "createdAt">;

export async function createBooking(input: NewBookingInput): Promise<string> {
  const ref = await addDoc(collection(db, "bookings"), {
    ...input,
    status: "pending" as BookingStatus,
    paymentStatus: "pending" as PaymentStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function recordPaymentResult(
  bookingId: string,
  method: PaymentMethod,
  amount: number,
  outcome: "success" | "failed"
): Promise<string> {
  const paymentRef = await addDoc(collection(db, "payments"), {
    bookingId,
    method,
    amount,
    status: outcome,
    mockTransactionId: `DA-${Date.now().toString(36).toUpperCase()}`,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "bookings", bookingId), {
    paymentStatus: outcome === "success" ? "paid" : "failed",
    status: outcome === "success" ? "confirmed" : "pending",
  });

  return paymentRef.id;
}
