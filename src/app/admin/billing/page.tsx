"use client";

import * as React from "react";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { Loader2, Receipt, CheckCircle2 } from "lucide-react";
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
import { useVehicles } from "@/lib/hooks/use-vehicles";
import { useBooking } from "@/lib/hooks/use-booking";
import { computePricing } from "@/lib/pricing";
import { createOfflineBooking, WALKIN_USER_ID, type DiscountType } from "@/lib/bookings";

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
  const [discountType, setDiscountType] = React.useState<Exclude<DiscountType, "coupon">>("none");
  const [discountValue, setDiscountValue] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(null);

  const { booking: createdBooking } = useBooking(createdBookingId ?? undefined);
  const vehicle = availableVehicles.find((v) => v.id === vehicleId);
  const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)));

  const pricing = vehicle ? computePricing(vehicle.pricePerDay, days) : null;
  const discountAmount = pricing
    ? discountType === "percentage"
      ? Math.round((pricing.subtotal * discountValue) / 100)
      : discountType === "fixed"
      ? Math.min(discountValue, pricing.subtotal)
      : 0
    : 0;
  const total = pricing ? pricing.subtotal - discountAmount + pricing.serviceFee + pricing.deposit : 0;

  const canSubmit = vehicle && customerName.trim() && customerPhone.trim() && licenseNumber.trim();

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
        discountType,
        discountValue,
        discountAmount,
        couponCode: null,
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
              <Tabs value={discountType} onValueChange={(v) => setDiscountType(v as typeof discountType)} className="mt-1.5">
                <TabsList>
                  <TabsTrigger value="none">None</TabsTrigger>
                  <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  <TabsTrigger value="fixed">Fixed (₹)</TabsTrigger>
                </TabsList>
              </Tabs>
              {discountType !== "none" && (
                <Input
                  type="number"
                  className="mt-2"
                  placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 150"}
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                />
              )}
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
                      <span>Discount</span>
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

            <Button className="mt-5 w-full" size="lg" disabled={!canSubmit || submitting} onClick={handleCreate}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Record booking & mark paid
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
