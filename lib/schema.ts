import { appConfig } from "@/config/app-config";

export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: appConfig.app.name,
    description: appConfig.app.description,
    url: "https://driveaway.com",
    telephone: appConfig.app.mobile,
    email: appConfig.app.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main Street",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    areaServed: "US",
    priceRange: "$$",
    image: "https://driveaway.com/logo.png",
    sameAs: [
      appConfig.social.facebook,
      appConfig.social.twitter,
      appConfig.social.instagram,
    ],
  };
}
