import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "./footer";
import { GradientBackground } from "./gradient-background";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28">
      <GradientBackground />
      <article className="page-shell max-w-3xl pb-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1d2a41]">{title}</h1>
        <p className="mt-3 text-sm text-[#7b8596]">Last updated: {updated}</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-[#59667b]">
          {children}
        </div>
        <p className="mt-12 border-t border-[#d9e0e9] pt-6 text-sm text-[#6d788a]">
          Questions about these terms or anything else can be directed to{" "}
          <Link
            href="mailto:hello@getyessay.com"
            className="font-semibold text-[#4162a4]"
          >
            hello@getyessay.com
          </Link>
          .
        </p>
      </article>
      <Footer />
    </main>
  );
}
