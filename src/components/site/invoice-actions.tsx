"use client";

import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/context/site-config-context";
import { generateBookingInvoicePdf, downloadInvoicePdf, previewInvoicePdf } from "@/lib/invoice-pdf";
import type { Booking } from "@/lib/bookings";

export function InvoiceActions({ booking, size = "sm" }: { booking: Booking; size?: "sm" | "default" }) {
  const { config } = useSiteConfig();

  const build = () => generateBookingInvoicePdf(booking, config.footer);

  return (
    <div className="flex gap-2">
      <Button size={size} variant="outline" onClick={() => previewInvoicePdf(build())}>
        <Eye className="size-3.5" /> View invoice
      </Button>
      <Button
        size={size}
        variant="outline"
        onClick={() => downloadInvoicePdf(build(), `${booking.invoiceNumber}.pdf`)}
      >
        <Download className="size-3.5" /> Download
      </Button>
    </div>
  );
}
