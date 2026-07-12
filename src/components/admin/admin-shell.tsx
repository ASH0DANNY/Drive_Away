"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/site/mode-toggle";
import { AdminNavLinks } from "@/components/admin/admin-nav-links";
import { useAuth } from "@/context/auth-context";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const initials = user?.displayName
    ? user.displayName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "A";

  return (
    <div className="min-h-screen bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xs font-bold">
            DA
          </span>
          <span className="font-display text-sm font-semibold">Drive Away Admin</span>
        </div>
        <div className="p-3">
          <AdminNavLinks />
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Drive Away Admin</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SheetClose asChild>
                    <div>
                      <AdminNavLinks />
                    </div>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-display text-sm font-semibold">Admin</span>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar>
                    <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Back to site</Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
