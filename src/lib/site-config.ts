import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteConfig } from "@/lib/default-content";

const SITE_CONFIG_REF = () => doc(db, "siteConfig", "main");

/** Merge-writes only the top-level keys present in `partial`, leaving the rest untouched. */
export async function saveSiteConfig(partial: Partial<SiteConfig>): Promise<void> {
  await setDoc(SITE_CONFIG_REF(), partial, { merge: true });
}
