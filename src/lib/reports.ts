import { collection, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking, BookingStatus } from "@/lib/bookings";

const MAX_REPORT_BOOKINGS = 1000;

export type DailyPoint = { date: string; revenue: number; bookings: number };
export type VehicleBreakdown = { vehicleName: string; bookings: number; revenue: number };
export type CouponBreakdown = { code: string; uses: number; totalDiscount: number };

export type ReportData = {
  rangeStart: string;
  rangeEnd: string;
  totalBookings: number;
  statusBreakdown: Record<BookingStatus, number>;
  totalRevenue: number;
  onlineRevenue: number;
  offlineRevenue: number;
  carRevenue: number;
  bikeRevenue: number;
  paidBookingsCount: number;
  avgBookingValue: number;
  avgRentalDays: number;
  cancellationCount: number;
  cancellationRate: number;
  totalCancellationCharges: number;
  totalRefundsPending: number;
  totalRefundsIssued: number;
  totalDiscountGiven: number;
  couponUsage: CouponBreakdown[];
  topVehicles: VehicleBreakdown[];
  dailyRevenue: DailyPoint[];
  bookings: Booking[];
};

/**
 * Single range filter on createdAt with orderBy on that same field — this
 * needs no composite index. Bounded at 1000 bookings, which comfortably
 * covers a realistic reporting window for a rental fleet; everything past
 * fetch is computed client-side (Firestore has no native group-by).
 */
export async function fetchReportData(start: Date, end: Date): Promise<ReportData> {
  const snap = await getDocs(
    query(
      collection(db, "bookings"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "asc"),
      limit(MAX_REPORT_BOOKINGS)
    )
  );
  const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);

  const statusBreakdown: Record<BookingStatus, number> = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const b of bookings) statusBreakdown[b.status]++;

  const paid = bookings.filter((b) => b.paymentStatus === "paid");
  const totalRevenue = paid.reduce((sum, b) => sum + b.total, 0);
  const onlineRevenue = paid
    .filter((b) => b.paymentMethod && b.paymentMethod !== "offline")
    .reduce((sum, b) => sum + b.total, 0);
  const offlineRevenue = paid.filter((b) => b.paymentMethod === "offline").reduce((sum, b) => sum + b.total, 0);
  const carRevenue = paid.filter((b) => b.vehicleType === "car").reduce((sum, b) => sum + b.total, 0);
  const bikeRevenue = paid.filter((b) => b.vehicleType === "bike").reduce((sum, b) => sum + b.total, 0);
  const totalDiscountGiven = paid.reduce((sum, b) => sum + b.discountAmount, 0);

  const cancellations = bookings.filter((b) => b.status === "cancelled");
  const totalCancellationCharges = cancellations.reduce((sum, b) => sum + b.cancellationCharge, 0);
  const totalRefundsPending = bookings
    .filter((b) => b.refundStatus === "pending")
    .reduce((sum, b) => sum + b.refundAmount, 0);
  const totalRefundsIssued = bookings
    .filter((b) => b.refundStatus === "refunded")
    .reduce((sum, b) => sum + b.refundAmount, 0);

  const couponMap = new Map<string, CouponBreakdown>();
  for (const b of bookings) {
    if (!b.couponCode) continue;
    const entry = couponMap.get(b.couponCode) ?? { code: b.couponCode, uses: 0, totalDiscount: 0 };
    entry.uses += 1;
    entry.totalDiscount += b.discountAmount;
    couponMap.set(b.couponCode, entry);
  }

  const vehicleMap = new Map<string, VehicleBreakdown>();
  for (const b of paid) {
    const entry = vehicleMap.get(b.vehicleId) ?? { vehicleName: b.vehicleName, bookings: 0, revenue: 0 };
    entry.bookings += 1;
    entry.revenue += b.total;
    vehicleMap.set(b.vehicleId, entry);
  }
  const topVehicles = Array.from(vehicleMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const dailyMap = new Map<string, DailyPoint>();
  for (const b of paid) {
    const dateKey = toDateKey(b.createdAt) ?? b.startDate;
    const entry = dailyMap.get(dateKey) ?? { date: dateKey, revenue: 0, bookings: 0 };
    entry.revenue += b.total;
    entry.bookings += 1;
    dailyMap.set(dateKey, entry);
  }
  const dailyRevenue = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    rangeStart: start.toISOString().slice(0, 10),
    rangeEnd: end.toISOString().slice(0, 10),
    totalBookings: bookings.length,
    statusBreakdown,
    totalRevenue,
    onlineRevenue,
    offlineRevenue,
    carRevenue,
    bikeRevenue,
    paidBookingsCount: paid.length,
    avgBookingValue: paid.length ? Math.round(totalRevenue / paid.length) : 0,
    avgRentalDays: bookings.length ? Math.round((bookings.reduce((s, b) => s + b.days, 0) / bookings.length) * 10) / 10 : 0,
    cancellationCount: cancellations.length,
    cancellationRate: bookings.length ? Math.round((cancellations.length / bookings.length) * 1000) / 10 : 0,
    totalCancellationCharges,
    totalRefundsPending,
    totalRefundsIssued,
    totalDiscountGiven,
    couponUsage: Array.from(couponMap.values()).sort((a, b) => b.uses - a.uses),
    topVehicles,
    dailyRevenue,
    bookings,
  };
}

function toDateKey(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
    } catch {
      return null;
    }
  }
  return null;
}
