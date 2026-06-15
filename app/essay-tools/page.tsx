import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { GradientBackground } from "@/components/shared/gradient-background";
import {
  getSeoLandingPageHref,
  seoLandingPages,
  type SeoLandingPage,
} from "@/lib/seo/landing-pages";
import { baseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Essay Tools",
  description:
    "Browse Yessay tools for essay checking, feedback, grammar, thesis statements, rubrics, outlines, paragraphs, conclusions, hooks, and essay types.",
  alternates: {
    canonical: "/essay-tools",
  },
  openGraph: {
    title: "Essay Tools",
    description:
      "Browse Yessay tools for essay checking, feedback, grammar, rubrics, thesis statements, and focused revision help.",
    url: "/essay-tools",
    siteName: "Yessay",
    type: "website",
    images: [
      {
        url: `${baseUrl}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Yessay essay tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essay Tools",
    description:
      "Browse Yessay tools for essay checking, feedback, grammar, rubrics, thesis statements, and focused revision help.",
    images: [`${baseUrl}/opengraph-image.jpg`],
  },
};

const toolGroups: {
  category: SeoLandingPage["category"];
  eyebrow: string;
  title: string;
  copy: string;
}[] = [
  {
    category: "core",
    eyebrow: "Start here",
    title: "Core essay tools",
    copy: "Start here when you want an overall readiness score, essay feedback, grammar review, or a focused revision plan.",
  },
  {
    category: "essay-type",
    eyebrow: "Match the assignment",
    title: "Essay-type checkers",
    copy: "Use these when the assignment format matters: research papers, argumentative essays, personal statements, IB essays, and more.",
  },
  {
    category: "writing-problem",
    eyebrow: "Fix one part",
    title: "Focused revision tools",
    copy: "Zoom in on the part of the draft that feels weakest: thesis, outline, paragraph, hook, conclusion, or rubric match.",
  },
];

export default function EssayToolsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28">
      <GradientBackground />

      <section className="page-shell pb-16 pt-6 sm:pb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#171912]/14 bg-[#fffdf8]/82 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#4b561d] shadow-[0_10px_30px_rgba(23,25,18,0.06)]">
            <Sparkles size={14} className="text-[#92b72a]" />
            Essay tools
          </div>
          <h1 className="mt-6 text-balance text-[3rem] font-black leading-[0.94] tracking-[-0.065em] text-[#171912] sm:text-6xl lg:text-[5.1rem]">
            Find the right way to check your essay.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[#53574d] sm:text-lg">
            Browse every Yessay checker in one place. Pick the page that matches
            your draft, then run the analysis when you are ready to revise.
          </p>
          <div className="mt-8">
            <Link href="/check" className="primary-button px-7">
              Check My Essay
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-16 sm:py-20">
        <div className="page-shell space-y-12">
          {toolGroups.map((group) => {
            const pages = seoLandingPages.filter(
              (page) => page.category === group.category,
            );

            return (
              <section key={group.category}>
                <div className="grid items-end gap-5 lg:grid-cols-[0.68fr_1fr]">
                  <div>
                    <p className="eyebrow">{group.eyebrow}</p>
                    <h2 className="mt-5 text-balance text-3xl font-black leading-[1.04] tracking-[-0.045em] text-[#171912] sm:text-5xl">
                      {group.title}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-base font-medium leading-7 text-[#6c7065] lg:justify-self-end">
                    {group.copy}
                  </p>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={getSeoLandingPageHref(page)}
                      className="group rounded-[28px] border border-[#171912]/12 bg-[#f6f1e8] p-5 shadow-[0_4px_0_rgba(23,25,18,0.1)] transition-transform hover:-translate-y-0.5"
                    >
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_3px_0_#171912]">
                        {page.category === "essay-type" ? (
                          <BookOpenCheck size={21} />
                        ) : (
                          <CheckCircle2 size={21} />
                        )}
                      </span>
                      <h3 className="mt-5 text-xl font-black tracking-[-0.035em] text-[#171912]">
                        {page.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-[#62675b]">
                        {page.metaDescription}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#171912]">
                        Open tool
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="bg-[#c8f85a] py-16 sm:py-20">
        <div className="page-shell grid items-center gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#445311]">
              Ready to use it on your draft?
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-6xl">
              Start with the free score preview.
            </h2>
          </div>
          <Link
            href="/check"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-[#171912] bg-[#171912] px-8 text-base font-black text-white shadow-[0_5px_0_rgba(23,25,18,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Check My Essay
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
