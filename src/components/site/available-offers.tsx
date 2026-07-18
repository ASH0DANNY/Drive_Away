"use client";

import * as React from "react";
import { BadgePercent, Loader2 } from "lucide-react";
import { fetchEligibleOffers, type EligibleOffer } from "@/lib/coupons";
import { cn } from "@/lib/utils";

export function AvailableOffers({
  subtotal,
  isFirstBooking,
  onSelect,
  selectedCode,
}: {
  subtotal: number;
  isFirstBooking: boolean;
  onSelect: (offer: EligibleOffer) => void;
  selectedCode?: string | null;
}) {
  const [offers, setOffers] = React.useState<EligibleOffer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEligibleOffers({ subtotal, isFirstBooking })
      .then((result) => {
        if (!cancelled) setOffers(result);
      })
      .catch((err) => {
        console.error("Failed to load offers:", err);
        if (!cancelled) setOffers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subtotal, isFirstBooking]);

  if (loading) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> Checking available offers…
      </p>
    );
  }

  if (offers.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <BadgePercent className="size-3.5" /> Available offers
      </p>
      <div className="space-y-1.5">
        {offers.map(({ coupon, discountAmount }) => (
          <button
            key={coupon.id}
            type="button"
            onClick={() => onSelect({ coupon, discountAmount })}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-sm transition-colors",
              selectedCode === coupon.code
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <span>
              <span className="font-mono-num font-medium">{coupon.code}</span>
              {coupon.description && (
                <span className="ml-2 text-xs text-muted-foreground">{coupon.description}</span>
              )}
            </span>
            <span className="font-mono-num text-xs font-semibold text-success shrink-0">
              −₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
