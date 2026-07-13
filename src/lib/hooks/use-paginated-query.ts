"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * One-time (not onSnapshot) paginated collection reader.
 *
 * Why not onSnapshot here: a live listener re-bills reads on every document
 * change for as long as it's mounted, and re-reads its full page on every
 * remount. For admin lists that can grow without bound (bookings, users),
 * that cost scales with collection size and with how often the page is
 * opened. A bounded page + explicit refresh keeps the cost constant
 * regardless of how large the collection gets.
 */
export function usePaginatedQuery<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  orderField: string,
  options?: {
    orderDirection?: "asc" | "desc";
    pageSize?: number;
    resetKey?: string | number;
  }
) {
  const pageSize = options?.pageSize ?? 20;
  const orderDirection = options?.orderDirection ?? "desc";
  const resetKey = options?.resetKey ?? "static";

  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [error, setError] = React.useState(false);
  const cursorRef = React.useRef<QueryDocumentSnapshot | null>(null);

  const constraintsKey = constraints.map((c) => JSON.stringify(c)).join("|");

  const runFetch = React.useCallback(
    async (mode: "reset" | "more") => {
      mode === "reset" ? setLoading(true) : setLoadingMore(true);
      setError(false);
      try {
        const base = query(
          collection(db, collectionName),
          ...constraints,
          orderBy(orderField, orderDirection),
          limit(pageSize)
        );
        const q = mode === "more" && cursorRef.current ? query(base, startAfter(cursorRef.current)) : base;
        const snap = await getDocs(q);
        const docs = snap.docs;
        cursorRef.current = docs.length ? docs[docs.length - 1] : cursorRef.current;
        setHasMore(docs.length === pageSize);
        const mapped = docs.map((d) => ({ id: d.id, ...d.data() }) as T);
        setItems((prev) => (mode === "reset" ? mapped : [...prev, ...mapped]));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collectionName, orderField, orderDirection, pageSize, constraintsKey]
  );

  React.useEffect(() => {
    cursorRef.current = null;
    runFetch("reset");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, collectionName, orderField, orderDirection, pageSize, constraintsKey]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore: () => runFetch("more"),
    refresh: () => {
      cursorRef.current = null;
      runFetch("reset");
    },
  };
}
