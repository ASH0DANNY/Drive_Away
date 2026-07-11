# Drive Away — Phase 1–3: Foundation, Homepage, Fleet, Auth, Booking & Dummy Payment

Phases 1–3 are done: foundation + homepage, fleet + vehicle detail, and now
full auth with a real booking → dummy payment → confirmation flow. The
admin dashboard is next (see bottom of this file).

## What's new in Phase 3

**Auth**
- Email/password sign-up (triggers Firebase's built-in verification email)
  and sign-in, plus Google sign-in — all via `src/context/auth-context.tsx`
- Every signed-in user gets a `users/{uid}` Firestore doc created on first
  login, defaulted to `role: "customer"` (see `src/lib/user-doc.ts`) — this
  is what the admin dashboard will use for role checks later
- Password reset (forgot-password on the login page)
- A dismiss-proof banner prompts unverified users to confirm their email,
  with a resend button (`src/components/site/verify-banner.tsx`)
- Navbar swaps between Sign in / an avatar dropdown (My bookings, Sign out)
  based on auth state

**Booking + dummy payment flow**
- `/booking/[id]` is now the real checkout: driver details form, terms
  checkbox, live price summary, gated behind sign-in and email
  verification. Submitting creates a `bookings` Firestore document.
- `/payment/[id]` — the dummy payment gateway: Card / UPI / Wallet tabs
  (cosmetic — card number/expiry auto-formatting, no real validation
  beyond "looks filled in"), an **Approve payment** button that simulates
  processing with a progress bar, and a "simulate a failed payment" link
  for testing the failure path. Writes a `payments` record and updates the
  booking's status either way.
- `/payment/[id]/result` — animated success/failure screen reading the
  live booking record, with "View my bookings" / "Try again" CTAs.
- `/my-bookings` — protected page listing the signed-in user's bookings
  with status-aware actions (Complete payment / Retry payment / View
  receipt).

**Other**
- `firestore.rules` added at the project root — not deployed automatically
  (you'll need to paste it into Firebase Console → Firestore → Rules, or
  deploy via the Firebase CLI). It's written for the exact access pattern
  this app uses: public read on site content/fleet, users only touching
  their own bookings, and an `isAdmin()` check ready for the dashboard
  phase.
- New shadcn-style primitives: Checkbox, Progress, Avatar, DropdownMenu.

## Everything from Phases 1–2 still applies
See "Getting it running", "Design direction", "Theming, explained", and
Cloudinary/Firebase setup notes below — unchanged.

## Getting it running

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Cloudinary (for vehicle images — Phase 3+)
Create a free account at cloudinary.com, then Settings → Upload → Upload
presets → add an **unsigned** preset. Put the cloud name and preset name
into `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

This lets the admin dashboard upload images directly from the browser to
Cloudinary — no server or API route involved, so it stays free.

### Firebase Security Rules
Your Firebase config keys in `.env.local` are the standard public web
config (this is normal — Firebase enforces access via Security Rules, not
by hiding these values). Before going further we'll need to write
Firestore rules so that:
- anyone can read `siteConfig` and `vehicles`
- only signed-in users can create `bookings`/`payments` for themselves
- only users with `role: "admin"` in their `users/{uid}` doc can write to
  `siteConfig`, `vehicles`, or read all bookings

This will ship as part of the admin dashboard phase.

## Theming, explained

Two independent systems, so they can't fight each other:

1. **Light/dark mode** (`next-themes`) — toggles a `.dark` class on
   `<html>`. Controls the neutral palette only (background, foreground,
   card, border, muted).
2. **Brand theme** (admin-editable) — primary/secondary colors, radius,
   contrast, fonts. Applied as CSS custom properties
   (`--da-primary`, etc.) directly on `<html>`, sourced from Firestore
   `siteConfig/main`, cached in `localStorage`, and re-applied by an
   inline `<script>` in `<head>` before hydration so there's no flash of
   the wrong theme on repeat visits.

The admin Theme Manager (coming in the dashboard phase) will just write to
that same Firestore doc — every connected browser updates live.

## Before testing auth locally

In the Firebase Console for `drive-away-77747`:
1. **Authentication → Sign-in method** — enable **Email/Password** and
   **Google**.
2. **Authentication → Settings → Authorized domains** — `localhost` is
   there by default; add your Vercel domain once deployed.
3. **Firestore Database** — create the database if you haven't yet
   (Production mode is fine), then paste `firestore.rules` into the Rules
   tab so bookings/users are actually protected.

## Next phases

1. **Admin dashboard** (shadcn-heavy) — Content Manager, Theme Manager
   (live color/contrast/font/radius editor), Fleet Manager (Cloudinary
   upload), Bookings Manager, Users Manager, all behind Firebase Auth +
   the `isAdmin()` rule already written
2. **Polish + deploy** — responsiveness pass, Vercel deploy
