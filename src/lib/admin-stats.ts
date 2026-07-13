import { collection, getAggregateFromServer, getCountFromServer, query, sum, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type OverviewStats = {
  vehicleCount: number;
  confirmedBookings: number;
  pendingPayments: number;
  revenue: number;
};

/**
 * Each call below is a single aggregation query — Firestore computes the
 * count/sum server-side and returns one result, rather than billing a read
 * per matching document the way fetching-and-summing client-side would.
 * Cost stays flat no matter how many bookings/vehicles exist.
 */
export async function fetchOverviewStats(): Promise<OverviewStats> {
  const [vehicleCountSnap, confirmedSnap, pendingSnap, revenueSnap] = await Promise.all([
    getCountFromServer(collection(db, "vehicles")),
    getCountFromServer(query(collection(db, "bookings"), where("status", "==", "confirmed"))),
    getCountFromServer(query(collection(db, "bookings"), where("paymentStatus", "==", "pending"))),
    getAggregateFromServer(query(collection(db, "bookings"), where("paymentStatus", "==", "paid")), {
      revenue: sum("total"),
    }),
  ]);

  return {
    vehicleCount: vehicleCountSnap.data().count,
    confirmedBookings: confirmedSnap.data().count,
    pendingPayments: pendingSnap.data().count,
    revenue: revenueSnap.data().revenue ?? 0,
  };
}
