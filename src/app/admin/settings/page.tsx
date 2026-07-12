"use client";

import * as React from "react";
import { toast } from "sonner";
import { CreditCard, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSiteConfig } from "@/context/site-config-context";
import { saveSiteConfig } from "@/lib/site-config";

export default function SettingsPage() {
  const { config } = useSiteConfig();
  const [saving, setSaving] = React.useState(false);
  const enabled = config.settings.onlinePaymentsEnabled;

  const handleToggle = async (value: boolean) => {
    setSaving(true);
    try {
      await saveSiteConfig({ settings: { onlinePaymentsEnabled: value } });
      toast.success(value ? "Online payments turned on." : "Online payments turned off.");
    } catch {
      toast.error("Couldn't update — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Controls that change how checkout behaves site-wide.</p>

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
            <Switch checked={enabled} onCheckedChange={handleToggle} disabled={saving} />
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
