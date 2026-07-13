"use client";

import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking } from "@/lib/bookings";

export function useBooking(id: string | undefined) {
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "bookings", id),
      (snap) => {
        setBooking(snap.exists() ? ({ id: snap.id, ...snap.data() } as Booking) : null);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load booking:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [id]);

  return { booking, loading };
}
