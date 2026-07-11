"use client";

import * as React from "react";
import { use as usePromise } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CreditCard, Smartphone, Wallet, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBooking } from "@/lib/hooks/use-booking";
import { recordPaymentResult, type PaymentMethod } from "@/lib/bookings";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentGatewayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const { booking, loading } = useBooking(id);
  const router = useRouter();

  const [method, setMethod] = React.useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [upiId, setUpiId] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (booking?.paymentStatus === "paid") {
      router.replace(`/payment/${id}/result?status=success`);
    }
  }, [booking, id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-5 py-14">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl font-semibold">Booking not found</p>
        <Button className="mt-6" asChild>
          <Link href="/fleet">Back to fleet</Link>
        </Button>
      </div>
    );
  }

  const isFormValid =
    method === "card"
      ? cardNumber.replace(/\s/g, "").length >= 12 && expiry.length === 5 && cvv.length >= 3 && cardName.trim().length > 1
      : method === "upi"
      ? upiId.includes("@")
      : true;

  const runPayment = async (outcome: "success" | "failed") => {
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 92));
    }, 140);

    await new Promise((res) => setTimeout(res, 1600));
    clearInterval(interval);
    setProgress(100);

    try {
      await recordPaymentResult(booking.id, method, booking.total, outcome);
    } finally {
      setTimeout(() => {
        router.push(`/payment/${id}/result?status=${outcome}`);
      }, 250);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:py-14">
      <Link
        href={`/booking/${booking.vehicleId}?start=${booking.startDate}&end=${booking.endDate}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Payment</h1>
        <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <Lock className="size-3" /> Simulated — no real charge
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardContent className="p-5">
            <Tabs value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">
                  <CreditCard className="size-3.5" /> Card
                </TabsTrigger>
                <TabsTrigger value="upi">
                  <Smartphone className="size-3.5" /> UPI
                </TabsTrigger>
                <TabsTrigger value="wallet">
                  <Wallet className="size-3.5" /> Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="cardName">Name on card</Label>
                  <Input
                    id="cardName"
                    className="mt-1.5"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="A. Sharma"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    className="mt-1.5 font-mono-num"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      className="mt-1.5 font-mono-num"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      className="mt-1.5 font-mono-num"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      inputMode="numeric"
                      type="password"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upi" className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    className="mt-1.5"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bank"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll get a simulated approval — no real UPI request is sent.
                </p>
              </TabsContent>

              <TabsContent value="wallet" className="mt-5 space-y-3">
                {["Drive Away Wallet", "PayEase", "QuickPay"].map((w) => (
                  <label
                    key={w}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="size-4 text-muted-foreground" /> {w}
                    </span>
                    <input type="radio" name="wallet" defaultChecked={w === "Drive Away Wallet"} className="accent-[var(--color-primary)]" />
                  </label>
                ))}
              </TabsContent>
            </Tabs>

            {processing && (
              <div className="mt-6 space-y-2">
                <Progress value={progress} />
                <p className="text-center text-xs text-muted-foreground">Processing payment…</p>
              </div>
            )}

            <Button
              size="lg"
              className="mt-6 w-full"
              disabled={!isFormValid || processing}
              onClick={() => runPayment("success")}
            >
              {processing && <Loader2 className="size-4 animate-spin" />}
              Approve payment · ₹{booking.total.toLocaleString("en-IN")}
            </Button>

            <button
              onClick={() => runPayment("failed")}
              disabled={processing}
              className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline disabled:opacity-50"
            >
              Simulate a failed payment (for testing)
            </button>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-base font-semibold">{booking.vehicleName}</h2>
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>Pick-up</span>
                <span className="font-mono-num text-foreground">
                  {format(new Date(booking.startDate), "d MMM yyyy")}
                </span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-muted-foreground">
                <span>Return</span>
                <span className="font-mono-num text-foreground">
                  {format(new Date(booking.endDate), "d MMM yyyy")}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-mono-num">₹{booking.total.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
