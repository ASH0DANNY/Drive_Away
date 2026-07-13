import type { ThemeConfig } from "./default-content";
import { defaultTheme } from "./default-content";

const FONT_STACKS: Record<ThemeConfig["fontDisplay"], string> = {
  "space-grotesk": "var(--font-space-grotesk), sans-serif",
  sora: "var(--font-sora), sans-serif",
  manrope: "var(--font-manrope), sans-serif",
};

const BODY_FONT_STACKS: Record<ThemeConfig["fontBody"], string> = {
  inter: "var(--font-inter), sans-serif",
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/** Picks black or white text for readable contrast against a given hex background. */
export function readableForeground(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#14161A";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // relative luminance (WCAG approximation)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#14161A" : "#FFFFFF";
}

/** Applies theme tokens as CSS custom properties on <html>. Runs on the client only. */
export function applyThemeVars(theme: Partial<ThemeConfig> | null | undefined) {
  if (typeof document === "undefined") return;
  const merged: ThemeConfig = { ...defaultTheme, ...(theme ?? {}) };
  const root = document.documentElement;
  root.style.setProperty("--da-primary", merged.primary);
  root.style.setProperty(
    "--da-primary-foreground",
    merged.primaryForeground || readableForeground(merged.primary)
  );
  root.style.setProperty("--da-secondary", merged.secondary);
  root.style.setProperty(
    "--da-secondary-foreground",
    merged.secondaryForeground || readableForeground(merged.secondary)
  );
  root.style.setProperty("--da-radius", `${merged.radius}rem`);
  root.style.setProperty("--da-font-display", FONT_STACKS[merged.fontDisplay]);
  root.style.setProperty("--da-font-body", BODY_FONT_STACKS[merged.fontBody]);
  root.setAttribute("data-contrast", merged.contrast === "high" ? "high" : "default");
}

export const THEME_CACHE_KEY = "da-site-config-cache";
