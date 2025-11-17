import jsPDF from "jspdf";
import { Booking } from "@/types";

interface ReportData {
  userEmail: string;
  userName: string;
  bookings: (Booking & { id: string })[];
  generatedDate: Date;
}

export function generateBookingReport(data: ReportData): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.setFont("helvetica", options.weight || "normal");
    pdf.setFontSize(options.size || 12);
    pdf.setTextColor(options.color || [0, 0, 0]);
    pdf.text(text, x, y);
  };

  const addLine = (x1: number, y: number, x2: number) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(x1, y, x2, y);
  };

  // Header
  pdf.setFillColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, 25, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("BOOKING REPORT", margin + 5, yPosition + 10);

  pdf.setTextColor(180, 180, 180);
  pdf.setFontSize(10);
  pdf.text(
    `Generated: ${data.generatedDate.toLocaleString()}`,
    margin + 5,
    yPosition + 18
  );

  yPosition += 30;

  // User Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("USER INFORMATION", margin, yPosition);

  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Name: ${data.userName}`, margin + 2, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${data.userEmail}`, margin + 2, yPosition);

  yPosition += 10;
  addLine(margin, yPosition, pageWidth - margin);

  yPosition += 8;

  // Summary Statistics
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("SUMMARY STATISTICS", margin, yPosition);

  yPosition += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const stats = {
    totalBookings: data.bookings.length,
    completedBookings: data.bookings.filter((b) => b.status === "completed")
      .length,
    activeBookings: data.bookings.filter(
      (b) => b.status === "confirmed" || b.status === "in-progress"
    ).length,
    totalSpent: data.bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    totalDays: data.bookings.reduce((sum, b) => sum + (b.totalDays || 0), 0),
  };

  const statTexts = [
    `Total Bookings: ${stats.totalBookings}`,
    `Completed Bookings: ${stats.completedBookings}`,
    `Active Bookings: ${stats.activeBookings}`,
    `Total Amount Spent: $${stats.totalSpent.toFixed(2)}`,
    `Total Days Rented: ${stats.totalDays}`,
  ];

  statTexts.forEach((stat) => {
    pdf.text(stat, margin + 2, yPosition);
    yPosition += 5;
  });

  yPosition += 8;
  addLine(margin, yPosition, pageWidth - margin);

  yPosition += 10;

  // Bookings Table
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("BOOKING DETAILS", margin, yPosition);

  yPosition += 8;

  // Table Header
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, yPosition, contentWidth, 8, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);

  const col1 = margin + 2;
  const col2 = margin + 35;
  const col3 = margin + 60;
  const col4 = margin + 85;
  const col5 = margin + 115;
  const col6 = margin + 145;

  pdf.text("Vehicle", col1, yPosition + 5);
  pdf.text("Pickup Date", col2, yPosition + 5);
  pdf.text("Return Date", col3, yPosition + 5);
  pdf.text("Days", col4, yPosition + 5);
  pdf.text("Amount", col5, yPosition + 5);
  pdf.text("Status", col6, yPosition + 5);

  yPosition += 10;

  // Table Rows
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  const rowHeight = 6;
  let currentPage = 1;

  data.bookings.forEach((booking, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
      currentPage++;

      // Repeat table header on new page
      pdf.setFillColor(220, 220, 220);
      pdf.rect(margin, yPosition, contentWidth, 8, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("Vehicle", col1, yPosition + 5);
      pdf.text("Pickup Date", col2, yPosition + 5);
      pdf.text("Return Date", col3, yPosition + 5);
      pdf.text("Days", col4, yPosition + 5);
      pdf.text("Amount", col5, yPosition + 5);
      pdf.text("Status", col6, yPosition + 5);

      yPosition += 10;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
    }

    // Row background alternating
    if (index % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPosition - 1, contentWidth, rowHeight, "F");
    }

    const vehicle = booking.vehicleName || booking.vehicleType;
    pdf.text(vehicle.substring(0, 15), col1, yPosition);
    pdf.text(booking.pickupDate, col2, yPosition);
    pdf.text(booking.returnDate, col3, yPosition);
    pdf.text((booking.totalDays || 0).toString(), col4, yPosition);
    pdf.text(`$${(booking.totalPrice || 0).toFixed(2)}`, col5, yPosition);
    pdf.text(booking.status, col6, yPosition);

    yPosition += rowHeight;
  });

  // Footer
  yPosition = pageHeight - 10;
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(8);
  pdf.text(
    `Report generated on ${new Date().toLocaleString()}`,
    margin,
    yPosition
  );
  pdf.text(`Page ${currentPage}`, pageWidth - margin - 15, yPosition);

  return pdf;
}

export function openBookingReport(data: ReportData): void {
  const pdf = generateBookingReport(data);
  const pdfUrl = pdf.output("bloburi");

  if (typeof pdfUrl === "string") {
    window.open(pdfUrl, "_blank");
  }
}

export function downloadBookingReport(data: ReportData): void {
  const pdf = generateBookingReport(data);
  const fileName = `Booking-Report-${
    data.userName
  }-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
