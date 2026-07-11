import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { VerifyBanner } from "@/components/site/verify-banner";

// Navbar and Footer read config via useSiteConfig(), which starts from the
// hardcoded defaults (defaultSiteConfig) — so this layout is fully
// rendered and worded on first paint, then silently upgrades once
// Firestore responds. Never a blank shell.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <VerifyBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
