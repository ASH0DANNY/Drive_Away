"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteConfig } from "@/context/site-config-context";
import { saveSiteConfig } from "@/lib/site-config";
import { applyThemeVars, readableForeground } from "@/lib/theme-utils";
import { defaultTheme, type ThemeConfig } from "@/lib/default-content";

const DISPLAY_FONTS: { value: ThemeConfig["fontDisplay"]; label: string }[] = [
  { value: "space-grotesk", label: "Space Grotesk" },
  { value: "sora", label: "Sora" },
  { value: "manrope", label: "Manrope" },
];

const BODY_FONTS: { value: ThemeConfig["fontBody"]; label: string }[] = [
  { value: "inter", label: "Inter" },
  { value: "system", label: "System default" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-lg border border-input bg-card p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono-num uppercase"
        />
      </div>
    </div>
  );
}

export default function ThemeManagerPage() {
  const { config, isLive } = useSiteConfig();
  const { setTheme: setModeSession } = useTheme();
  const seeded = React.useRef(false);
  const [saving, setSaving] = React.useState(false);

  const { control, register, handleSubmit, setValue, reset, getValues } = useForm<ThemeConfig>({
    defaultValues: defaultTheme,
  });

  React.useEffect(() => {
    if (isLive && !seeded.current) {
      reset(config.theme);
      seeded.current = true;
    }
  }, [isLive, config, reset]);

  const watched = useWatch({ control });

  // live preview across the whole admin dashboard as fields change
  React.useEffect(() => {
    applyThemeVars({ ...defaultTheme, ...watched } as ThemeConfig);
  }, [watched]);

  // revert to the last-saved theme if the admin navigates away without saving
  React.useEffect(() => {
    return () => {
      applyThemeVars(config.theme);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: ThemeConfig) => {
    setSaving(true);
    try {
      await saveSiteConfig({ theme: values });
      toast.success("Theme saved — live for every visitor.");
    } catch {
      toast.error("Couldn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    reset(defaultTheme);
    toast.message("Reset to defaults — click Save to publish.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Theme</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes preview live across this dashboard as you edit — save to publish to every visitor.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" /> Reset to default
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save theme
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-6 p-5">
            <div>
              <p className="text-sm font-medium">Brand colors</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <ColorField
                  label="Primary"
                  value={watched.primary ?? defaultTheme.primary}
                  onChange={(v) => {
                    setValue("primary", v);
                    setValue("primaryForeground", readableForeground(v));
                  }}
                />
                <ColorField
                  label="Secondary"
                  value={watched.secondary ?? defaultTheme.secondary}
                  onChange={(v) => {
                    setValue("secondary", v);
                    setValue("secondaryForeground", readableForeground(v));
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Corner radius</p>
                <span className="font-mono-num text-xs text-muted-foreground">
                  {(watched.radius ?? defaultTheme.radius).toFixed(2)}rem
                </span>
              </div>
              <Slider
                className="mt-3"
                min={0}
                max={1.5}
                step={0.05}
                value={[watched.radius ?? defaultTheme.radius]}
                onValueChange={([v]) => setValue("radius", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">High contrast</p>
                <p className="text-xs text-muted-foreground">Stronger borders and text for accessibility.</p>
              </div>
              <Switch
                checked={watched.contrast === "high"}
                onCheckedChange={(v) => setValue("contrast", v ? "high" : "default")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Display font (headings)</Label>
                <Select
                  value={watched.fontDisplay ?? defaultTheme.fontDisplay}
                  onValueChange={(v) => setValue("fontDisplay", v as ThemeConfig["fontDisplay"])}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPLAY_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Body font</Label>
                <Select
                  value={watched.fontBody ?? defaultTheme.fontBody}
                  onValueChange={(v) => setValue("fontBody", v as ThemeConfig["fontBody"])}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Default appearance for new visitors</Label>
              <Select
                value={watched.mode ?? defaultTheme.mode}
                onValueChange={(v) => {
                  setValue("mode", v as ThemeConfig["mode"]);
                  setModeSession(v); // preview it in your own browser right away
                }}
              >
                <SelectTrigger className="mt-1.5 sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Match visitor&apos;s device</SelectItem>
                  <SelectItem value="light">Always light</SelectItem>
                  <SelectItem value="dark">Always dark</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Visitors can still switch modes themselves with the toggle in the navbar — this just
                sets what they see the first time.
              </p>
            </div>

            <input type="hidden" {...register("primaryForeground")} />
            <input type="hidden" {...register("secondaryForeground")} />
          </CardContent>
        </Card>

        {/* live preview panel */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="space-y-4 p-5">
              <p className="text-sm font-medium">Live preview</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Primary button</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="font-display text-base font-semibold">Vantage Sedan</p>
                <p className="mt-1 text-sm text-muted-foreground">Automatic · Petrol · Bengaluru</p>
                <p className="mt-2 font-mono-num text-lg font-semibold text-primary">₹2,199/day</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Primary badge
                </span>
                <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                  Secondary badge
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
