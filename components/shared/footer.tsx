import Link from "next/link";
import { footerSeoLinks, getSeoLandingPageHref } from "@/lib/seo/landing-pages";
import { BrandMark } from "./brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-[#171912]/12 bg-[#fffdf8] py-10">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#6c7065]">
            Built to help you revise your own work, not replace it.
          </p>
        </div>
        <div className="grid gap-5 lg:justify-items-end">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#6c7065]">
            <Link href="/pricing" className="hover:text-[#171912]">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-[#171912]">
              Reports
            </Link>
            <Link href="/terms" className="hover:text-[#171912]">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#171912]">
              Privacy
            </Link>
            <span>© {new Date().getFullYear()} Yessay</span>
          </div>
          <div className="flex max-w-2xl flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.08em] text-[#6c7065]/78 lg:justify-end">
            {footerSeoLinks.map((page) => (
              <Link
                key={page.slug}
                href={getSeoLandingPageHref(page)}
                className="hover:text-[#171912]"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
