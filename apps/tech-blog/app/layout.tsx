import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/styles.css";
import "../src/article.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3002");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fieldnotes - Practical guides for technical work",
  description:
    "Field-tested technical guides and ready-to-use templates for people who build.",
  openGraph: {
    title: "Fieldnotes - Practical guides. Proven templates.",
    description:
      "Field-tested technical guides and ready-to-use templates for people who build.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
