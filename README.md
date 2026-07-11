# Drive Away — Phase 1 + 2: Foundation, Homepage, Fleet & Vehicle Detail

Phase 1 (foundation + homepage) and Phase 2 (fleet listing + vehicle detail
pages) are done. Auth, the real booking + dummy payment flow, and the admin
dashboard are next (see bottom of this file).

## What's new in Phase 2

- `/fleet` — full listing with a type toggle (All/Car/Bike), search, city
  filter, and sort (recommended/price/rating), all client-side over the
  live `vehicles` collection. Empty-state card if filters match nothing.
- `/fleet/[id]` — vehicle detail page: image gallery with thumbnails
  (graceful placeholder when no Cloudinary images are set yet), specs,
  description, feature list, a live booking widget (date range → day
  count → price breakdown with service fee + refundable deposit), and a
  "more like this" row.
- `/booking/[id]` — placeholder for now. The Reserve button already routes
  here with the selected dates in the URL; this becomes the real
  checkout + dummy payment gateway in the next phase, so nothing dead-ends
  in the meantime.
- Sample fleet expanded to 8 vehicles (4 cars, 4 bikes) with descriptions
  and feature lists, so the fallback data now exercises every part of the
  detail page even before Firestore has real listings.
- New shadcn-style primitives: Input, Label, Tabs, Select (Radix-based,
  same conventions as Phase 1).

## Everything from Phase 1 still applies
See the "Getting it running", "Design direction", "Theming, explained",
and Cloudinary/Firebase setup notes below — unchanged.

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

1. **Auth** — email/password with Firebase email verification, Google
   sign-in, protected "My Bookings"
2. **Booking flow + dummy payment** — real checkout page, fake payment
   gateway page, payment-approve/result page, Firestore booking record
   (replaces the `/booking/[id]` placeholder)
3. **Admin dashboard** (shadcn-heavy) — Content Manager, Theme Manager
   (live color/contrast/font/radius editor), Fleet Manager (Cloudinary
   upload), Bookings Manager, Users Manager, all behind Firebase Auth +
   role check
4. **Polish + deploy** — responsiveness pass, Vercel deploy, Firestore
   Security Rules
