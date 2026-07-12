"use client";

import Link from "next/link";
import { ShieldAlert, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-6" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Sign in required</p>
          <p className="mt-1 text-sm text-muted-foreground">The admin dashboard needs an account.</p>
        </div>
        <Button asChild>
          <Link href="/login?redirect=/admin">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Access restricted</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            This account doesn't have admin access. Ask an existing admin to promote you from the
            Users tab, or set it directly in Firestore for the first account.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to site</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
