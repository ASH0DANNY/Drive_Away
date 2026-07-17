"use client";

import * as React from "react";
import { fetchReportData, type ReportData } from "@/lib/reports";

export function useReportData(start: Date, end: Date) {
  const [data, setData] = React.useState<ReportData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const startKey = start.toISOString().slice(0, 10);
  const endKey = end.toISOString().slice(0, 10);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await fetchReportData(start, end));
    } catch (err) {
      console.error("Failed to load report data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey, endKey]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
