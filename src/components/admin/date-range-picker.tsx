"use client";

import * as React from "react";
import { subDays, startOfMonth } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRangePreset = "7d" | "30d" | "90d" | "month" | "custom";

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function presetToRange(preset: DateRangePreset, customStart: string, customEnd: string): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  if (preset === "7d") return { start: subDays(end, 7), end };
  if (preset === "30d") return { start: subDays(end, 30), end };
  if (preset === "90d") return { start: subDays(end, 90), end };
  if (preset === "month") return { start: startOfMonth(end), end };
  const start = new Date(customStart);
  const customEndDate = new Date(customEnd);
  customEndDate.setHours(23, 59, 59, 999);
  return { start, end: customEndDate };
}

export function DateRangePicker({
  preset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomChange,
}: {
  preset: DateRangePreset;
  onPresetChange: (p: DateRangePreset) => void;
  customStart: string;
  customEnd: string;
  onCustomChange: (start: string, end: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <Label className="text-xs text-muted-foreground">Range</Label>
        <Select value={preset} onValueChange={(v) => onPresetChange(v as DateRangePreset)}>
          <SelectTrigger className="mt-1.5 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {preset === "custom" && (
        <>
          <div>
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              className="mt-1.5"
              value={customStart}
              max={customEnd}
              onChange={(e) => onCustomChange(e.target.value, customEnd)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              className="mt-1.5"
              value={customEnd}
              min={customStart}
              max={toDateInputValue(new Date())}
              onChange={(e) => onCustomChange(customStart, e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
