# Drive Away

A full-stack self-drive car & bike rental platform: public marketing site,
live-editable content and theme, fleet browsing, auth, booking + a dummy
payment gateway, coupons, offline/walk-in billing, PDF invoices, and a
complete admin dashboard — built on Next.js + Firebase (Spark/free plan)
with zero server cost.

## Getting it running

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Firebase Console setup (do this first)
In the Firebase Console for `drive-away-77747`:
1. **Authentication → Sign-in method** — enable **Email/Password** and **Google**.
2. **Authentication → Settings → Authorized domains** — `localhost` is there
   by default; add your Vercel domain once deployed.
3. **Firestore Database** — create the database if you haven't yet
   (Production mode is fine), then paste `firestore.rules` (project root)
   into the Rules tab so bookings/users/coupons are actually protected.

### Bootstrapping your first admin
1. Sign up for an account normally on the live site (`/signup`).
2. In Firebase Console → Firestore Database, find `users/{your-uid}`
   (match by email) and manually change its `role` field from
   `"customer"` to `"admin"`.
3. Refresh `/admin` — you're in. From here on, promote anyone else from
   the Users tab instead of editing Firestore by hand.

### Cloudinary (for vehicle photos)
Create a free account at cloudinary.com, then Settings → Upload → Upload
presets → add an **unsigned** preset. Put the cloud name and preset name
into `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

This lets the admin dashboard upload images directly from the browser to
Cloudinary — no server or API route involved, so it stays free.

### Firebase config keys
The keys in `.env.local` are the standard *public* web config — this is
normal, Firebase enforces access via Security Rules (`firestore.rules`),
not by hiding these values.

---

## What's built

### Public site
- Animated homepage — "The Route" design system (Asphalt/Cloud dual theme,
  Route Amber + Ignition Teal accents), a dashed scroll-linked route line
  as the signature animation, draggable hero cards, scroll-reveal sections
- `/fleet` — type/search/city/sort filters over the live vehicle list
- `/fleet/[id]` — gallery, specs, description, live-calculating booking
  widget
- Never blank on load: hardcoded defaults in `src/lib/default-content.ts`
  render instantly, then silently upgrade once Firestore responds

### Auth
- Email/password with real Firebase email verification, Google sign-in,
  password reset — `src/context/auth-context.tsx`
- Every signed-in user gets a `users/{uid}` doc defaulted to
  `role: "customer"` (`src/lib/user-doc.ts`) — roles are only ever changed
  by an admin, never self-assigned
- A banner prompts unverified users to confirm their email before booking

### Booking + payment
- `/booking/[id]` — real checkout: driver details, terms checkbox, a promo
  code field, live price summary. Behavior depends on the admin's online
  payments setting (see below).
- `/payment/[id]` — dummy payment gateway: Card/UPI/Wallet tabs with
  card-number/expiry formatting, a processing-progress animation, and a
  "simulate a failed payment" link for testing that path
- `/payment/[id]/result` — animated success/failure/pay-at-pickup state,
  derived live from the booking record, with invoice actions when paid
- `/my-bookings` — the signed-in user's bookings with status-aware actions

### Coupons
- `/admin/coupons` — percentage or fixed-₹ codes, new-customer-only
  restriction, minimum rental amount, usage caps, expiry dates, active
  toggle
- Validated live at checkout (including a first-booking check for
  new-customer-only codes); redemption increments the coupon's use count
  at booking time
- *Known trade-off:* validation + the use-count increment are two separate
  client-side calls rather than one server transaction, so a heavily
  contended maxUses code could theoretically be over-redeemed by a few
  under simultaneous use. Not a concern at rental-fleet scale; a Cloud
  Function would close the gap if you ever need it airtight.

### Online payments toggle + offline/walk-in billing
- `/admin/settings` — one switch turns the dummy payment gateway off
  site-wide; checkout then reserves the vehicle with "pay at pickup"
  messaging instead of routing through `/payment/[id]`
- `/admin/bookings` → "Mark paid" on any unpaid booking opens a dialog to
  apply a percentage or fixed-₹ discount at the counter before confirming
- `/admin/billing` — a small POS-style form for true walk-ins who never
  booked online: pick the vehicle, dates, customer details, an optional
  discount, and "Record booking & mark paid" creates an already-confirmed,
  already-paid booking with an invoice ready immediately

### Invoices
- `src/lib/invoice-pdf.ts` (jsPDF + jspdf-autotable) generates a PDF for
  every paid booking — business details, customer + rental details,
  payment method/transaction id, an itemized rate/discount/total table,
  the deposit/service-fee breakdown, and your configured terms
- "View invoice" opens it in a new tab; "Download" saves the file. These
  buttons appear on the payment success page, My Bookings, and every paid
  row in the admin Bookings Manager and Offline Billing
- Business/invoice details (legal name, Tax ID/GSTIN, address, terms) are
  managed once in Content Manager's Footer tab and feed both the website
  footer and every invoice

### Admin dashboard (`/admin`)
Guarded by `AdminGuard` (`src/components/admin/admin-guard.tsx`):
signed-out → prompted to sign in; signed-in but not an admin → clear
"access restricted" message.

- **Overview** — stat cards (vehicles, confirmed bookings, revenue,
  awaiting payment) from bounded aggregation queries, plus a small recent-
  bookings feed
- **Content** — tabbed editor (Site & nav, Hero, How it works, Features,
  Testimonials, CTA, Footer) covering every homepage text block, with
  add/remove for repeating items (nav links, stats, steps, features,
  testimonials) via a shared `RepeatingListEditor`. Saves merge-write only
  the sections you touched.
- **Theme** — primary/secondary color pickers, radius slider, contrast
  switch, font selects, default light/dark/system. Live-previews across
  the whole admin UI as you edit, reverts if you navigate away without
  saving, one-click reset to default.
  - *Known trade-off:* the "default appearance for new visitors" setting
    is applied client-side via a cached theme copy, not server-rendered —
    it can't force a mode before Firestore has loaded on a visitor's very
    first-ever page view, and falls back to "match device" until then. A
    fully server-driven default would need an edge/middleware layer,
    out of scope for a zero-server-cost build.
- **Fleet** — add/edit/delete vehicles; multi-photo uploader (straight to
  Cloudinary from the browser, no server) with cover-photo selection and
  removal — add as many angles as you want per vehicle
- **Coupons**, **Offline billing**, **Bookings**, **Users**, **Settings**
  — see sections above

## Firestore read/write efficiency

Real-time listeners (`onSnapshot`) are used where they're naturally
bounded and benefit from being live: `siteConfig` (1 doc), a single
vehicle/booking, and a signed-in customer's own bookings (scoped to one
person, capped at 50).

Admin views that touch collections which grow **without bound** over time
(bookings, users) do **not** use live listeners reading the whole
collection — that cost scales as `(collection size) × (page opens)`,
which gets expensive fast on Firestore's free 50K-reads/day quota:

- **`src/lib/hooks/use-paginated-query.ts`** — a generic one-time,
  paginated query hook (fixed page size, explicit `loadMore()` /
  `refresh()`) used by the Bookings and Users managers. Cost per page view
  is a flat ~20–25 documents, not the whole collection.
- **`src/lib/admin-stats.ts`** — Overview's stat cards come from Firestore
  **aggregation queries** (`getCountFromServer`, `getAggregateFromServer`
  + `sum()`) instead of reading every booking to count/sum client-side.
- **`useVehicles()`** has a default cap (300) when no explicit limit is
  passed, bounding the public `/fleet` page's client-side filtering.
- Trade-off: admin tables that moved off live listeners now have an
  explicit **Refresh** button (and **Load more** where paginated) instead
  of updating instantly on every change elsewhere.

**Note on the Bookings status filter:** combining `where("status","==",…)`
with `orderBy("createdAt")` is a compound query — the first time you use
that filter against a live project, Firestore may show an error with a
direct link to create the required composite index. Click it, wait a
minute for the index to build, and it won't happen again. Normal Firestore
behavior, not a bug.

(Redux/similar state libraries wouldn't have addressed this — they manage
client-side state, not the number of documents read from the database.
The fix is bounding and reusing the actual queries, which is what the
above does.)

## Design direction ("The Route")
- Palette: Asphalt (#14161A) / Cloud (#F6F5F2) neutrals, Route Amber
  (#FFB020) primary, Ignition Teal (#12A594) secondary — all admin-editable
- Type: Space Grotesk (display) + Inter (body) + JetBrains Mono (prices,
  data, stats)
- Signature element: a dashed route line runs down the homepage spine with
  a marker that travels along it as you scroll

## Theming, explained
Two independent systems so they can't fight each other:
1. **Light/dark mode** (`next-themes`) — toggles a `.dark` class on
   `<html>`, controlling only the neutral palette (background, foreground,
   card, border, muted).
2. **Brand theme** (admin-editable) — primary/secondary colors, radius,
   contrast, fonts — applied as CSS custom properties on `<html>`, sourced
   from Firestore `siteConfig/main`, cached in `localStorage`, and
   re-applied by an inline `<script>` in `<head>` before hydration so
   there's no flash of the wrong theme on repeat visits.

## Notes on the build environment
- shadcn's CLI registry wasn't reachable from the build sandbox, so all UI
  primitives (Button, Card, Sheet, Table, Dialog, etc.) were hand-built on
  Radix UI following the exact conventions shadcn generates — they behave
  identically, and `npx shadcn@latest add <component>` still works locally
  to add more.
- Google Fonts also wasn't reachable from the sandbox, so the final build
  couldn't be visually previewed there — verified instead with a temporary
  font stub, then restored the real `next/font/google` setup, which is
  standard and just works with normal internet access.

## What's left: polish + deploy
1. Fill in real Cloudinary credentials in `.env.local`
2. Push to GitHub, import into Vercel, add the same env vars there
3. Add your Vercel domain to Firebase Console → Authentication → Settings
   → Authorized domains
4. Optional polish: a dedicated 404 page, an OpenGraph image for link
   previews, pagination on the public `/fleet` page once the fleet is
   large enough to need server-side filtering instead of client-side
