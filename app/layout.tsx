import type React from "react";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { ReduxProvider } from "@/lib/redux-provider";
import { GoogleAuthProvider } from "@/lib/google-oauth-provider";
import { Suspense } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Session Share",
  title: {
    default: "Session Share - Collaborative Platform",
    template: "%s | Session Share",
  },
  description: "Share and collaborate on sessions with your team",
  keywords: [
    "session sharing",
    "collaboration",
    "team workflows",
    "browser sessions",
    "Session Share",
    "grammarly cookies",
    "grammarly premium cookies",
    "grammarly premium cookie",
    "linkstricks grammarly",
    "grammarly free cookies",
    "grammarly cookies premium",
    "bingotingo com grammarly cookies",
    "cookie code for grammarly json",
    "cookie editor for grammarly premium",
    "grammarly shared",
    "grammarly shared accounts",
    "share grammarly premium account",
    "grammarly premium account share",
    "grammarly premium shared account",
    "share grammarly",
    "grammarly premium share",
    "share acc grammarly",
    "share account grammarly",
    "share grammarly premium",
    "netflix shared",
    "netflix account",
    "netflix login",
    "netflix account login and password",
    "netflix new account",
    "peacock password sharing",
    "netflix account sharing",
    "netflix password sharing",
    "netflix login and password",
  ],
  authors: [{ name: "Session Share" }],
  creator: "Session Share",
  publisher: "Session Share",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Session Share",
    title: "Session Share - Collaborative Platform",
    description: "Share and collaborate on sessions with your team",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Session Share",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SessionShare",
    creator: "@SessionShare",
    title: "Session Share - Collaborative Platform",
    description: "Share and collaborate on sessions with your team",
    images: ["/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ReduxProvider>
            <GoogleAuthProvider>
              <AuthProvider>{children}</AuthProvider>
            </GoogleAuthProvider>
          </ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
