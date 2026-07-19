import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/styles.css";
import "../src/article.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://devfieldnotes.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dev Fieldnotes - Tested solutions for modern web development",
    template: "%s | Dev Fieldnotes",
  },
  description:
    "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dev Fieldnotes - Tested solutions for modern web development",
    description:
      "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.",
    url: "/",
    siteName: "Dev Fieldnotes",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Fieldnotes - Tested solutions for modern web development",
    description:
      "Practical, tested guides for debugging Next.js, Sanity, deployment, caching, and modern web development.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}