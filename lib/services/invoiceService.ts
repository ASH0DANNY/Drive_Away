import jsPDF from "jspdf";
import { Booking } from "@/types";

interface InvoiceData extends Booking {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
}

export function generateInvoicePDF(booking: InvoiceData): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Constants
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.setFont("helvetica", options.weight || "normal");
    pdf.setFontSize(options.size || 12);
    pdf.setTextColor(options.color || [0, 0, 0]);
    pdf.text(text, x, y);
  };

  // Header - Company Info
  pdf.setFillColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, 20, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("INVOICE", margin + 5, yPosition + 12);

  pdf.setFontSize(10);
  pdf.setTextColor(180, 180, 180);
  pdf.text(
    `Invoice #: ${booking.invoiceNumber || "INV-" + Date.now()}`,
    pageWidth - margin - 50,
    yPosition + 7
  );
  pdf.text(
    `Date: ${booking.invoiceDate || new Date().toLocaleDateString()}`,
    pageWidth - margin - 50,
    yPosition + 12
  );

  yPosition += 25;

  // Company Details
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(booking.companyName || "Drive Away Rentals", margin, yPosition);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  yPosition += 6;
  pdf.text(
    booking.companyAddress || "123 Main Street, City, State",
    margin,
    yPosition
  );
  yPosition += 5;
  pdf.text(
    `Email: ${booking.companyEmail || "contact@driveaway.com"}`,
    margin,
    yPosition
  );
  yPosition += 5;
  pdf.text(
    `Phone: ${booking.companyPhone || "+1 (555) 000-0000"}`,
    margin,
    yPosition
  );

  yPosition += 10;

  // Bill To Section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("BILL TO:", margin, yPosition);

  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`${booking.name}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${booking.email}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Phone: ${booking.phone}`, margin, yPosition);

  yPosition += 10;

  // Booking Details
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("BOOKING DETAILS:", margin, yPosition);

  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const detailsX = margin;
  const detailsYGap = 5;

  pdf.text(`Booking ID: ${booking.id}`, detailsX, yPosition);
  yPosition += detailsYGap;
  pdf.text(
    `Vehicle: ${booking.vehicleName || booking.vehicleType}`,
    detailsX,
    yPosition
  );
  yPosition += detailsYGap;
  pdf.text(`Pickup Date: ${booking.pickupDate}`, detailsX, yPosition);
  yPosition += detailsYGap;
  pdf.text(`Return Date: ${booking.returnDate}`, detailsX, yPosition);
  yPosition += detailsYGap;
  pdf.text(
    `Pickup Location: ${booking.pickupLocation || "Main Branch"}`,
    detailsX,
    yPosition
  );
  yPosition += detailsYGap;
  pdf.text(
    `Return Location: ${booking.returnLocation || "Main Branch"}`,
    detailsX,
    yPosition
  );

  yPosition += 10;

  // Pricing Table Header
  pdf.setFillColor(230, 230, 230);
  pdf.rect(margin, yPosition, contentWidth, 8, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  const col1X = margin + 2;
  const col2X = margin + 80;
  const col3X = margin + 130;
  const col4X = margin + 160;

  pdf.text("Description", col1X, yPosition + 5);
  pdf.text("Rate", col2X, yPosition + 5);
  pdf.text("Days", col3X, yPosition + 5);
  pdf.text("Amount", col4X, yPosition + 5);

  yPosition += 10;

  // Pricing Details
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const totalDays = booking.totalDays || 1;
  const ratePerDay = booking.totalPrice ? booking.totalPrice / totalDays : 0;

  pdf.text("Vehicle Rental", col1X, yPosition);
  pdf.text(`$${ratePerDay.toFixed(2)}/day`, col2X, yPosition);
  pdf.text(totalDays.toString(), col3X, yPosition);
  pdf.text(`$${(ratePerDay * totalDays).toFixed(2)}`, col4X, yPosition);

  yPosition += 7;

  // Insurance
  if (booking.insuranceAdded && booking.insurancePrice) {
    pdf.text("Insurance", col1X, yPosition);
    pdf.text("-", col2X, yPosition);
    pdf.text(totalDays.toString(), col3X, yPosition);
    pdf.text(`$${booking.insurancePrice.toFixed(2)}`, col4X, yPosition);
    yPosition += 7;
  }

  // Subtotal Line
  pdf.setDrawColor(180, 180, 180);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Summary
  const subtotal = booking.totalPrice || 0;
  const advance = booking.advancePayment || 0;
  const remaining = booking.remainingAmount || subtotal - advance;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Subtotal:", col3X, yPosition);
  pdf.text(`$${subtotal.toFixed(2)}`, col4X, yPosition);

  yPosition += 7;
  pdf.text("Advance Paid:", col3X, yPosition);
  pdf.setTextColor(76, 175, 80); // Green
  pdf.text(`$${advance.toFixed(2)}`, col4X, yPosition);

  yPosition += 7;
  pdf.setTextColor(0, 0, 0);
  pdf.text("Remaining:", col3X, yPosition);
  pdf.setTextColor(244, 67, 54); // Red
  pdf.text(`$${remaining.toFixed(2)}`, col4X, yPosition);

  yPosition += 10;

  // Total Due Box
  pdf.setFillColor(0, 0, 0);
  pdf.rect(col3X - 2, yPosition, 60, 12, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("TOTAL DUE:", col3X, yPosition + 5);
  pdf.text(`$${remaining.toFixed(2)}`, col4X, yPosition + 5);

  yPosition += 18;

  // Payment Status
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("PAYMENT STATUS:", margin, yPosition);

  yPosition += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  const statusText =
    booking.paymentStatus === "completed"
      ? "PAID"
      : booking.paymentStatus === "partial"
      ? "PARTIALLY PAID"
      : "PENDING";
  const statusColorValue =
    booking.paymentStatus === "completed"
      ? [76, 175, 80]
      : booking.paymentStatus === "partial"
      ? [255, 193, 7]
      : [244, 67, 54];

  pdf.setTextColor(
    statusColorValue[0],
    statusColorValue[1],
    statusColorValue[2]
  );
  pdf.setFont("helvetica", "bold");
  pdf.text(statusText, margin, yPosition);

  yPosition += 8;

  // Terms & Conditions
  pdf.setTextColor(100, 100, 100);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  const termsY = pageHeight - 20;
  pdf.text("TERMS & CONDITIONS:", margin, termsY);

  const terms = [
    "1. Rental period begins at pickup time and ends at return time.",
    "2. Late returns will be charged at $50 per hour.",
    "3. Fuel must be returned at same level or charged at current market rate.",
    "4. Driver must maintain valid insurance coverage during rental period.",
  ];

  terms.forEach((term, index) => {
    pdf.text(term, margin + 2, termsY + 3 + index * 3, {
      maxWidth: contentWidth - 4,
    });
  });

  // Footer
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(8);
  pdf.text(
    `Generated on ${new Date().toLocaleString()}`,
    margin,
    pageHeight - 2
  );
  pdf.text(
    "Thank you for your business!",
    pageWidth - margin - 40,
    pageHeight - 2
  );

  return pdf;
}

export function openInvoicePreview(booking: InvoiceData): void {
  const pdf = generateInvoicePDF(booking);
  const pdfUrl = pdf.output("bloburi");

  if (typeof pdfUrl === "string") {
    window.open(pdfUrl, "_blank");
  }
}

export function downloadInvoice(booking: InvoiceData): void {
  const pdf = generateInvoicePDF(booking);
  const fileName = `Invoice-${
    booking.id || "booking"
  }-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
