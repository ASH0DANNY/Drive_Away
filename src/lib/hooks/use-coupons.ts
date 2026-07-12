"use client";

import * as React from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Coupon } from "@/lib/coupons";

export function useCoupons() {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, "coupons"), orderBy("code", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Coupon));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return { coupons, loading };
}
