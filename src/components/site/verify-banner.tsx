"use client";

import * as React from "react";
import { toast } from "sonner";
import { MailWarning } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function VerifyBanner() {
  const { user, isVerified, resendVerification } = useAuth();
  const [sending, setSending] = React.useState(false);

  if (!user || isVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      toast.success("Verification email sent — check your inbox.");
    } catch {
      toast.error("Couldn't send that right now. Try again shortly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-primary/10 px-4 py-2.5 text-center text-sm text-foreground">
      <span className="flex items-center gap-1.5">
        <MailWarning className="size-4 text-primary" />
        Verify your email to complete a booking.
      </span>
      <button
        onClick={handleResend}
        disabled={sending}
        className="font-medium text-primary underline-offset-2 hover:underline disabled:opacity-50"
      >
        {sending ? "Sending…" : "Resend link"}
      </button>
    </div>
  );
}
