import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InvenTree - Inventory & Sales Management",
  description: "Free inventory and sales management system for small to medium businesses. Track stock, manage sales, and get detailed analytics - all for free.",
  keywords: ["inventory management", "stock control", "sales management", "business software", "free inventory system", "Kenya business software"],
  authors: [{ name: "Ken Tom", url: "https://kentom.co.ke" }],
  creator: "Ken Tom",
  publisher: "InvenTree",
  metadataBase: new URL("https://inventreez.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "InvenTree - Watch Your Inventory Grow and Branch Out",
    description: "Complete inventory management solution for small to medium businesses. Track stock, manage sales, and get detailed analytics - all for free.",
    url: "/",
    siteName: "InvenTree",
    images: [
      {
        url: "/InvenTree.jpg",
        width: 1200,
        height: 630,
        alt: "InvenTree - Inventory Management System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvenTree - Inventory & Sales Management",
    description: "Complete inventory management solution for small to medium businesses. Free forever.",
    images: ["/InvenTree.jpg"],
    creator: "@kentom",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
