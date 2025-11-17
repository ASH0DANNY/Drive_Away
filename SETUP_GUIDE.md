# 🚀 Drive Away - Setup & Configuration Guide

## Firebase Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `drive-away`
4. Accept the terms and click "Create project"
5. Wait for project creation to complete

### Step 2: Register Web App

1. In Firebase Console, click the web icon `</>`
2. Enter app nickname: `Drive Away Web`
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the configuration object

### Step 3: Enable Authentication

1. Go to "Build" > "Authentication"
2. Click "Get Started"
3. Enable "Email/Password"
4. Save changes

### Step 4: Create Firestore Database

1. Go to "Build" > "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Select your region
5. Click "Create"

### Step 5: Setup Cloud Storage

1. Go to "Build" > "Cloud Storage"
2. Click "Get Started"
3. Use default bucket name
4. Select your region
5. Click "Done"

### Step 6: Configure .env.local

Update your `.env.local` file with the credentials:

```env
# From Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Application Configuration
NEXT_PUBLIC_APP_NAME=Drive Away
NEXT_PUBLIC_APP_EMAIL=your-email@example.com
NEXT_PUBLIC_APP_MOBILE=+1 (555) 123-4567
NEXT_PUBLIC_APP_ADDRESS=Your Address, City, State ZIP
NEXT_PUBLIC_APP_DESCRIPTION=Premium car and bike rental services

# Social Media (Optional)
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourpage
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourhandle
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourhandle
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/yourhandle
```

## Firestore Security Rules

For development, update your security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Anyone can read bookings (later add auth check)
    match /bookings/{document=**} {
      allow read, write;
    }

    // Anyone can read vehicles
    match /vehicles/{document=**} {
      allow read;
      allow write: if request.auth != null; // Only authenticated users
    }

    // Contact messages
    match /contactMessages/{document=**} {
      allow write;
      allow read: if request.auth != null;
    }
  }
}
```

## Initial Data Setup

### Add Sample Vehicles

1. Go to Firestore in Firebase Console
2. Create a new collection: `vehicles`
3. Add documents with this structure:

```json
{
  "name": "Toyota Camry",
  "type": "car",
  "category": "Economy",
  "price": 25,
  "image": "/cars/camry.jpg",
  "description": "Reliable and fuel-efficient sedan",
  "features": ["Automatic transmission", "Air conditioning", "Backup camera"],
  "isAvailable": true,
  "createdAt": "2025-11-17"
}
```

### Sample Data:

**Vehicles:**
- Toyota Camry (Car, $25/day)
- Honda CR-V (SUV, $45/day)
- Mercedes C-Class (Luxury, $75/day)
- Mountain Bike (Bike, $15/day)
- Road Bike (Bike, $20/day)
- City Bike (Bike, $10/day)

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

## Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start

# Or build and start with one command
npm run build && npm start
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
npm run build
firebase deploy
```

### Other Platforms

- **Netlify**: Connect GitHub repo, set build command
- **AWS Amplify**: Use AWS Console for deployment
- **Docker**: Create Dockerfile and deploy to your host

## Environment Variables

All environment variables in this project are prefixed with `NEXT_PUBLIC_` making them available to the browser (client-side).

⚠️ **Security Note**: Never commit `.env.local` to version control. Use `.env.example` instead:

```env
# .env.example (commit this)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

## Theme Customization

Edit `config/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: "#000000",      // Change primary color
    secondary: "#6B7280",    // Change secondary color
    // ...
  },
  // ... more customizations
};
```

## SEO Configuration

Update these files for SEO:

1. **`app/layout.tsx`** - Global metadata
2. **`config/app-config.ts`** - App-specific config
3. **`lib/schema.ts`** - JSON-LD structured data
4. **`app/sitemap.ts`** - XML sitemap
5. **`app/robots.ts`** - Robots.txt

## API Configuration

API routes are in `app/api/`:
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get bookings
- GET `/api/vehicles` - Get vehicles
- POST `/api/contact` - Send contact form

Update these routes to integrate with your backend or email service.

## Database Backup

Regular backups are important:

```bash
# Export Firestore data
firestore export gs://your-bucket/backups/backup-2025-11-17

# Import data
firestore import gs://your-bucket/backups/backup-2025-11-17
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Firebase Connection Issues
- Verify `.env.local` has correct credentials
- Check Firebase project settings
- Ensure Firestore database is created
- Check security rules allow your operations

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## Performance Optimization

- Enable Image Optimization in Next.js
- Use Vercel Analytics
- Monitor Firebase usage
- Implement caching strategies
- Compress images before uploading

## Next Steps

1. ✅ Setup Firebase
2. ✅ Configure environment variables
3. ✅ Add sample data
4. ✅ Customize theme
5. ✅ Test locally
6. 🎯 Integrate payment system
7. 🎯 Setup email notifications
8. 🎯 Deploy to production

## Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

---

**Happy Building! 🚀**
