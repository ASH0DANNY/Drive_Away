# Drive Away — Phase 1: Foundation + Public Homepage

This is Phase 1 of the full build. It includes the project foundation and a
complete, animated homepage. Auth, the fleet/booking pages, dummy payment
flow, and the admin dashboard are the next phases (see bottom of this file).

## What's in this phase

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Hand-built shadcn-style UI primitives (Button, Card, Badge, Sheet,
  Separator, Skeleton, Sonner toasts) — the shadcn CLI registry wasn't
  reachable from the build sandbox, so these were written by hand following
  the exact same conventions shadcn generates. They behave identically and
  `npx shadcn@latest add <component>` will still work for you locally to
  add more.
- Firebase (Auth + Firestore) wired up with your project credentials in
  `.env.local`
- Full design-token theme system in `src/app/globals.css` — see "Theme
  system" below
- Live-editable site content via `src/context/site-config-context.tsx`,
  backed by Firestore doc `siteConfig/main`, with hardcoded defaults in
  `src/lib/default-content.ts` so the site is never blank/unstyled on
  first load, even before Firestore responds or if it's offline
- Signature scroll animation: a dashed "route line" runs down the homepage
  spine with a marker that travels along it as you scroll
  (`src/components/site/route-spine.tsx`)
- Scroll-reveal, draggable hero cards, animated nav, animated theme toggle
  (Framer Motion throughout)
- Sample fleet fallback (`defaultVehicles`) so vehicle grids are never
  empty before the real `vehicles` Firestore collection has data

## Design direction ("The Route")

- Palette: Asphalt (#14161A) / Cloud (#F6F5F2) neutrals, Route Amber
  (#FFB020) primary, Ignition Teal (#12A594) secondary
- Type: Space Grotesk (display) + Inter (body) + JetBrains Mono (prices,
  data, stats)
- Signature element: the route-line scroll spine described above

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

## Next phases

1. **Fleet + vehicle detail pages** — filters, search, sort, gallery
2. **Auth** — email/password with Firebase email verification, Google
   sign-in, protected "My Bookings"
3. **Booking flow + dummy payment** — checkout, fake payment gateway page,
   payment-approve/result page, Firestore booking record
4. **Admin dashboard** (shadcn-heavy) — Content Manager, Theme Manager
   (live color/contrast/font/radius editor), Fleet Manager (Cloudinary
   upload), Bookings Manager, Users Manager, all behind Firebase Auth +
   role check
5. **Polish + deploy** — responsiveness pass, Vercel deploy, Firestore
   Security Rules
