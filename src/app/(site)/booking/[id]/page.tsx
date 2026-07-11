"use client";

import * as React from "react";
import { use as usePromise } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format, differenceInCalendarDays } from "date-fns";
import { Loader2, ShieldCheck, ArrowLeft, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useVehicle } from "@/lib/hooks/use-vehicle";
import { computePricing } from "@/lib/pricing";
import { createBooking } from "@/lib/bookings";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation/checkout";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { vehicle, loading } = useVehicle(id);
  const { user, isVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const start = searchParams.get("start") ?? format(new Date(), "yyyy-MM-dd");
  const end = searchParams.get("end") ?? start;
  const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)));

  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: user?.displayName ?? "" },
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl font-semibold">Vehicle not found</p>
        <Button className="mt-6" asChild>
          <Link href="/fleet">Back to fleet</Link>
        </Button>
      </div>
    );
  }

  const { subtotal, serviceFee, deposit, total } = computePricing(vehicle.pricePerDay, days);
  const redirectHere = `/booking/${id}?start=${start}&end=${end}`;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-6" />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You'll need an account to reserve {vehicle.name} — it's how we keep your bookings and
          receipts in one place.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href={`/login?redirect=${encodeURIComponent(redirectHere)}`}>Sign in</Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          New here?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirectHere)}`} className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    setSubmitting(true);
    try {
      const bookingId = await createBooking({
        userId: user.uid,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleType: vehicle.type,
        vehicleImage: vehicle.images[0] ?? null,
        pricePerDay: vehicle.pricePerDay,
        startDate: start,
        endDate: end,
        days,
        subtotal,
        serviceFee,
        deposit,
        total,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        licenseNumber: values.licenseNumber,
      });
      router.push(`/payment/${bookingId}`);
    } catch {
      toast.error("Couldn't create the booking — please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:py-14">
      <Link
        href={`/fleet/${vehicle.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to {vehicle.name}
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Confirm your booking</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-5 p-5">
              <h2 className="font-display text-base font-semibold">Driver details</h2>

              <div>
                <Label htmlFor="customerName">Full name (as on license)</Label>
                <Input id="customerName" className="mt-1.5" {...register("customerName")} />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-destructive">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="customerPhone">Phone number</Label>
                <Input id="customerPhone" type="tel" className="mt-1.5" {...register("customerPhone")} />
                {errors.customerPhone && (
                  <p className="mt-1 text-xs text-destructive">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="licenseNumber">Driving license number</Label>
                <Input id="licenseNumber" className="mt-1.5" {...register("licenseNumber")} />
                {errors.licenseNumber && (
                  <p className="mt-1 text-xs text-destructive">{errors.licenseNumber.message}</p>
                )}
              </div>

              <Separator />

              <Controller
                control={control}
                name="agree"
                render={({ field }) => (
                  <div>
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="agree"
                        checked={field.value ?? false}
                        onCheckedChange={(v) => field.onChange(v === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="agree" className="text-sm font-normal text-muted-foreground">
                        I agree to the rental terms, including the refundable deposit and fuel/mileage policy.
                      </Label>
                    </div>
                    {errors.agree && <p className="mt-1 text-xs text-destructive">{errors.agree.message}</p>}
                  </div>
                )}
              />

              {!isVerified && (
                <p className="rounded-lg bg-primary/10 px-3 py-2.5 text-xs text-foreground">
                  Your email isn't verified yet — you can fill this out, but you'll need to verify
                  before payment goes through. Check the banner at the top of the page to resend it.
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting || !isVerified}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Continue to payment
              </Button>
            </CardContent>
          </Card>
        </form>

        <div>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-base font-semibold">{vehicle.name}</h2>
              <p className="text-xs text-muted-foreground">{vehicle.category} · {vehicle.location}</p>

              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>Pick-up</span>
                <span className="font-mono-num text-foreground">{format(new Date(start), "d MMM yyyy")}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-muted-foreground">
                <span>Return</span>
                <span className="font-mono-num text-foreground">{format(new Date(end), "d MMM yyyy")}</span>
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
                  <span className="font-mono-num">₹{deposit.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-mono-num">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 shrink-0" />
                Payment is simulated in this preview — no real charge is made.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
