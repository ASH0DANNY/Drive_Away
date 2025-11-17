# 🚗 Drive Away - Car & Bike Rental Platform

A modern, SEO-friendly car and bike rental website built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Firebase. Features a clean white and gray design with interactive UI and full booking management system.

## ✨ Key Features

### 🎯 Core Features
- **Responsive Design**: Mobile-first approach with clean white and gray theme
- **Interactive Booking System**: Easy-to-use reservation form with vehicle type selection
- **Vehicle Management**: Browse cars and bikes with detailed specifications
- **User-Friendly UI**: Modern component-based architecture with smooth animations
- **SEO Optimized**: Built-in SEO best practices with metadata, sitemap, and schema markup
- **Firebase Backend**: Real-time database, authentication, and cloud storage integration

### 🔧 Technical Stack
- **Next.js 16**: Latest App Router with server/client components
- **React 19**: Modern component architecture
- **Firebase**: Authentication, Firestore, Cloud Storage
- **Tailwind CSS v4**: Utility-first styling with custom theme
- **TypeScript**: Full type safety
- **React Icons**: Beautiful icon library

## 📁 Project Structure

```
Drive_Away/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── services/page.tsx        # Services
│   ├── contact/page.tsx         # Contact
│   ├── booking/page.tsx         # Booking
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   ├── robots.ts                # SEO robots.txt
│   └── sitemap.ts               # SEO sitemap
├── components/                   # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ReservationForm.tsx
│   ├── ServiceCard.tsx
│   ├── TestimonialCard.tsx
│   └── VehicleCard.tsx
├── config/                       # Configuration
│   ├── theme.ts                 # Design tokens
│   └── app-config.ts            # App settings
├── lib/                          # Utilities & Services
│   ├── firebase.ts
│   ├── schema.ts
│   └── services/
│       ├── auth.ts
│       ├── bookings.ts
│       └── vehicles.ts
├── public/                       # Static assets
└── .env.local                   # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account (free tier available)

### Installation

```bash
# 1. Navigate to project
cd /workspaces/Drive_Away

# 2. Install dependencies
npm install

# 3. Setup Firebase credentials in .env.local
# Update the Firebase config values

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🎨 Theme Configuration

### Color Palette
- **Primary**: Black (#000000)
- **Secondary**: Gray (#6B7280)
- **Light**: Light Gray (#F3F4F6)
- **Lighter**: White (#FFFFFF)
- **Accent**: Dark Gray (#1F2937)

## 📊 Firebase Collections

### Users
```typescript
{
  uid: string
  email: string
  displayName: string
  phoneNumber?: string
  address?: string
  createdAt: string
}
```

### Bookings
```typescript
{
  name: string
  email: string
  phone: string
  vehicleType: "car" | "bike"
  pickupDate: string
  returnDate: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalPrice?: number
  createdAt: Timestamp
}
```

### Vehicles
```typescript
{
  name: string
  type: "car" | "bike"
  category: string
  price: number
  image: string
  description: string
  features: string[]
  isAvailable: boolean
  createdAt: Timestamp
}
```

## 🔍 SEO Features

- ✅ Meta tags and Open Graph
- ✅ Structured data (JSON-LD Schema)
- ✅ Dynamic sitemap
- ✅ robots.txt
- ✅ Mobile viewport
- ✅ Semantic HTML
- ✅ Performance optimized
- ✅ Image lazy loading

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, fleet, booking form, testimonials |
| About | `/about` | Company story, stats, team, values |
| Services | `/services` | Rental plans, vehicle types, features |
| Contact | `/contact` | Contact form, map, business hours |
| Booking | `/booking` | Dedicated booking page |

## 🛠 API Endpoints

### Bookings
```
POST   /api/bookings          # Create booking
GET    /api/bookings?email=   # Get user bookings
```

### Vehicles
```
GET    /api/vehicles?type=    # Get vehicles
```

### Contact
```
POST   /api/contact           # Send message
```

## 🔐 Environment Variables

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App Config
NEXT_PUBLIC_APP_NAME=Drive Away
NEXT_PUBLIC_APP_EMAIL=contact@driveaway.com
NEXT_PUBLIC_APP_MOBILE=+1 (555) 123-4567
NEXT_PUBLIC_APP_ADDRESS=123 Main Street, New York, NY 10001
NEXT_PUBLIC_APP_DESCRIPTION=Premium car and bike rental services

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/driveaway
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/driveaway
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/driveaway
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/driveaway
```

## 🏗 Building & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎯 Components Overview

### Header
Sticky navigation with mobile hamburger menu and CTA button

### Footer
Links, contact info, social media, and copyright

### ReservationForm
Multi-step form with validation and date picker

### ServiceCard
Displays service/vehicle with icon, description, and features

### VehicleCard
Vehicle listing with image, specs, and booking button

### TestimonialCard
Customer reviews with star ratings

## 🔄 State Management

- ✅ React hooks (useState, useContext)
- ✅ Firebase real-time updates
- ✅ URL query parameters for navigation
- 📋 TODO: Redux Toolkit integration

## 🚀 Performance Features

- ✅ Next.js automatic code splitting
- ✅ Image optimization
- ✅ CSS-in-JS with Tailwind
- ✅ Font optimization
- ✅ Link prefetching
- ✅ Smooth animations

## 🔮 Future Enhancements

- [ ] Payment gateway (Stripe/PayPal)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Real-time availability
- [ ] Customer ratings/reviews
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Vehicle tracking

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

Contact: contact@driveaway.com  
Website: https://driveaway.com

---

**Built with ❤️ using Next.js, React & Firebase**
