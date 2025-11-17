import type { Metadata } from "next";
import "./globals.css";
import "./animations.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { appConfig } from "@/config/app-config";
import { structuredData } from "@/lib/schema";

export const metadata: Metadata = {
  title: `${appConfig.app.name} - Car & Bike Rental Services`,
  description: appConfig.app.description,
  keywords: ["car rental", "bike rental", "vehicle rental", "transportation", "reservation"],
  metadataBase: new URL("https://driveaway.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://driveaway.com",
    siteName: appConfig.app.name,
    title: `${appConfig.app.name} - Premium Car & Bike Rentals`,
    description: appConfig.app.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${appConfig.app.name} - Premium Car & Bike Rentals`,
    description: appConfig.app.description,
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  authors: [{ name: appConfig.app.name }],
  creator: appConfig.app.name,
  publisher: appConfig.app.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
