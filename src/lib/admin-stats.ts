import { collection, getAggregateFromServer, getCountFromServer, query, sum, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type OverviewStats = {
  vehicleCount: number;
  confirmedBookings: number;
  pendingPayments: number;
  revenue: number;
  overdueReturns: number;
};

/**
 * Each call below is a single aggregation query — Firestore computes the
 * count/sum server-side and returns one result, rather than billing a read
 * per matching document the way fetching-and-summing client-side would.
 * Cost stays flat no matter how many bookings/vehicles exist.
 */
export async function fetchOverviewStats(): Promise<OverviewStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [vehicleCountSnap, confirmedSnap, pendingSnap, revenueSnap, overdueSnap] = await Promise.all([
    getCountFromServer(collection(db, "vehicles")),
    getCountFromServer(query(collection(db, "bookings"), where("status", "==", "confirmed"))),
    getCountFromServer(query(collection(db, "bookings"), where("paymentStatus", "==", "pending"))),
    getAggregateFromServer(query(collection(db, "bookings"), where("paymentStatus", "==", "paid")), {
      revenue: sum("total"),
    }),
    getCountFromServer(
      query(collection(db, "bookings"), where("status", "==", "confirmed"), where("endDate", "<", today))
    ),
  ]);

  return {
    vehicleCount: vehicleCountSnap.data().count,
    confirmedBookings: confirmedSnap.data().count,
    pendingPayments: pendingSnap.data().count,
    revenue: revenueSnap.data().revenue ?? 0,
    overdueReturns: overdueSnap.data().count,
  };
}
