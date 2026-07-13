"use client";

import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultVehicles, type Vehicle } from "@/lib/default-content";

export function useVehicle(id: string) {
  const fallback = defaultVehicles.find((v) => v.id === id) ?? null;
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(fallback);
  const [loading, setLoading] = React.useState(!fallback);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    const ref = doc(db, "vehicles", id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setVehicle({ id: snap.id, ...snap.data() } as Vehicle);
          setNotFound(false);
        } else if (!fallback) {
          setNotFound(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load vehicle:", err);
        setLoading(false);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { vehicle, loading, notFound };
}
