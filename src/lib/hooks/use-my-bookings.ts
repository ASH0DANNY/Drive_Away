"use client";

import * as React from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import type { Booking } from "@/lib/bookings";

// A single customer's own history — naturally bounded per person, so a
// live listener here is fine. Still capped defensively.
const MAX_BOOKINGS = 50;

export function useMyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(MAX_BOOKINGS)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking));
        setLoading(false);
      },
      (err) => {
        // Most likely cause if this fires: the composite index for
        // (userId ==, createdAt desc) doesn't exist yet in Firestore.
        // The error Firebase throws includes a direct "create it now" link.
        console.error("Failed to load bookings (check for a missing Firestore index):", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  return { bookings, loading };
}
