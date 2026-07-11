"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSiteConfig } from "@/context/site-config-context";

export function Footer() {
  const { config } = useSiteConfig();
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xs font-bold">
                DA
              </span>
              <span className="font-display text-base font-semibold">{config.siteName}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">{config.footer.about}</p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold">Navigate</p>
            <ul className="mt-3 space-y-2">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold">Reach us</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" /> {config.footer.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" /> {config.footer.phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" /> {config.footer.address}
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col-reverse items-center gap-3 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
