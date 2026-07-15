import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Booking } from "@/lib/bookings";
import type { SiteConfig } from "@/lib/default-content";

// jspdf-autotable attaches this at runtime; typed loosely since the
// upstream types don't expose it on the jsPDF instance.
type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

export type BusinessDetails = Pick<SiteConfig["footer"], "legalName" | "address" | "email" | "phone" | "taxId" | "invoiceTerms">;

function formatPaymentMethod(method: string | null): string {
  if (!method) return "N/A";
  if (method === "offline") return "Cash / offline at pickup";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, "-");
}

// jsPDF's built-in fonts (Helvetica/Times/Courier) don't include a glyph
// for ₹ (U+20B9) — without embedding a custom Unicode font, it renders as
// a broken fallback character that visually collides with the digit next
// to it. "Rs." is the standard ASCII-safe substitute for PDF output; the
// live site UI still shows ₹ normally, since browsers render it fine.
function fmtMoney(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export function generateBookingInvoicePdf(booking: Booking, business: BusinessDetails): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" }) as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // ============ HEADER ============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Rental Invoice", pageWidth - margin, 15, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Original for recipient", pageWidth - margin, 20, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(business.legalName || "Drive Away", pageWidth / 2, 15, { align: "center" });

  if (business.address) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(business.address, pageWidth / 2, 20, { align: "center" });
  }

  // ============ CUSTOMER DETAILS ============
  let yPos = 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER DETAILS", margin, yPos);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos + 1, pageWidth - margin, yPos + 1);

  yPos += 6;
  doc.setFontSize(9);

  const field = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value || "N/A", margin + 38, yPos);
    yPos += 5;
  };

  field("Name:", booking.customerName);
  field("Email:", booking.customerEmail);
  field("Phone:", booking.customerPhone);
  field("Driving license:", booking.licenseNumber);

  doc.setFont("helvetica", "bold");
  doc.text("Payment status:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "failed" ? "Failed" : "Pending", margin + 38, yPos);
  yPos += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Payment method:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatPaymentMethod(booking.paymentMethod), margin + 38, yPos);
  yPos += 5;

  if (booking.transactionId) {
    doc.setFont("helvetica", "bold");
    doc.text("Transaction ID:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(booking.transactionId, margin + 38, yPos);
    yPos += 5;
  }

  // ============ RENTAL DETAILS (left) / VEHICLE (right) ============
  yPos += 3;
  const sectionStartY = yPos;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("RENTAL PERIOD:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  yPos += 5;
  doc.text(`Pick-up: ${formatDate(booking.startDate)}`, margin, yPos);
  yPos += 4;
  doc.text(`Return: ${formatDate(booking.endDate)}`, margin, yPos);
  yPos += 4;
  doc.text(`Duration: ${booking.days} ${booking.days === 1 ? "day" : "days"}`, margin, yPos);
  const leftEndY = yPos + 4;

  const rightX = pageWidth / 2 + 10;
  let rightY = sectionStartY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VEHICLE:", rightX, rightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  rightY += 5;
  doc.text(booking.vehicleName, rightX, rightY);
  rightY += 4;
  doc.text(`Type: ${booking.vehicleType === "car" ? "Car" : "Bike"}`, rightX, rightY);
  const rightEndY = rightY + 4;

  // ============ ORDER / INVOICE NUMBERS ============
  yPos = Math.max(leftEndY, rightEndY) + 6;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Booking ID:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(booking.id, margin + 28, yPos);

  const invRightY = yPos;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Invoice Number:", rightX - 10, invRightY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(booking.invoiceNumber, pageWidth - margin, invRightY, { align: "right" });

  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Invoice Date:", rightX - 10, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(formatDate(new Date()), pageWidth - margin, yPos, { align: "right" });

  // ============ ITEMS TABLE ============
  const tableStartY = yPos + 8;
  const gross = booking.subtotal;
  const netRental = gross - booking.discountAmount;

  const rows: (string | number)[][] = [
    [
      1,
      `${booking.vehicleName} rental (${booking.vehicleType === "car" ? "Car" : "Bike"})`,
      fmtMoney(booking.pricePerDay),
      booking.days,
      fmtMoney(gross),
      fmtMoney(booking.discountAmount),
      fmtMoney(netRental),
    ],
  ];

  autoTable(doc, {
    head: [["SN.", "Description", "Rate/day", "Days", "Gross", "Discount", "Net"]],
    body: rows,
    startY: tableStartY,
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.1, overflow: "linebreak" },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", halign: "center" },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { cellWidth: 121 },
      2: { cellWidth: 26, halign: "right" },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 32, halign: "right" },
      5: { cellWidth: 32, halign: "right" },
      6: { cellWidth: 38, halign: "right" },
    },
    margin: { left: margin, right: margin },
    tableWidth: 277,
    theme: "grid",
  });

  let afterTableY = (doc.lastAutoTable?.finalY ?? tableStartY) + 6;

  // ============ TOTALS ============
  const totalsX = pageWidth - margin - 70;
  const totalLine = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9);
    doc.text(label, totalsX, afterTableY);
    doc.text(value, pageWidth - margin, afterTableY, { align: "right" });
    afterTableY += bold ? 7 : 5;
  };

  totalLine("Net rental", fmtMoney(netRental));
  totalLine("Service fee", fmtMoney(booking.serviceFee));
  totalLine("Refundable deposit", fmtMoney(booking.deposit));
  doc.setLineWidth(0.2);
  doc.line(totalsX, afterTableY - 3, pageWidth - margin, afterTableY - 3);
  totalLine("Total paid", fmtMoney(booking.total), true);

  // ============ CANCELLATION (only if applicable) ============
  if (booking.status === "cancelled") {
    afterTableY += 4;
    doc.setLineWidth(0.3);
    doc.line(margin, afterTableY, pageWidth - margin, afterTableY);
    afterTableY += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(180, 40, 40);
    doc.text("BOOKING CANCELLED", margin, afterTableY);
    doc.setTextColor(0, 0, 0);
    afterTableY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    if (booking.cancellationCharge > 0) {
      doc.text(`Cancellation charge: ${fmtMoney(booking.cancellationCharge)}`, margin, afterTableY);
      afterTableY += 4;
    }
    if (booking.refundStatus !== "not_applicable") {
      doc.text(
        `Refund ${booking.refundStatus === "refunded" ? "issued" : "pending"}: ${fmtMoney(booking.refundAmount)}`,
        margin,
        afterTableY
      );
      afterTableY += 4;
    }
  }

  // ============ TERMS & CONDITIONS ============
  let termsY = afterTableY + 8;
  doc.setLineWidth(0.3);
  doc.line(margin, termsY, pageWidth - margin, termsY);
  termsY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TERMS & CONDITIONS", margin, termsY);
  termsY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Billed by: ${business.legalName || "Drive Away"}`, margin, termsY);
  termsY += 4;

  if (business.taxId) {
    doc.text(`Tax ID: ${business.taxId}`, margin, termsY);
    termsY += 4;
  }
  if (business.phone || business.email) {
    doc.text(`Contact: ${business.phone || ""} ${business.email ? "· " + business.email : ""}`, margin, termsY);
    termsY += 4;
  }

  termsY += 2;
  const terms = doc.splitTextToSize(
    business.invoiceTerms || "This is a computer-generated invoice and does not require a signature.",
    pageWidth - 2 * margin
  );
  doc.text(terms, margin, termsY);

  // ============ FOOTER ============
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleString("en-GB")}`, pageWidth / 2, pageHeight - 6, {
    align: "center",
  });

  return doc;
}

export function downloadInvoicePdf(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function previewInvoicePdf(doc: jsPDF) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
