"use client";

import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSiteConfig, type SiteConfig } from "@/lib/default-content";
import { applyThemeVars, THEME_CACHE_KEY } from "@/lib/theme-utils";

type SiteConfigContextValue = {
  config: SiteConfig;
  isLive: boolean; // true once real Firestore data has arrived at least once
};

const SiteConfigContext = React.createContext<SiteConfigContextValue>({
  config: defaultSiteConfig,
  isLive: false,
});

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  // Start from the hardcoded defaults — matches server-rendered HTML exactly,
  // so there is no hydration mismatch and the page is never blank/unstyled.
  const [config, setConfig] = React.useState<SiteConfig>(defaultSiteConfig);
  const [isLive, setIsLive] = React.useState(false);

  // 1) Instantly upgrade from localStorage cache (near-zero delay, no network wait).
  React.useEffect(() => {
    try {
      const cached = localStorage.getItem(THEME_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SiteConfig;
        setConfig(parsed);
        applyThemeVars(parsed.theme);
      }
    } catch {
      // corrupted cache — ignore, defaults already rendered
    }
  }, []);

  // 2) Subscribe to the live Firestore doc; silently replace + re-cache on change.
  React.useEffect(() => {
    const ref = doc(db, "siteConfig", "main");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteConfig;
          setConfig(data);
          applyThemeVars(data.theme);
          setIsLive(true);
          try {
            localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(data));
          } catch {
            // storage full/unavailable — non-fatal
          }
        }
      },
      () => {
        // Firestore unreachable / doc missing — defaults already rendered, no-op.
      }
    );
    return () => unsub();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, isLive }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return React.useContext(SiteConfigContext);
}
