"use client";

import * as React from "react";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { Loader2, Receipt, CheckCircle2, TriangleAlert, ShieldCheck, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceActions } from "@/components/site/invoice-actions";
import { AvailableOffers } from "@/components/site/available-offers";
import { useVehicles } from "@/lib/hooks/use-vehicles";
import { useBooking } from "@/lib/hooks/use-booking";
import { computePricing } from "@/lib/pricing";
import { findClashingBookings } from "@/lib/availability";
import { validateCoupon, type Coupon, type EligibleOffer } from "@/lib/coupons";
import { createOfflineBooking, WALKIN_USER_ID, type DiscountType } from "@/lib/bookings";
import type { Booking } from "@/lib/bookings";

export default function OfflineBillingPage() {
  const { vehicles } = useVehicles();
  const availableVehicles = vehicles.filter((v) => v.available);

  const today = format(new Date(), "yyyy-MM-dd");
  const [vehicleId, setVehicleId] = React.useState<string>("");
  const [start, setStart] = React.useState(today);
  const [end, setEnd] = React.useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [discountType, setDiscountType] = React.useState<DiscountType>("none");
  const [discountValue, setDiscountValue] = React.useState(0);
  const [couponInput, setCouponInput] = React.useState("");
  const [couponChecking, setCouponChecking] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ coupon: Coupon; discountAmount: number } | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = React.useState(false);
  const [clashes, setClashes] = React.useState<Booking[]>([]);

  const { booking: createdBooking } = useBooking(createdBookingId ?? undefined);
  const vehicle = availableVehicles.find((v) => v.id === vehicleId);
  const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)));

  const pricing = vehicle ? computePricing(vehicle.pricePerDay, days) : null;
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountAmount
    : pricing
    ? discountType === "percentage"
      ? Math.round((pricing.subtotal * discountValue) / 100)
      : discountType === "fixed"
      ? Math.min(discountValue, pricing.subtotal)
      : 0
    : 0;
  const total = pricing ? pricing.subtotal - discountAmount + pricing.serviceFee + pricing.deposit : 0;

  const canSubmit = vehicle && customerName.trim() && customerPhone.trim() && licenseNumber.trim();

  React.useEffect(() => {
    if (!vehicle || end <= start) {
      setClashes([]);
      return;
    }
    setCheckingAvailability(true);
    const handle = setTimeout(() => {
      findClashingBookings(vehicle.id, start, end)
        .then(setClashes)
        .catch((err) => {
          console.error("Failed to check availability:", err);
          setClashes([]);
        })
        .finally(() => setCheckingAvailability(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [vehicle, start, end]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !pricing) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      // Walk-ins have no account to check "first booking" status against —
      // new-customer-only codes simply won't apply here; use the manual
      // percentage/fixed discount for that case instead.
      const result = await validateCoupon(couponInput, { subtotal: pricing.subtotal, isFirstBooking: false });
      if (result.ok) {
        setAppliedCoupon({ coupon: result.coupon, discountAmount: result.discountAmount });
        toast.success(`"${result.coupon.code}" applied.`);
      } else {
        setCouponError(result.message);
      }
    } catch {
      setCouponError("Couldn't check that code — try again.");
    } finally {
      setCouponChecking(false);
    }
  };

  const handleCreate = async () => {
    if (!vehicle || !pricing) return;
    setSubmitting(true);
    try {
      const bookingId = await createOfflineBooking({
        userId: WALKIN_USER_ID, // no customer account for a walk-in — not tied to any user's My Bookings
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleType: vehicle.type,
        vehicleImage: vehicle.images[0] ?? null,
        pricePerDay: vehicle.pricePerDay,
        startDate: start,
        endDate: end,
        days,
        subtotal: pricing.subtotal,
        serviceFee: pricing.serviceFee,
        deposit: pricing.deposit,
        discountType: appliedCoupon ? "coupon" : discountType,
        discountValue: appliedCoupon ? appliedCoupon.coupon.value : discountValue,
        discountAmount,
        couponCode: appliedCoupon?.coupon.code ?? null,
        total,
        customerName,
        customerEmail: "",
        customerPhone,
        licenseNumber,
      });
      setCreatedBookingId(bookingId);
      toast.success("Booking created and marked paid.");
    } catch {
      toast.error("Couldn't create the booking — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedBookingId(null);
    setVehicleId("");
    setCustomerName("");
    setCustomerPhone("");
    setLicenseNumber("");
    setDiscountType("none");
    setDiscountValue(0);
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  if (createdBooking) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="mt-4 font-display text-xl font-semibold">Booking recorded</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {createdBooking.vehicleName} · ₹{createdBooking.total.toLocaleString("en-IN")} collected offline.
              {createdBooking.couponCode && ` (Code: ${createdBooking.couponCode})`}
            </p>
            <div className="mt-6">
              <InvoiceActions booking={createdBooking} />
            </div>
            <Button variant="outline" className="mt-6" onClick={handleReset}>
              Record another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Offline billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        For walk-in customers who book after examining the vehicle in person.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5 p-5">
            <div>
              <Label className="text-xs text-muted-foreground">Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} · ₹{v.pricePerDay.toLocaleString("en-IN")}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Pick-up</Label>
                <Input type="date" className="mt-1.5" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Return</Label>
                <Input type="date" className="mt-1.5" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            {vehicle &&
              (checkingAvailability ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Checking availability…
                </p>
              ) : clashes.length > 0 ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="flex items-center gap-2 font-medium text-destructive">
                    <TriangleAlert className="size-4 shrink-0" />
                    Clashes with {clashes.length} other booking{clashes.length > 1 ? "s" : ""}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {clashes.map((c) => (
                      <li key={c.id}>
                        {c.customerName} — {c.startDate} to {c.endDate}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-success">
                  <ShieldCheck className="size-3.5" /> This vehicle is free for these dates.
                </p>
              ))}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Customer name</Label>
                <Input className="mt-1.5" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1.5" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Driving license number</Label>
              <Input className="mt-1.5" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Discount</Label>
              <Tabs
                value={discountType}
                onValueChange={(v) => {
                  setDiscountType(v as DiscountType);
                  setAppliedCoupon(null);
                }}
                className="mt-1.5"
              >
                <TabsList>
                  <TabsTrigger value="none">None</TabsTrigger>
                  <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  <TabsTrigger value="fixed">Fixed (₹)</TabsTrigger>
                  <TabsTrigger value="coupon">Coupon</TabsTrigger>
                </TabsList>
              </Tabs>
              {discountType === "percentage" || discountType === "fixed" ? (
                <Input
                  type="number"
                  className="mt-2"
                  placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 150"}
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                />
              ) : discountType === "coupon" ? (
                <div className="mt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-sm">
                      <span className="flex items-center gap-1.5 text-success">
                        <Tag className="size-3.5" /> {appliedCoupon.coupon.code} applied
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponInput("");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Remove coupon"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {pricing && (
                        <AvailableOffers
                          subtotal={pricing.subtotal}
                          isFirstBooking={false}
                          onSelect={(offer: EligibleOffer) => {
                            setAppliedCoupon(offer);
                            toast.success(`"${offer.coupon.code}" applied.`);
                          }}
                        />
                      )}
                      <div className="flex gap-2">
                        <Input
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError(null);
                          }}
                          placeholder="Coupon code"
                          className="uppercase"
                        />
                        <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={couponChecking}>
                          {couponChecking ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
                        </Button>
                      </div>
                      {couponError && <p className="mt-1.5 text-xs text-destructive">{couponError}</p>}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">Bill summary</p>
            </div>

            {vehicle && pricing ? (
              <>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>₹{vehicle.pricePerDay.toLocaleString("en-IN")} × {days} {days === 1 ? "day" : "days"}</span>
                    <span className="font-mono-num">₹{pricing.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount{appliedCoupon ? ` (${appliedCoupon.coupon.code})` : ""}</span>
                      <span className="font-mono-num">−₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fee</span>
                    <span className="font-mono-num">₹{pricing.serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Refundable deposit</span>
                    <span className="font-mono-num">₹{pricing.deposit.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold">
                  <span>Total to collect</span>
                  <span className="font-mono-num">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Choose a vehicle to see the bill.</p>
            )}

            <Button
              className="mt-5 w-full"
              size="lg"
              variant={clashes.length > 0 ? "destructive" : "default"}
              disabled={!canSubmit || submitting || checkingAvailability}
              onClick={handleCreate}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {clashes.length > 0 ? "Record anyway (clashes)" : "Record booking & mark paid"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
