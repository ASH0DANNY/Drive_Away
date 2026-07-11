import type { Metadata } from "next";
import { FleetBrowser } from "@/components/site/fleet-browser";

export const metadata: Metadata = {
  title: "Browse the fleet — Drive Away",
  description: "Filter cars and bikes by type, city, price and rating.",
};

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse the fleet
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every vehicle here is inspected and logged before it's listed — pick a type, a city, and go.
        </p>
      </div>

      <div className="mt-8">
        <FleetBrowser />
      </div>
    </div>
  );
}
