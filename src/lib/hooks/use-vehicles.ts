"use client";

import * as React from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultVehicles, type Vehicle } from "@/lib/default-content";

export function useVehicles(max?: number) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(
    max ? defaultVehicles.slice(0, max) : defaultVehicles
  );
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    const q = max
      ? query(collection(db, "vehicles"), limit(max))
      : collection(db, "vehicles");

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
      () => {
        // offline / rules issue — bundled sample fleet stays visible.
      }
    );
    return () => unsub();
  }, [max]);

  return { vehicles, isLive };
}
