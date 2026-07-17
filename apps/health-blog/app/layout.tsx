import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Wellbeing Edit", template: "%s | The Wellbeing Edit" },
  description: "Thoughtful, practical guidance for a healthier and more intentional everyday life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
