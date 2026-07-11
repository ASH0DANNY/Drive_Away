"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { CalendarDays, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Vehicle } from "@/lib/default-content";

const SERVICE_FEE_RATE = 0.05;
const DEPOSIT = 2000;

export function BookingWidget({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const [start, setStart] = React.useState(today);
  const [end, setEnd] = React.useState(tomorrow);

  const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)));
  const subtotal = days * vehicle.pricePerDay;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  const handleReserve = () => {
    const params = new URLSearchParams({ start, end });
    router.push(`/booking/${vehicle.id}?${params.toString()}`);
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-mono-num text-2xl font-semibold">
              ₹{vehicle.pricePerDay.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-muted-foreground"> /day</span>
          </div>
          {!vehicle.available && (
            <span className="text-xs font-medium text-destructive">Currently booked out</span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="start-date" className="text-xs text-muted-foreground">
              Pick-up
            </Label>
            <Input
              id="start-date"
              type="date"
              min={today}
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (e.target.value >= end) {
                  setEnd(format(addDays(new Date(e.target.value), 1), "yyyy-MM-dd"));
                }
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="text-xs text-muted-foreground">
              Return
            </Label>
            <Input
              id="end-date"
              type="date"
              min={format(addDays(new Date(start), 1), "yyyy-MM-dd")}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {days} {days === 1 ? "day" : "days"} rental
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>₹{vehicle.pricePerDay.toLocaleString("en-IN")} × {days} {days === 1 ? "day" : "days"}</span>
            <span className="font-mono-num">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee</span>
            <span className="font-mono-num">₹{serviceFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Refundable deposit</span>
            <span className="font-mono-num">₹{DEPOSIT.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold">
          <span>Total due at checkout</span>
          <span className="font-mono-num">₹{(total + DEPOSIT).toLocaleString("en-IN")}</span>
        </div>

        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={!vehicle.available}
          onClick={handleReserve}
        >
          Reserve this {vehicle.type} <ArrowRight className="size-4" />
        </Button>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0" />
          Deposit is fully refunded at return, minus any damage assessed.
        </p>
      </CardContent>
    </Card>
  );
}
