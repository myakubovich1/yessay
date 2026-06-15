import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { baseUrl } from "@/lib/site";
import {
  getSeoLandingPageBySegments,
  getSeoLandingPageHref,
  seoLandingPages,
} from "@/lib/seo/landing-pages";

type SeoRouteProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({
    slug: page.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: SeoRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPageBySegments(slug);

  if (!page) {
    return {};
  }

  const href = getSeoLandingPageHref(page);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: href,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: href,
      siteName: "Yessay",
      type: "website",
      images: [
        {
          url: `${baseUrl}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${page.title} by Yessay`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [`${baseUrl}/opengraph-image.jpg`],
    },
  };
}

export default async function SeoRoute({ params }: SeoRouteProps) {
  const { slug } = await params;
  const page = getSeoLandingPageBySegments(slug);

  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
