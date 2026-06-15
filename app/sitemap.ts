import type { MetadataRoute } from "next";
import {
  getSeoLandingPageHref,
  seoLandingPages,
} from "@/lib/seo/landing-pages";
import { baseUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const seoRoutes = seoLandingPages.map((page) => ({
    url: `${baseUrl}${getSeoLandingPageHref(page)}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority:
      page.slug === "essay-checker"
        ? 0.92
        : page.category === "core"
          ? 0.86
          : 0.78,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/check`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/essay-tools`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.84,
    },
    {
      url: `${baseUrl}/report/sample-report`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...seoRoutes,
  ];
}
