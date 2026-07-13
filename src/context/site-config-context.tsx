"use client";

import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSiteConfig, type SiteConfig } from "@/lib/default-content";
import { applyThemeVars, THEME_CACHE_KEY } from "@/lib/theme-utils";
import { mergeWithDefaults } from "@/lib/merge-config";

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
        const parsed = mergeWithDefaults(defaultSiteConfig, JSON.parse(cached));
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
          const data = mergeWithDefaults(defaultSiteConfig, snap.data());
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
      (err) => {
        // Firestore unreachable / doc missing — defaults already rendered.
        console.error("Failed to load siteConfig (defaults are still shown):", err);
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
