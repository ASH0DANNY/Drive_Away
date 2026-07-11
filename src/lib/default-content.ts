// Default content + theme for Drive Away.
// This file ships inside the bundle so the site renders fully-styled and
// fully-worded on first paint — before Firestore has responded. Once the
// live `siteConfig` doc loads, values here are silently replaced
// (stale-while-revalidate), never leaving a blank gap.

export type ThemeConfig = {
  mode: "light" | "dark" | "system";
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  radius: number; // rem
  contrast: "default" | "high";
  fontDisplay: "space-grotesk" | "sora" | "manrope";
  fontBody: "inter" | "system";
};

export const defaultTheme: ThemeConfig = {
  mode: "system",
  primary: "#FFB020",
  primaryForeground: "#14161A",
  secondary: "#12A594",
  secondaryForeground: "#FFFFFF",
  radius: 0.75,
  contrast: "default",
  fontDisplay: "space-grotesk",
  fontBody: "inter",
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  logoText: string;
  logoImageBase64: string | null; // optional small base64 override
  theme: ThemeConfig;
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string }[];
  };
  howItWorks: {
    heading: string;
    steps: { title: string; description: string }[];
  };
  features: {
    heading: string;
    subheading: string;
    items: { title: string; description: string }[];
  };
  testimonials: {
    heading: string;
    items: { quote: string; name: string; role: string }[];
  };
  cta: {
    heading: string;
    subheading: string;
    buttonLabel: string;
  };
  footer: {
    about: string;
    email: string;
    phone: string;
    address: string;
  };
};

export const defaultSiteConfig: SiteConfig = {
  siteName: "Drive Away",
  tagline: "Cars and bikes, ready when you are.",
  logoText: "Drive Away",
  logoImageBase64: null,
  theme: defaultTheme,
  nav: [
    { label: "Fleet", href: "/fleet" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  hero: {
    eyebrow: "Self-drive rentals, city-wide",
    headline: "Pick a route. Pick a ride.",
    subhead:
      "Drive Away puts a verified fleet of cars and bikes on your route in minutes — transparent pricing, no counter queues, no paperwork drawer.",
    ctaPrimary: "Browse the fleet",
    ctaSecondary: "How it works",
    stats: [
      { value: "420+", label: "Vehicles live" },
      { value: "18", label: "Cities" },
      { value: "4.8", label: "Avg. rating" },
    ],
  },
  howItWorks: {
    heading: "Three stops, then you're gone",
    steps: [
      {
        title: "Choose your ride",
        description:
          "Filter by type, transmission, seats or mileage and lock a car or bike for your dates.",
      },
      {
        title: "Verify & book",
        description:
          "Sign in, confirm your license details, and pay through our secure checkout.",
      },
      {
        title: "Pick up & go",
        description:
          "Scan in at pickup, do a 2-minute walkaround, and drive away — return anywhere in network.",
      },
    ],
  },
  features: {
    heading: "Built like a dashboard, not a brochure",
    subheading: "Everything about the rental is visible before you commit.",
    items: [
      {
        title: "Transparent pricing",
        description: "Per-day rate, deposit and fees shown upfront — no surprise line items at pickup.",
      },
      {
        title: "Verified fleet",
        description: "Every vehicle is inspected and logged before it's listed for rent.",
      },
      {
        title: "Flexible returns",
        description: "Return to any partner hub in the city, not just where you picked up.",
      },
      {
        title: "24/7 road support",
        description: "A support line and roadside assist on every booking, day or night.",
      },
    ],
  },
  testimonials: {
    heading: "On the road with Drive Away",
    items: [
      {
        quote:
          "Booked a bike for a weekend trip in four minutes flat. Pickup was faster than my coffee order.",
        name: "Ananya R.",
        role: "Bike rental, Pune",
      },
      {
        quote:
          "The price I saw at checkout is the price I paid at return. First rental company that's been that plain about it.",
        name: "Rohit M.",
        role: "Car rental, Bengaluru",
      },
      {
        quote:
          "Swapped return cities mid-trip without a call center fight. Genuinely useful for how I actually travel.",
        name: "Fatima S.",
        role: "Car rental, Delhi",
      },
    ],
  },
  cta: {
    heading: "Your next route starts here",
    subheading: "Browse live availability in your city — no account needed to look.",
    buttonLabel: "See what's available",
  },
  footer: {
    about:
      "Drive Away is a self-drive car and bike rental network built for short notice and long weekends alike.",
    email: "support@driveaway.app",
    phone: "+91 98765 43210",
    address: "12 MG Road, Patna, Bihar, India",
  },
};

// ---- Fleet fallback (keeps the "Browse Fleet" / homepage sections from
// ever rendering empty while the live `vehicles` collection loads) ----

export type VehicleType = "car" | "bike";

export type Vehicle = {
  id: string;
  type: VehicleType;
  name: string;
  category: string;
  pricePerDay: number;
  images: string[]; // Cloudinary URLs in production
  transmission?: "Manual" | "Automatic";
  fuel?: "Petrol" | "Diesel" | "Electric";
  seats?: number;
  rating: number;
  location: string;
  available: boolean;
};

export const defaultVehicles: Vehicle[] = [
  {
    id: "sample-car-1",
    type: "car",
    name: "Nova Hatch",
    category: "Hatchback",
    pricePerDay: 1499,
    images: [],
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    rating: 4.7,
    location: "Patna",
    available: true,
  },
  {
    id: "sample-car-2",
    type: "car",
    name: "Vantage Sedan",
    category: "Sedan",
    pricePerDay: 2199,
    images: [],
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    rating: 4.8,
    location: "Bengaluru",
    available: true,
  },
  {
    id: "sample-bike-1",
    type: "bike",
    name: "Ridgeline 350",
    category: "Cruiser",
    pricePerDay: 799,
    images: [],
    transmission: "Manual",
    fuel: "Petrol",
    seats: 2,
    rating: 4.6,
    location: "Pune",
    available: true,
  },
  {
    id: "sample-bike-2",
    type: "bike",
    name: "Volt-E City",
    category: "Electric Scooter",
    pricePerDay: 449,
    images: [],
    transmission: "Automatic",
    fuel: "Electric",
    seats: 2,
    rating: 4.5,
    location: "Delhi",
    available: true,
  },
];
