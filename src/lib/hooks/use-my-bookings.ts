"use client";

import * as React from "react";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import type { Booking } from "@/lib/bookings";

// A single customer's own history — naturally bounded per person, so a
// live listener here is fine. Still capped defensively.
const MAX_BOOKINGS = 50;

// No orderBy in the query on purpose: combining it with the where() below
// needs a Firestore composite index, and orderBy() also silently drops any
// document missing that field entirely (e.g. a serverTimestamp() that
// hadn't resolved yet when read). Sorting the small, already-fetched list
// client-side sidesteps both problems.
function toMillis(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    try {
      return (value as { toMillis: () => number }).toMillis();
    } catch {
      return 0;
    }
  }
  return 0;
}

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
    const q = query(collection(db, "bookings"), where("userId", "==", user.uid), limit(MAX_BOOKINGS));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
        docs.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        setBookings(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load bookings:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  return { bookings, loading };
}
