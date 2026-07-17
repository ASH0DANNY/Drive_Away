"use client";

import * as React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  IndianRupee,
  Ticket,
  BadgePercent,
  TrendingDown,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DateRangePicker, presetToRange, type DateRangePreset } from "@/components/admin/date-range-picker";
import { useReportData } from "@/lib/hooks/use-report-data";
import { useSiteConfig } from "@/context/site-config-context";
import { generateReportPdf } from "@/lib/report-pdf";
import { generateReportExcel, downloadExcelBlob } from "@/lib/report-excel";
import { previewInvoicePdf, downloadInvoicePdf } from "@/lib/invoice-pdf";

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-24" />
        ) : (
          <p className="mt-2 font-mono-num text-2xl font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { config } = useSiteConfig();
  const [preset, setPreset] = React.useState<DateRangePreset>("30d");
  const [customStart, setCustomStart] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [customEnd, setCustomEnd] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [exporting, setExporting] = React.useState<"pdf" | "excel" | null>(null);

  const { start, end } = presetToRange(preset, customStart, customEnd);
  const { data, loading, refresh } = useReportData(start, end);

  const handleExportPdf = (mode: "view" | "download") => {
    if (!data) return;
    setExporting("pdf");
    try {
      const doc = generateReportPdf(data, config.footer);
      if (mode === "view") previewInvoicePdf(doc);
      else downloadInvoicePdf(doc, `drive-away-report-${data.rangeStart}-to-${data.rangeEnd}.pdf`);
    } catch (err) {
      console.error("Failed to generate report PDF:", err);
      toast.error("Couldn't generate the PDF — try again.");
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    if (!data) return;
    setExporting("excel");
    try {
      const blob = await generateReportExcel(data, config.footer);
      downloadExcelBlob(blob, `drive-away-report-${data.rangeStart}-to-${data.rangeEnd}.xlsx`);
    } catch (err) {
      console.error("Failed to generate report Excel:", err);
      toast.error("Couldn't generate the spreadsheet — try again.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Revenue and booking analytics for a date range.</p>
        </div>
        <Button variant="outline" size="icon" onClick={refresh} aria-label="Refresh">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <DateRangePicker
          preset={preset}
          onPresetChange={setPreset}
          customStart={customStart}
          customEnd={customEnd}
          onCustomChange={(s, e) => {
            setCustomStart(s);
            setCustomEnd(e);
          }}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportPdf("view")} disabled={!data || !!exporting}>
            {exporting === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            View PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportPdf("download")} disabled={!data || !!exporting}>
            <Download className="size-4" /> Download PDF
          </Button>
          <Button onClick={handleExportExcel} disabled={!data || !!exporting}>
            {exporting === "excel" ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
            Export Excel
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total revenue" value={`₹${(data?.totalRevenue ?? 0).toLocaleString("en-IN")}`} loading={loading} />
        <StatCard icon={Ticket} label="Total bookings" value={String(data?.totalBookings ?? 0)} loading={loading} />
        <StatCard icon={BadgePercent} label="Avg booking value" value={`₹${(data?.avgBookingValue ?? 0).toLocaleString("en-IN")}`} loading={loading} />
        <StatCard icon={TrendingDown} label="Cancellation rate" value={`${data?.cancellationRate ?? 0}%`} loading={loading} />
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <p className="text-sm font-medium">Daily revenue</p>
          <div className="mt-4 h-64">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : data && data.dailyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyRevenue}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => format(new Date(v), "d MMM")}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={{ stroke: "var(--color-border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Revenue"]}
                    labelFormatter={(v) => format(new Date(v), "d MMM yyyy")}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No paid bookings in this range yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium">Revenue breakdown</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Online payments</span>
                <span className="font-mono-num">₹{(data?.onlineRevenue ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Offline / pay at pickup</span>
                <span className="font-mono-num">₹{(data?.offlineRevenue ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Cars</span>
                <span className="font-mono-num">₹{(data?.carRevenue ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Bikes</span>
                <span className="font-mono-num">₹{(data?.bikeRevenue ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between pb-2 text-success">
                <span>Discounts given</span>
                <span className="font-mono-num">-₹{(data?.totalDiscountGiven ?? 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium">Cancellations & refunds</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Cancellations</span>
                <span className="font-mono-num">{data?.cancellationCount ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Cancellation charges collected</span>
                <span className="font-mono-num">₹{(data?.totalCancellationCharges ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Refunds pending</span>
                <span className="font-mono-num text-destructive">₹{(data?.totalRefundsPending ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">Refunds issued</span>
                <span className="font-mono-num">₹{(data?.totalRefundsIssued ?? 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <p className="p-5 pb-0 text-sm font-medium">Top vehicles by revenue</p>
          {loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : data && data.topVehicles.length > 0 ? (
            <Table className="mt-3">
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topVehicles.map((v) => (
                  <TableRow key={v.vehicleName}>
                    <TableCell>{v.vehicleName}</TableCell>
                    <TableCell className="font-mono-num">{v.bookings}</TableCell>
                    <TableCell className="font-mono-num">₹{v.revenue.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-5 text-sm text-muted-foreground">No paid bookings in this range yet.</p>
          )}
        </CardContent>
      </Card>

      {data && data.couponUsage.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-0">
            <p className="p-5 pb-0 text-sm font-medium">Coupon usage</p>
            <Table className="mt-3">
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Total discount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.couponUsage.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono-num">{c.code}</TableCell>
                    <TableCell className="font-mono-num">{c.uses}</TableCell>
                    <TableCell className="font-mono-num">₹{c.totalDiscount.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
