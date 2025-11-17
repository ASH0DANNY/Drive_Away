export const appConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Drive Away",
    email: process.env.NEXT_PUBLIC_APP_EMAIL || "contact@driveaway.com",
    mobile: process.env.NEXT_PUBLIC_APP_MOBILE || "+1 (555) 123-4567",
    address: process.env.NEXT_PUBLIC_APP_ADDRESS || "123 Main Street, New York, NY 10001",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Premium car and bike rental services",
  },
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com",
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};

export default appConfig;
