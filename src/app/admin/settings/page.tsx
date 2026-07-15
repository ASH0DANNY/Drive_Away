"use client";

import * as React from "react";
import { toast } from "sonner";
import { CreditCard, Receipt, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteConfig } from "@/context/site-config-context";
import { saveSiteConfig } from "@/lib/site-config";
import type { SiteConfig } from "@/lib/default-content";

export default function SettingsPage() {
  const { config } = useSiteConfig();
  const [saving, setSaving] = React.useState(false);
  const enabled = config.settings.onlinePaymentsEnabled;

  const [chargeType, setChargeType] = React.useState(config.settings.cancellationChargeType);
  const [chargeValue, setChargeValue] = React.useState(config.settings.cancellationChargeValue);
  const seeded = React.useRef(false);

  // seed the local cancellation-charge fields once live config arrives
  React.useEffect(() => {
    if (!seeded.current) {
      setChargeType(config.settings.cancellationChargeType);
      setChargeValue(config.settings.cancellationChargeValue);
      seeded.current = true;
    }
  }, [config.settings]);

  // Always send the FULL settings object — saveSiteConfig merge-writes at
  // the top level, so sending a partial `settings` object would silently
  // wipe out whichever fields aren't included in that particular save.
  const saveSettings = async (next: Partial<SiteConfig["settings"]>, successMessage: string) => {
    setSaving(true);
    try {
      await saveSiteConfig({ settings: { ...config.settings, ...next } });
      toast.success(successMessage);
    } catch {
      toast.error("Couldn't update — try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePayments = (value: boolean) =>
    saveSettings(
      { onlinePaymentsEnabled: value },
      value ? "Online payments turned on." : "Online payments turned off."
    );

  const handleSaveCancellationCharge = () =>
    saveSettings(
      { cancellationChargeType: chargeType, cancellationChargeValue: chargeValue },
      "Cancellation charge updated."
    );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Controls that change how checkout and cancellations behave site-wide.</p>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="font-medium">Online payments</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  When on, checkout goes through the dummy payment gateway. When off, customers
                  reserve a vehicle and pay in person — use{" "}
                  <span className="font-medium text-foreground">Offline billing</span> or the
                  Bookings tab to mark those paid once they arrive.
                </p>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={handleTogglePayments} disabled={saving} />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Ban className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Cancellation charge</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Applied only when a customer or admin cancels a booking that was{" "}
                <span className="font-medium text-foreground">paid online</span> — offline/
                pay-at-pickup bookings always cancel free. Taken from the rental cost only; the
                refundable deposit is never touched by this charge.
              </p>

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Charge type</Label>
                  <Tabs
                    value={chargeType}
                    onValueChange={(v) => setChargeType(v as SiteConfig["settings"]["cancellationChargeType"])}
                    className="mt-1.5"
                  >
                    <TabsList>
                      <TabsTrigger value="percentage">Percentage</TabsTrigger>
                      <TabsTrigger value="fixed">Fixed (₹)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {chargeType === "percentage" ? "Percentage" : "Amount (₹)"}
                  </Label>
                  <Input
                    type="number"
                    className="mt-1.5 w-32"
                    value={chargeValue}
                    onChange={(e) => setChargeValue(Number(e.target.value) || 0)}
                  />
                </div>
                <Button onClick={handleSaveCancellationCharge} disabled={saving}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Receipt className="size-5" />
          </div>
          <div>
            <p className="font-medium">Walk-in customers</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              For customers who show up without booking online — after they've examined the
              vehicle in person — use the <span className="font-medium text-foreground">Offline
              billing</span> tab to create and collect payment for their booking directly,
              including any discount you want to apply on the spot.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
