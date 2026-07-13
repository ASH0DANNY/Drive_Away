"use client";

import * as React from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultVehicles, type Vehicle } from "@/lib/default-content";

// Safety cap for the unfiltered case (e.g. the public /fleet page's
// client-side filtering, which needs the working set in memory). A real
// rental fleet is very unlikely to exceed this; if it ever does, swap
// the /fleet page's client-side filtering for server-side filtered
// queries instead of raising this number.
const DEFAULT_CAP = 300;

export function useVehicles(max?: number) {
  const cappedMax = max ?? DEFAULT_CAP;
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(
    max ? defaultVehicles.slice(0, max) : defaultVehicles
  );
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, "vehicles"), limit(cappedMax));

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Vehicle);
          setVehicles(data);
          setIsLive(true);
        }
        // if the live collection is genuinely empty (fresh project, no
        // vehicles added yet in admin), keep showing the sample fleet
        // rather than an empty grid.
      },
      (err) => {
        console.error("Failed to load vehicles — showing sample fleet instead:", err);
      }
    );
    return () => unsub();
  }, [cappedMax]);

  return { vehicles, isLive };
}
