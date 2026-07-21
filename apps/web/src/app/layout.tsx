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
    "A calm, source-backed learning platform for people questioning religion, exploring Islam, and beginning life as new Muslims.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Glowing Light",
    description:
      "Private questions, reviewed answers, and guided learning journeys for sincere seekers.",
    url: "/",
    siteName: "Glowing Light",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glowing Light",
    description:
      "Trusted learning paths and thoughtful guidance for exploring Islam.",
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
              <p>Glowing Light offers calm, structured learning about Islam.</p>
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
