import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/ask",
        "/auth/",
        "/dashboard",
        "/guides/new-muslim",
        "/my-journey",
        "/saved",
        "/settings",
        "/sign-in",
      ],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_SITE_URL,
  };
}
