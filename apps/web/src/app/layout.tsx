import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Glowing Light",
    template: "%s | Glowing Light",
  },
  description:
    "Explore the Abrahamic faith as a continuous prophetic tradition and the Quranic view that sincere submission to God is the faith taught by every prophet.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "One God. One Message. A Shared Prophetic Story.",
    description:
      "Explore the shared call to worship one God, how it was understood over time, and the Quranic view of sincere submission to God.",
    url: "/",
    siteName: "Glowing Light",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "One God. One Message. A Shared Prophetic Story.",
    description:
      "Explore the Abrahamic faith as a continuous prophetic tradition from Adam through Muhammad.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <SiteHeader />
          {children}
          <footer className="border-t bg-white/70 py-8 text-center text-sm text-muted-foreground">
            <div className="container flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p>One God. One message. A shared prophetic story.</p>
              <div className="flex gap-5">
                <Link href="/journeys" className="hover:text-primary">
                  Learning journeys
                </Link>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
                <Link href="/faith-leaders" className="hover:text-primary">
                  For faith leaders
                </Link>
              </div>
            </div>
          </footer>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
