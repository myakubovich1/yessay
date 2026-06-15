import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileSearch,
  ScanSearch,
  Sparkles,
  TimerReset,
  Zap,
} from "lucide-react";
import { AcademicIntegrityNotice } from "@/components/shared/academic-integrity-notice";
import { Footer } from "@/components/shared/footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { PricingCard } from "@/components/marketing/pricing-card";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { ReportAnimation } from "@/components/marketing/report-animation";
import { RevisionAnimation } from "@/components/marketing/revision-animation";
import {
  WorkflowAnimation,
  type WorkflowAnimationKind,
} from "@/components/marketing/workflow-animation";
import { pricingPlans } from "@/lib/pricing";

const faqs = [
  {
    q: "Does Yessay write my essay?",
    a: "No. Yessay reviews the draft you provide and gives revision direction. It does not generate a full replacement essay.",
  },
  {
    q: "What if my professor did not provide a rubric?",
    a: "Select “I don’t have a rubric” and Yessay will use general college writing standards while prioritizing the assignment prompt.",
  },
  {
    q: "Does the score predict my grade?",
    a: "No. The score is a readiness signal based on possible issues. Your professor’s judgment and course requirements always take priority.",
  },
  {
    q: "Can I use it the night an essay is due?",
    a: "Yes. Due Tonight Mode organizes feedback into 15, 30, and 60-minute revision plans so you can focus on the highest-impact work.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="home-hero relative bg-[#171912] text-white">
        <div className="absolute -left-28 top-28 size-72 rounded-full bg-[#c8f85a]/18 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-[#ff8b5e]/16 blur-3xl" />
        <div className="page-shell relative grid min-h-[690px] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-3 py-2 text-xs font-bold text-white/82">
              <Sparkles size={14} className="text-[#c8f85a]" />
              Essay feedback that helps you revise your own draft.
            </div>
            <h1 className="mt-7 text-balance text-[3.3rem] font-black leading-[0.96] tracking-[-0.065em] sm:text-7xl lg:text-[5.2rem]">
              Know what to fix{" "}
              <span className="text-[#c8f85a]">before you submit.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm font-bold leading-6 text-white/80 sm:text-base">
              Research paper, literary analysis, lab report, or college essay?{" "}
              <span className="text-[#c8f85a]">
                Yessay adapts to the assignment.
              </span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/check" className="primary-button px-7">
                Check my essay
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/report/sample-report"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 text-sm font-bold text-white transition-colors hover:bg-white/14"
              >
                <FileSearch size={17} />
                View sample report
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/58">
              {["Free score preview", "No grade promises", "Saved locally"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check size={14} className="text-[#c8f85a]" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="pb-6 lg:justify-self-end lg:pb-0">
            <HeroMockup />
          </div>
        </div>
      </section>

      <section className="bg-[#c8f85a] py-5">
        <div className="page-shell flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-sm font-black uppercase tracking-[0.08em] text-[#171912]">
          <span>Prompt match</span>
          <span className="size-2 rounded-full bg-[#171912]" />
          <span>Rubric review</span>
          <span className="size-2 rounded-full bg-[#171912]" />
          <span>Citation scan</span>
          <span className="size-2 rounded-full bg-[#171912]" />
          <span>Priority plan</span>
        </div>
      </section>

      <section className="home-section bg-[#f6f1e8]">
        <div className="page-shell">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="eyebrow">One clear workflow</p>
              <h2 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-6xl">
                From messy draft to focused revision plan.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-[#6c7065] lg:justify-self-end">
              No blank chat box and no vague “make it better” advice. Yessay
              checks your work against the instructions that matter.
            </p>
          </div>

          <div className="home-section__content grid gap-5 lg:grid-cols-3">
            {[
              {
                n: "01",
                title: "Add the assignment",
                copy: "Give Yessay the exact target: prompt, format, source rules, and due date.",
                icon: BookOpenCheck,
                color: "bg-[#cfc3ff]",
                animation: "assignment" as WorkflowAnimationKind,
              },
              {
                n: "02",
                title: "Paste your draft",
                copy: "Add text directly or upload screenshots and let Yessay extract the words.",
                icon: ScanSearch,
                color: "bg-[#ff8b5e]",
                animation: "draft" as WorkflowAnimationKind,
              },
              {
                n: "03",
                title: "Fix what matters",
                copy: "Use the score, warnings, and ranked checklist to revise in the right order.",
                icon: Zap,
                color: "bg-[#c8f85a]",
                animation: "fixes" as WorkflowAnimationKind,
              },
            ].map((step) => (
              <article
                key={step.n}
                className={`tactile-card ${step.color} group flex min-h-[420px] flex-col overflow-hidden p-7 text-[#171912]`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-bold">{step.n}</span>
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-[#171912] bg-[#fffdf8]">
                    <step.icon size={22} />
                  </span>
                </div>
                <WorkflowAnimation kind={step.animation} />
                <div className="mt-auto pt-7">
                  <h3 className="text-2xl font-black tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#34372e]">
                    {step.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section report-showcase-section bg-[#fffdf8]">
        <div className="page-shell report-showcase">
          <div className="report-showcase__copy">
            <p className="eyebrow">Everything in one report</p>
            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-5xl lg:text-[3.25rem]">
              Less guessing. More useful signals.
            </h2>
            <p className="report-showcase__description">
              See your readiness, strongest signals, and highest-priority fixes
              in one focused view.
            </p>
          </div>
          <ReportAnimation />
        </div>
      </section>

      <section className="home-section bg-[#171912] text-white">
        <div className="page-shell">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="inline-flex rounded-full bg-[#c8f85a] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#171912]">
                Questions students ask
              </p>
              <h2 className="mt-6 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                Clear limits. Useful feedback.
              </h2>
              <div className="mt-7 rounded-[24px] border border-white/14 bg-white/8 p-5">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <TimerReset className="text-[#c8f85a]" size={20} />
                  Due tonight?
                </div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Get a repair plan organized around the time you actually have.
                </p>
              </div>
            </div>
            <div className="divide-y divide-white/14 border-y border-white/14">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                    {faq.q}
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl font-light transition-transform group-open:rotate-45 group-open:bg-[#c8f85a] group-open:text-[#171912]">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl pr-12 text-sm leading-6 text-white/58">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--pricing bg-[#f6f1e8]">
        <div className="page-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Simple pricing</p>
            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#171912] sm:text-6xl">
              Pick the access that fits your deadline.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#6c7065]">
              Run one analysis first. Then unlock one report, one intense week,
              one month, or the full academic year.
            </p>
          </div>
          <div className="home-section__content pricing-offer-grid">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
          <PricingPreview />
        </div>
      </section>

      <section className="home-section bg-[#f6f1e8]">
        <div className="page-shell">
          <div className="tactile-card grid overflow-hidden bg-[#c8f85a] lg:grid-cols-[1fr_auto]">
            <div className="p-8 sm:p-12">
              <p className="text-sm font-black uppercase tracking-[0.12em]">
                Your draft is already written
              </p>
              <h2 className="mt-4 max-w-2xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">
                Now make the final revision count.
              </h2>
              <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-[#41452f] sm:text-base">
                Check the rubric, catch likely gaps, and decide what to change
                before you submit.
              </p>
              <Link
                href="/check"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#171912] bg-[#171912] px-6 text-sm font-extrabold text-white transition-transform hover:-translate-y-1"
              >
                Check my essay
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hidden min-w-[390px] items-center justify-center border-l border-[#171912] bg-[radial-gradient(circle_at_55%_38%,rgba(200,248,90,0.2),transparent_42%),#fffdf8] lg:flex">
              <RevisionAnimation />
            </div>
          </div>
          <div className="mt-8">
            <AcademicIntegrityNotice compact />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
