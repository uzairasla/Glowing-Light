import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Guiding Light",
    template: "%s | Guiding Light",
  },
  description:
    "A calm, source-backed learning platform for people questioning religion, exploring Islam, and beginning life as new Muslims.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guiding Light",
    description:
      "Private questions, reviewed answers, and guided learning journeys for sincere seekers.",
    url: "/",
    siteName: "Guiding Light",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <SiteHeader />
          {children}
          <footer className="border-t bg-white/70 py-8 text-center text-sm text-muted-foreground">
            <div className="container flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p>Guiding Light uses reviewed sources and clear editorial status.</p>
              <div className="flex gap-5">
                <Link href="/questions" className="hover:text-primary">
                  Questions
                </Link>
                <Link href="/ask" className="hover:text-primary">
                  Ask
                </Link>
                <Link href="/settings" className="hover:text-primary">
                  Settings
                </Link>
              </div>
            </div>
          </footer>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
