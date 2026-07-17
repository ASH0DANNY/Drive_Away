import ExcelJS from "exceljs";
import type { ReportData } from "@/lib/reports";
import type { BusinessDetails } from "@/lib/invoice-pdf";

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF0F0F0" },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true };
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.border = { bottom: { style: "thin" } };
  });
}

function addTable(
  sheet: ExcelJS.Worksheet,
  headers: string[],
  rows: (string | number)[][],
  colWidths: number[]
) {
  sheet.columns = headers.map((h, i) => ({ header: h, width: colWidths[i] ?? 20 }));
  styleHeaderRow(sheet.getRow(1));
  for (const r of rows) sheet.addRow(r);
}

export async function generateReportExcel(data: ReportData, business: BusinessDetails): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = business.legalName || "Drive Away";
  workbook.created = new Date();

  // ---- Summary ----
  const summary = workbook.addWorksheet("Summary");
  addTable(
    summary,
    ["Metric", "Value"],
    [
      ["Report range", `${data.rangeStart} to ${data.rangeEnd}`],
      ["Total bookings", data.totalBookings],
      ["Paid bookings", data.paidBookingsCount],
      ["Total revenue (Rs.)", data.totalRevenue],
      ["Average booking value (Rs.)", data.avgBookingValue],
      ["Average rental length (days)", data.avgRentalDays],
      ["Cancellation rate (%)", data.cancellationRate],
      ["Cancellations", data.cancellationCount],
      ["Cancellation charges collected (Rs.)", data.totalCancellationCharges],
      ["Refunds pending (Rs.)", data.totalRefundsPending],
      ["Refunds issued (Rs.)", data.totalRefundsIssued],
      ["Discounts given (Rs.)", data.totalDiscountGiven],
    ],
    [32, 22]
  );

  // ---- Revenue breakdown ----
  const revenue = workbook.addWorksheet("Revenue Breakdown");
  addTable(
    revenue,
    ["Segment", "Revenue (Rs.)"],
    [
      ["Online payments", data.onlineRevenue],
      ["Offline / pay at pickup", data.offlineRevenue],
      ["Cars", data.carRevenue],
      ["Bikes", data.bikeRevenue],
    ],
    [28, 18]
  );

  // ---- Status breakdown ----
  const status = workbook.addWorksheet("Status Breakdown");
  addTable(
    status,
    ["Status", "Count"],
    Object.entries(data.statusBreakdown).map(([k, v]) => [k, v]),
    [20, 12]
  );

  // ---- Top vehicles ----
  const vehicles = workbook.addWorksheet("Top Vehicles");
  addTable(
    vehicles,
    ["Vehicle", "Bookings", "Revenue (Rs.)"],
    data.topVehicles.map((v) => [v.vehicleName, v.bookings, v.revenue]),
    [28, 12, 18]
  );

  // ---- Coupon usage ----
  if (data.couponUsage.length > 0) {
    const coupons = workbook.addWorksheet("Coupon Usage");
    addTable(
      coupons,
      ["Code", "Uses", "Total discount (Rs.)"],
      data.couponUsage.map((c) => [c.code, c.uses, c.totalDiscount]),
      [18, 10, 20]
    );
  }

  // ---- Daily revenue ----
  const daily = workbook.addWorksheet("Daily Revenue");
  addTable(
    daily,
    ["Date", "Revenue (Rs.)", "Bookings"],
    data.dailyRevenue.map((d) => [d.date, d.revenue, d.bookings]),
    [14, 16, 12]
  );

  // ---- Raw bookings (for anyone who wants to pivot further) ----
  const raw = workbook.addWorksheet("Bookings");
  addTable(
    raw,
    ["Booking ID", "Invoice #", "Customer", "Vehicle", "Type", "Start", "End", "Days", "Status", "Payment status", "Payment method", "Total (Rs.)", "Discount (Rs.)", "Coupon"],
    data.bookings.map((b) => [
      b.id,
      b.invoiceNumber,
      b.customerName,
      b.vehicleName,
      b.vehicleType,
      b.startDate,
      b.endDate,
      b.days,
      b.status,
      b.paymentStatus,
      b.paymentMethod ?? "",
      b.total,
      b.discountAmount,
      b.couponCode ?? "",
    ]),
    [22, 16, 18, 18, 8, 12, 12, 8, 12, 14, 14, 14, 14, 14]
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export function downloadExcelBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
