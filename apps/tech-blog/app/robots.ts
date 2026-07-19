import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://devfieldnotes.dev/sitemap.xml",
    host: "https://devfieldnotes.dev",
  };
}
