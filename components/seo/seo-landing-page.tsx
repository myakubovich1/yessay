import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  FileSearch,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { GradientBackground } from "@/components/shared/gradient-background";
import { GlassCard } from "@/components/ui/glass-card";
import { baseUrl } from "@/lib/site";
import {
  getRelatedSeoPages,
  getSeoLandingPageHref,
  type SeoLandingPage,
} from "@/lib/seo/landing-pages";

type SeoLandingPageProps = {
  page: SeoLandingPage;
};

type BreadcrumbItem = {
  name: string;
  href: string;
};

function absoluteUrl(path: string) {
  return `${baseUrl}${path}`;
}

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getBreadcrumbs(page: SeoLandingPage): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }];

  if (page.slug.startsWith("essay-checker/")) {
    breadcrumbs.push({ name: "Essay Checker", href: "/essay-checker" });
  }

  breadcrumbs.push({ name: page.title, href: getSeoLandingPageHref(page) });
  return breadcrumbs;
}

function getCategoryCopy(category: SeoLandingPage["category"]) {
  if (category === "essay-type") {
    return "Built for this essay type";
  }

  if (category === "writing-problem") {
    return "Focused revision signal";
  }

  return "Core essay review tool";
}

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const relatedPages = getRelatedSeoPages(page);
  const breadcrumbs = getBreadcrumbs(page);
  const issueCount =
    page.category === "core" ? 7 : page.category === "essay-type" ? 5 : 4;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-28">
      <GradientBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />

      <section className="page-shell pb-16 pt-6 sm:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#6c7065]"
        >
          {breadcrumbs.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#171912]/28">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-[#171912]">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-[#171912]">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#171912]/14 bg-[#fffdf8]/82 px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#4b561d] shadow-[0_10px_30px_rgba(23,25,18,0.06)]">
              <Sparkles size={14} className="text-[#92b72a]" />
              {page.eyebrow}
            </div>
            <h1 className="mt-6 max-w-3xl text-balance text-[3rem] font-black leading-[0.94] tracking-[-0.065em] text-[#171912] sm:text-6xl lg:text-[5.1rem]">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[#53574d] sm:text-lg">
              {page.heroCopy}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/check" className="primary-button px-7">
                {page.ctaLabel}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/report/sample-report"
                className="secondary-button px-6"
              >
                <FileSearch size={17} />
                View sample report
              </Link>
            </div>
            <div className="mt-7 grid gap-2 sm:grid-cols-3">
              {page.trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-full border border-[#171912]/10 bg-[#fffdf8]/74 px-3 py-2 text-xs font-bold text-[#53574d]"
                >
                  <Check size={14} className="shrink-0 text-[#87a923]" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="relative overflow-hidden p-5 sm:p-7">
            <div className="absolute right-0 top-0 size-56 rounded-full bg-[#c8f85a]/35 blur-3xl" />
            <div className="absolute bottom-0 left-0 size-52 rounded-full bg-[#ff8b5e]/12 blur-3xl" />
            <div className="relative rounded-[28px] border border-[#171912]/12 bg-[#171912] p-4 text-white shadow-[0_16px_0_rgba(23,25,18,0.14)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-xl border border-white/14 bg-[#c8f85a] text-[#171912]">
                    <BookOpenCheck size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-black">Yessay report</p>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/42">
                      Free preview
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#c8f85a] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#171912]">
                  {issueCount} found
                </span>
              </div>

              <div className="grid gap-5 py-6 sm:grid-cols-[0.46fr_0.54fr]">
                <div className="flex items-center justify-center">
                  <div className="relative flex size-36 items-center justify-center rounded-full bg-[#c8f85a]/10">
                    <div className="absolute inset-3 rounded-full border-[12px] border-[#c8f85a]/22" />
                    <div className="absolute inset-3 rounded-full border-[12px] border-transparent border-t-[#c8f85a] border-r-[#c8f85a]" />
                    <div className="relative text-center">
                      <strong className="block text-5xl font-black tracking-[-0.08em]">
                        ??
                      </strong>
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#c8f85a]">
                        Score after scan
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {page.checks.map((check, index) => (
                    <div
                      key={check.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black">
                          {check.title}
                        </span>
                        <span className="text-[0.65rem] font-black uppercase text-white/38">
                          {index === 0 ? "Preview" : "Locked"}
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#c8f85a]"
                          style={{ width: `${86 - index * 12}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f85a] text-[#171912]">
                    <LockKeyhole size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-black">
                      Score and issue count are free.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-white/58">
                      Actionable fixes unlock after payment, so you can preview
                      the signal before deciding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-16 sm:py-20">
        <div className="page-shell">
          <div className="grid items-end gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">{getCategoryCopy(page.category)}</p>
              <h2 className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-5xl">
                What Yessay checks
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-7 text-[#6c7065] lg:justify-self-end">
              The report focuses on concrete revision signals tied to your
              prompt, rubric, and draft instead of vague “make it better”
              advice.
            </p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {page.checks.map((check, index) => (
              <article
                key={check.title}
                className="rounded-[28px] border border-[#171912]/12 bg-[#f6f1e8] p-6 shadow-[0_4px_0_rgba(23,25,18,0.1)]"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl border border-[#171912] bg-[#c8f85a] text-[#171912] shadow-[0_3px_0_#171912]">
                  {index === 0 ? (
                    <ShieldCheck size={21} />
                  ) : index === 1 ? (
                    <MessageSquareText size={21} />
                  ) : (
                    <CheckCircle2 size={21} />
                  )}
                </span>
                <h3 className="mt-5 text-xl font-black tracking-[-0.035em] text-[#171912]">
                  {check.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#62675b]">
                  {check.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1e8] py-16 sm:py-20">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <GlassCard className="p-7 sm:p-9">
            <p className="eyebrow">How it helps</p>
            <h2 className="mt-5 text-balance text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[#171912] sm:text-5xl">
              {page.explanation.heading}
            </h2>
            <div className="mt-6 space-y-4">
              {page.explanation.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base font-medium leading-7 text-[#5d6257]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassCard>

          <div className="rounded-[30px] border border-[#171912] bg-[#c8f85a] p-7 text-[#171912] shadow-[0_8px_0_#171912] sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[0.12em]">
                {page.example.heading}
              </p>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#171912] bg-[#fffdf8]">
                <FileSearch size={20} />
              </span>
            </div>
            <div className="mt-7 rounded-3xl border border-[#171912]/14 bg-[#fffdf8]/82 p-5">
              <p className="text-sm font-black uppercase tracking-[0.08em] text-[#9b5839]">
                {page.example.draftNote}
              </p>
              <p className="mt-4 text-lg font-black leading-7 tracking-[-0.025em]">
                {page.example.feedback}
              </p>
            </div>
            <Link
              href="/check"
              className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#171912] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
            >
              Try it on your draft
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#171912] py-16 text-white sm:py-20">
        <div className="page-shell">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-[#c8f85a] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#171912]">
              Common mistakes
            </p>
            <h2 className="mt-6 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">
              The issues students usually miss alone.
            </h2>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {page.mistakes.map((mistake) => (
              <article
                key={mistake.title}
                className="rounded-[26px] border border-white/12 bg-white/[0.06] p-6"
              >
                <AlertTriangle className="text-[#ff8b5e]" size={22} />
                <h3 className="mt-5 text-xl font-black tracking-[-0.035em]">
                  {mistake.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/62">
                  {mistake.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-16 sm:py-20">
        <div className="page-shell grid gap-9 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-5xl">
              Questions before checking your draft
            </h2>
            <p className="mt-5 text-base font-medium leading-7 text-[#6c7065]">
              Short answers to help you decide whether this check fits your
              draft.
            </p>
          </div>
          <div className="divide-y divide-[#171912]/12 border-y border-[#171912]/12">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black tracking-[-0.025em] text-[#171912]">
                  {faq.question}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#171912]/18 bg-[#f6f1e8] text-xl font-light transition-transform group-open:rotate-45 group-open:bg-[#c8f85a]">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl pr-12 text-sm font-medium leading-6 text-[#62675b]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1e8] py-16 sm:py-20">
        <div className="page-shell">
          <div className="rounded-[32px] border border-[#171912]/12 bg-[#fffdf8] p-6 shadow-[0_16px_46px_rgba(53,48,35,0.08)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow">Related tools</p>
                <h2 className="mt-5 text-balance text-3xl font-black leading-[1.04] tracking-[-0.045em] text-[#171912] sm:text-4xl">
                  Keep checking the parts that matter.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedPages.map((relatedPage) => (
                  <Link
                    key={relatedPage.slug}
                    href={getSeoLandingPageHref(relatedPage)}
                    className="group rounded-2xl border border-[#171912]/12 bg-[#f6f1e8] p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="text-sm font-black text-[#171912]">
                      {relatedPage.title}
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#6c7065] group-hover:text-[#171912]">
                      Read page
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#c8f85a] py-16 sm:py-20">
        <div className="page-shell grid items-center gap-7 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#445311]">
              Ready to check your own draft?
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-6xl">
              Get the score first. Unlock fixes only if it is useful.
            </h2>
          </div>
          <Link
            href="/check"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-[#171912] bg-[#171912] px-8 text-base font-black text-white shadow-[0_5px_0_rgba(23,25,18,0.35)] transition-transform hover:-translate-y-0.5"
          >
            {page.ctaLabel}
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
