import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/success"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
