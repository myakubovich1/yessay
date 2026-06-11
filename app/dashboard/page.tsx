import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { DashboardView } from "@/components/report/dashboard-view";
import { GradientBackground } from "@/components/shared/gradient-background";

export const metadata: Metadata = {
  title: "Saved Reports",
  description: "Open and review essay checks saved in this browser.",
};

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-28">
      <GradientBackground />
      <div className="page-shell">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Your reports</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#171912] sm:text-5xl">
              Saved essay checks
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c7065]">
              Reports are saved on this device so you can return to your
              revision plan without starting over.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/report/sample-report"
              className="secondary-button min-h-11"
            >
              Example
              <ArrowRight size={16} />
            </Link>
            <Link href="/check" className="primary-button min-h-11">
              <Plus size={17} />
              New check
            </Link>
          </div>
        </div>
        <DashboardView />
      </div>
    </main>
  );
}
