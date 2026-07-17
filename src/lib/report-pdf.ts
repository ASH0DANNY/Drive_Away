import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { ReportData } from "@/lib/reports";
import type { BusinessDetails } from "@/lib/invoice-pdf";

type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

function fmtMoney(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
}

export function generateReportPdf(data: ReportData, business: BusinessDetails): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" }) as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 10;

  // ============ HEADER ============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Business Analytics Report", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(business.legalName || "Drive Away", margin, 23);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${format(new Date(data.rangeStart), "d MMM yyyy")} - ${format(new Date(data.rangeEnd), "d MMM yyyy")}`,
    pageWidth - margin,
    16,
    { align: "right" }
  );
  doc.text(`Generated ${format(new Date(), "d MMM yyyy, HH:mm")}`, pageWidth - margin, 21, { align: "right" });
  doc.setTextColor(0, 0, 0);

  doc.setLineWidth(0.3);
  doc.line(margin, 27, pageWidth - margin, 27);

  let y = 34;
  const sectionHeading = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, margin, y);
    y += 5;
  };

  // ============ SUMMARY ============
  sectionHeading("SUMMARY");
  autoTable(doc, {
    body: [
      ["Total bookings", String(data.totalBookings)],
      ["Paid bookings", String(data.paidBookingsCount)],
      ["Total revenue", fmtMoney(data.totalRevenue)],
      ["Average booking value", fmtMoney(data.avgBookingValue)],
      ["Average rental length", `${data.avgRentalDays} days`],
      ["Cancellation rate", `${data.cancellationRate}% (${data.cancellationCount} bookings)`],
    ],
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
    columnStyles: { 0: { cellWidth: 100, fontStyle: "bold" }, 1: { cellWidth: 90 } },
    margin: { left: margin, right: margin },
  });
  y = doc.lastAutoTable!.finalY + 8;

  // ============ REVENUE BREAKDOWN ============
  sectionHeading("REVENUE BREAKDOWN");
  autoTable(doc, {
    head: [["Segment", "Revenue"]],
    body: [
      ["Online payments", fmtMoney(data.onlineRevenue)],
      ["Offline / pay at pickup", fmtMoney(data.offlineRevenue)],
      ["Cars", fmtMoney(data.carRevenue)],
      ["Bikes", fmtMoney(data.bikeRevenue)],
      ["Discounts given", `-${fmtMoney(data.totalDiscountGiven)}`],
    ],
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 90, halign: "right" } },
    margin: { left: margin, right: margin },
  });
  y = doc.lastAutoTable!.finalY + 8;

  // ============ CANCELLATIONS & REFUNDS ============
  sectionHeading("CANCELLATIONS & REFUNDS");
  autoTable(doc, {
    body: [
      ["Cancellation charges collected", fmtMoney(data.totalCancellationCharges)],
      ["Refunds pending", fmtMoney(data.totalRefundsPending)],
      ["Refunds issued", fmtMoney(data.totalRefundsIssued)],
    ],
    startY: y,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
    columnStyles: { 0: { cellWidth: 100, fontStyle: "bold" }, 1: { cellWidth: 90 } },
    margin: { left: margin, right: margin },
  });
  y = doc.lastAutoTable!.finalY + 8;

  // page break if running low on room before the next table
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 20;
  }

  // ============ TOP VEHICLES ============
  if (data.topVehicles.length > 0) {
    sectionHeading("TOP VEHICLES BY REVENUE");
    autoTable(doc, {
      head: [["Vehicle", "Bookings", "Revenue"]],
      body: data.topVehicles.map((v) => [v.vehicleName, String(v.bookings), fmtMoney(v.revenue)]),
      startY: y,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 40, halign: "center" }, 2: { cellWidth: 50, halign: "right" } },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable!.finalY + 8;
  }

  if (y > pageHeight - 50) {
    doc.addPage();
    y = 20;
  }

  // ============ COUPON USAGE ============
  if (data.couponUsage.length > 0) {
    sectionHeading("COUPON USAGE");
    autoTable(doc, {
      head: [["Code", "Uses", "Total discount"]],
      body: data.couponUsage.map((c) => [c.code, String(c.uses), fmtMoney(c.totalDiscount)]),
      startY: y,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 60, halign: "center" }, 2: { cellWidth: 60, halign: "right" } },
      margin: { left: margin, right: margin },
    });
  }

  // ============ FOOTER on every page ============
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${business.legalName || "Drive Away"} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" }
    );
  }

  return doc;
}
