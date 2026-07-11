import type { Metadata } from "next";
import { Space_Grotesk, Sora, Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteConfigProvider } from "@/context/site-config-context";
import { AuthProvider } from "@/context/auth-context";
import { THEME_CACHE_KEY } from "@/lib/theme-utils";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drive Away — Self-drive car & bike rentals",
  description:
    "Drive Away puts a verified fleet of cars and bikes on your route in minutes — transparent pricing, no counter queues.",
};

// Runs before React hydrates: reapplies the last-known admin theme (colors,
// radius, contrast) from localStorage so returning visitors never see a
// flash of the default palette before their custom theme loads.
const NO_FLASH_SCRIPT = `
(function() {
  try {
    var cached = localStorage.getItem(${JSON.stringify(THEME_CACHE_KEY)});
    if (!cached) return;
    var cfg = JSON.parse(cached);
    var t = cfg && cfg.theme;
    if (!t) return;
    var root = document.documentElement;
    if (t.primary) root.style.setProperty('--da-primary', t.primary);
    if (t.primaryForeground) root.style.setProperty('--da-primary-foreground', t.primaryForeground);
    if (t.secondary) root.style.setProperty('--da-secondary', t.secondary);
    if (t.secondaryForeground) root.style.setProperty('--da-secondary-foreground', t.secondaryForeground);
    if (t.radius) root.style.setProperty('--da-radius', t.radius + 'rem');
    if (t.contrast) root.setAttribute('data-contrast', t.contrast);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${sora.variable} ${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <SiteConfigProvider>
              {children}
              <Toaster />
            </SiteConfigProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
