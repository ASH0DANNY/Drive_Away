"use client";

import * as React from "react";
import { fetchOverviewStats, type OverviewStats } from "@/lib/admin-stats";

export function useOverviewStats() {
  const [stats, setStats] = React.useState<OverviewStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setStats(await fetchOverviewStats());
    } catch (err) {
      console.error("Failed to load overview stats:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, refresh: load };
}
