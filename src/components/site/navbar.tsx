"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, ArrowUpRight, LogOut, Ticket, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/site/mode-toggle";
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
import { useSiteConfig } from "@/context/site-config-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { config } = useSiteConfig();
  const { user, role, signOut } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  const initials = user?.displayName
    ? user.displayName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "U";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md py-2.5"
          : "border-b border-transparent bg-transparent py-4"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm transition-transform group-hover:-rotate-6">
            DA
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {config.siteName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {config.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "Account"} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="size-4" /> Admin dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-bookings">
                    <Ticket className="size-4" /> My bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href="/fleet">
              Browse fleet <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{config.siteName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {config.nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                {user ? (
                  <>
                    {role === "admin" && (
                      <SheetClose asChild>
                        <Button variant="outline" asChild>
                          <Link href="/admin">
                            <LayoutDashboard className="size-4" /> Admin dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Button variant="outline" asChild>
                        <Link href="/my-bookings">
                          <Ticket className="size-4" /> My bookings
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={() => signOut()}>
                        <LogOut className="size-4" /> Sign out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/fleet">Browse fleet</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
