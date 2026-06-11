import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function Footer() {
  return (
    <footer className="border-t border-[#171912]/12 bg-[#fffdf8] py-10">
      <div className="page-shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#6c7065]">
            Built to help you revise your own work, not replace it.
          </p>
        </div>
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
      </div>
    </footer>
  );
}
