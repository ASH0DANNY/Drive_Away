import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Vehicle } from "@/lib/default-content";

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "card" | "upi" | "wallet" | "offline";
export type DiscountType = "none" | "percentage" | "fixed" | "coupon";

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
  discountType: DiscountType;
  discountValue: number; // percentage number or fixed rupee amount, 0 if none
  discountAmount: number; // resolved rupee amount actually discounted
  couponCode: string | null;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  licenseNumber: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  transactionId: string | null;
  invoiceNumber: string;
  bookedByAdmin: boolean;
  createdAt?: unknown;
};

export type NewBookingInput = Omit<
  Booking,
  | "id"
  | "status"
  | "paymentStatus"
  | "createdAt"
  | "paymentMethod"
  | "transactionId"
  | "invoiceNumber"
  | "bookedByAdmin"
>;

function generateInvoiceNumber(): string {
  return `INV-${Date.now().toString(36).toUpperCase()}`;
}

/** Sentinel userId for admin-created walk-in bookings — never a real Firebase uid. */
export const WALKIN_USER_ID = "walk-in";

export async function isFirstBooking(userId: string): Promise<boolean> {
  const snap = await getDocs(
    query(collection(db, "bookings"), where("userId", "==", userId), limit(1))
  );
  return snap.empty;
}

export async function createBooking(input: NewBookingInput): Promise<string> {
  const ref = await addDoc(collection(db, "bookings"), {
    ...input,
    status: "pending" as BookingStatus,
    paymentStatus: "pending" as PaymentStatus,
    paymentMethod: null,
    transactionId: null,
    invoiceNumber: generateInvoiceNumber(),
    bookedByAdmin: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Admin-created walk-in booking, confirmed and paid offline immediately. */
export async function createOfflineBooking(
  input: NewBookingInput
): Promise<string> {
  const transactionId = `DA-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
  const ref = await addDoc(collection(db, "bookings"), {
    ...input,
    status: "confirmed" as BookingStatus,
    paymentStatus: "paid" as PaymentStatus,
    paymentMethod: "offline" as PaymentMethod,
    transactionId,
    invoiceNumber: generateInvoiceNumber(),
    bookedByAdmin: true,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "payments"), {
    bookingId: ref.id,
    method: "offline",
    amount: input.total,
    status: "success",
    mockTransactionId: transactionId,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Marks an existing (usually pending) booking as paid in person, optionally applying a discount at the counter. */
export async function markBookingPaidOffline(
  booking: Booking,
  discount: { type: DiscountType; value: number }
): Promise<void> {
  const preDiscountTotal = booking.subtotal + booking.serviceFee + booking.deposit;
  const discountAmount =
    discount.type === "percentage"
      ? Math.round((booking.subtotal * discount.value) / 100)
      : discount.type === "fixed"
      ? Math.min(discount.value, booking.subtotal)
      : 0;
  const total = preDiscountTotal - discountAmount;
  const transactionId = `DA-OFFLINE-${Date.now().toString(36).toUpperCase()}`;

  await updateDoc(doc(db, "bookings", booking.id), {
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "offline",
    discountType: discount.type,
    discountValue: discount.value,
    discountAmount,
    total,
    transactionId,
  });

  await addDoc(collection(db, "payments"), {
    bookingId: booking.id,
    method: "offline",
    amount: total,
    status: "success",
    mockTransactionId: transactionId,
    createdAt: serverTimestamp(),
  });
}

export async function recordPaymentResult(
  bookingId: string,
  method: PaymentMethod,
  amount: number,
  outcome: "success" | "failed"
): Promise<string> {
  const transactionId = `DA-${Date.now().toString(36).toUpperCase()}`;
  const paymentRef = await addDoc(collection(db, "payments"), {
    bookingId,
    method,
    amount,
    status: outcome,
    mockTransactionId: transactionId,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "bookings", bookingId), {
    paymentStatus: outcome === "success" ? "paid" : "failed",
    status: outcome === "success" ? "confirmed" : "pending",
    paymentMethod: method,
    transactionId: outcome === "success" ? transactionId : null,
  });

  return paymentRef.id;
}
