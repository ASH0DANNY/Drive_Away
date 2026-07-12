# Drive Away — Phase 1–4: Full Build (Public site, Auth, Booking/Payment, Admin Dashboard)

All four planned phases are done. What's left is polish and deploy (see
bottom of this file).

## What's new in Phase 4 — Admin Dashboard

Everything lives at `/admin`, guarded by `AdminGuard`
(`src/components/admin/admin-guard.tsx`): signed-out → prompted to sign
in; signed-in but not an admin → clear "access restricted" message rather
than a silent redirect.

**⚠️ Bootstrapping your first admin (do this before anything else works):**
1. Sign up for an account normally on the live site (`/signup`).
2. In Firebase Console → Firestore Database, find `users/{your-uid}`
   (match by email) and manually change its `role` field from
   `"customer"` to `"admin"`.
3. Refresh `/admin` — you're in. From here on, promote anyone else from
   the Users tab instead of editing Firestore by hand.

**Overview** (`/admin`) — live stat cards (vehicles listed, confirmed
bookings, revenue from paid bookings, awaiting-payment count) and a
recent-bookings feed, computed from the same Firestore collections the
public site reads.

**Content** (`/admin/content`) — tabbed editor (Site & nav, Hero, How it
works, Features, Testimonials, CTA, Footer) covering every piece of copy
on the homepage, including add/remove for repeating items (nav links,
hero stats, steps, features, testimonials) via a shared
`RepeatingListEditor`. Saves merge-write only the sections you touched,
so editing Content can't accidentally clobber a Theme change made from
another tab/session.

**Theme** (`/admin/theme`) — primary/secondary color pickers (native color
input + synced hex field), a corner-radius slider, a high-contrast switch,
display/body font selects, and a "default appearance for new visitors"
select (light/dark/match device). Every change previews live across the
whole admin dashboard immediately via CSS custom properties, reverts
automatically if you navigate away without saving, and "Reset to default"
restores the built-in palette. Saving publishes to every visitor instantly
through the same Firestore `siteConfig` doc + `SiteConfigProvider` the
public site already listens to.
  - *Known trade-off:* the "default appearance for new visitors" setting
    is applied client-side (via a cached copy of your last theme), not
    server-rendered — so it can't force a specific mode before Firestore
    has loaded, and instead falls back to "match device" on a visitor's
    very first-ever page load. A fully server-driven default would need a
    small edge/middleware layer, which is out of scope for a
    zero-server-cost build.

**Fleet** (`/admin/fleet`) — table of every vehicle with Edit/Delete;
"Add vehicle" opens a full form (type, name, category, price, seats,
rating, transmission, fuel, city, description, one-feature-per-line list,
availability toggle) plus a photo uploader that sends files straight from
the browser to Cloudinary (no server involved) and lets you pick the cover
photo. Editing one of the bundled sample vehicles for the first time
promotes it into real Firestore data under the same id.

**Bookings** (`/admin/bookings`) — every booking across all customers,
filterable by status, with inline selects to change both booking status
and payment status by hand (e.g. manually confirming a booking, or
marking one cancelled).

**Users** (`/admin/users`) — every account with a role selector
(Customer/Admin). Demoting your own account asks for confirmation first.

## Before testing admin locally
Same Firebase Console setup as Phase 3 (Auth providers + Firestore +
`firestore.rules`), plus the bootstrap step above. Cloudinary env vars are
also needed for the Fleet photo uploader to work — see the Cloudinary
section below.

## Everything from Phases 1–3 still applies
See "Getting it running", "Design direction", "Theming, explained", and
Cloudinary/Firebase setup notes below — unchanged.

## Getting it running

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

## What's left: polish + deploy

1. Paste `firestore.rules` into Firebase Console (if you haven't already)
   so bookings/users/admin writes are actually enforced in production
2. Fill in real Cloudinary credentials in `.env.local`
3. Push to GitHub, import into Vercel, add the same env vars there
4. Add your Vercel domain to Firebase Console → Authentication →
   Settings → Authorized domains
5. Optional polish ideas: pagination on the Fleet/Bookings/Users tables
   once you have real volume, a dedicated 404 page, OpenGraph image for
   link previews
