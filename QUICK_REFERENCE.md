# 🚀 Drive Away - Quick Reference Guide

## 📋 Quick Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Common Tasks
npm install              # Install dependencies
rm -rf node_modules      # Clear node_modules
npm audit fix            # Fix vulnerabilities
```

## 🌐 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| About | http://localhost:3000/about |
| Services | http://localhost:3000/services |
| Contact | http://localhost:3000/contact |
| Booking | http://localhost:3000/booking |
| Sitemap | http://localhost:3000/sitemap.xml |
| Robots | http://localhost:3000/robots.txt |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables |
| `config/theme.ts` | Design tokens |
| `config/app-config.ts` | App configuration |
| `app/globals.css` | Global styles |
| `app/layout.tsx` | Root layout |
| `package.json` | Dependencies |

## 🔧 Configuration

### Update App Name & Details
Edit `.env.local`:
```env
NEXT_PUBLIC_APP_NAME=Your Company
NEXT_PUBLIC_APP_EMAIL=email@example.com
NEXT_PUBLIC_APP_MOBILE=+1-555-0123
NEXT_PUBLIC_APP_ADDRESS=123 Main St, City, State ZIP
```

### Update Colors
Edit `config/theme.ts`:
```typescript
colors: {
  primary: "#YOUR_COLOR",
  secondary: "#YOUR_COLOR",
  // ...
}
```

### Firebase Credentials
Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

## 📚 Component Usage

### Import Components
```typescript
import Header from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialGrid } from "@/components/TestimonialCard";
import ReservationForm from "@/components/ReservationForm";
```

### ServiceCard Example
```typescript
<ServiceCard
  title="Economy Cars"
  description="Budget-friendly transportation"
  icon={<FaCar />}
  features={["Feature 1", "Feature 2"]}
  price="$25/day"
/>
```

### ReservationForm
```typescript
<ReservationForm />
// Automatically handles submission to /api/bookings
```

## 🔌 API Usage

### Create Booking
```javascript
const response = await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    vehicleType: "car",
    pickupDate: "2025-12-20",
    returnDate: "2025-12-25",
    message: "Optional message"
  })
});
```

### Get Vehicles
```javascript
const response = await fetch("/api/vehicles");
const { vehicles } = await response.json();
```

## 📱 Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px    /* Mobile */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large Desktop */
```

## 🎨 Tailwind Classes

### Common Classes
```css
/* Buttons */
btn-primary        /* Black button */
btn-secondary      /* Gray button */
btn-outline        /* Black outline button */

/* Text */
section-title      /* Large heading */
section-subtitle   /* Subtitle text */

/* Layout */
container-section  /* Full-width section */
card              /* Styled card */

/* Forms */
input-field       /* Form input */
badge             /* Small badge */
```

## 🔐 Environment Variables

### Public Variables (Client-Side)
All variables prefixed with `NEXT_PUBLIC_` are available in the browser.

**Example:**
```
NEXT_PUBLIC_APP_NAME → process.env.NEXT_PUBLIC_APP_NAME
```

### Private Variables (Server-Only)
Variables without `NEXT_PUBLIC_` prefix are private and server-only.

## 🧪 Testing the Website

### Test Booking Form
1. Navigate to `/booking`
2. Fill in the form
3. Submit to test `/api/bookings`

### Test Contact Form
1. Navigate to `/contact`
2. Fill in the form
3. Submit to test `/api/contact`

### Test Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Add Firebase credentials
- [ ] Customize company information
- [ ] Update theme colors (optional)
- [ ] Add company logo/images
- [ ] Test all forms
- [ ] Test on mobile
- [ ] Check SEO metadata
- [ ] Review all content
- [ ] Setup email notifications
- [ ] Deploy to production

## 📊 Firebase Collections

Create these collections in Firestore:

```javascript
// Collection: users
{
  uid: "string",
  email: "string",
  displayName: "string",
  createdAt: "timestamp"
}

// Collection: bookings
{
  name: "string",
  email: "string",
  phone: "string",
  vehicleType: "string",
  pickupDate: "string",
  returnDate: "string",
  status: "pending|confirmed|completed|cancelled",
  createdAt: "timestamp"
}

// Collection: vehicles
{
  name: "string",
  type: "car|bike",
  category: "string",
  price: "number",
  image: "string",
  features: ["string"],
  isAvailable: "boolean",
  createdAt: "timestamp"
}
```

## 🆘 Troubleshooting

### Port 3000 in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Firebase Connection Error
- Verify `.env.local` has correct credentials
- Check Firebase console project settings
- Ensure Firestore database is created

### Build Errors
```bash
npm install
npm run build
```

## 📖 Documentation Files

- `README.md` - Project overview
- `README-FULL.md` - Complete documentation
- `SETUP_GUIDE.md` - Firebase & deployment
- `FEATURES.md` - Feature showcase
- `COMPLETION_SUMMARY.md` - What's included
- `QUICK_REFERENCE.md` - This file

## 🎓 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 💡 Pro Tips

1. **Use VS Code Extensions**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Firebase Explorer

2. **Performance Tips**
   - Use Image component from Next.js
   - Enable static generation where possible
   - Monitor bundle size

3. **SEO Tips**
   - Update metadata on each page
   - Use semantic HTML
   - Add alt text to images
   - Submit sitemap to Google

4. **Firebase Tips**
   - Use security rules in production
   - Monitor Firebase usage
   - Set up billing alerts
   - Regular backups

## 🎯 Next Steps

1. ✅ Setup Firebase
2. ✅ Customize app config
3. ✅ Test locally
4. ✅ Deploy to production
5. 🎯 Add payment system
6. 🎯 Email notifications
7. 🎯 Admin dashboard

---

**Need more help? Check the documentation files!** 📚
