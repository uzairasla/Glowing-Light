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
    "A source-backed platform exploring one Abrahamic faith through Judaism, Christianity, and Islam without choosing sides.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Glowing Light",
    description:
      "Source-backed journeys exploring one Abrahamic faith through Judaism, Christianity, and Islam.",
    url: "/",
    siteName: "Glowing Light",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glowing Light",
    description:
      "Explore one Abrahamic faith through three traditions with clarity, respect, and no chosen side.",
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
              <p>
                Glowing Light explores one Abrahamic faith through Judaism,
                Christianity, and Islam.
              </p>
              <div className="flex gap-5">
                <Link href="/journeys" className="hover:text-primary">
                  Learning journeys
                </Link>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </div>
            </div>
          </footer>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
