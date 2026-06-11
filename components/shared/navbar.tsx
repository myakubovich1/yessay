"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";

const links = [
  { href: "/check", label: "Check essay" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Reports" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const cta =
    pathname === "/check"
      ? { href: "/report/sample-report", label: "Example report" }
      : {
          href: "/check",
          label: pathname.startsWith("/report")
            ? "New Check"
            : "Check My Essay",
        };

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        isHome
          ? "bg-transparent"
          : "border-b border-[#171912]/10 bg-[#f6f1e8]/86 backdrop-blur-xl",
      )}
      aria-label="Main navigation"
    >
      <div className="page-shell mt-3 flex h-14 items-center justify-between rounded-full border border-[#171912]/12 bg-[#fffdf8]/92 px-2.5 shadow-[0_8px_30px_rgba(23,25,18,0.08)] backdrop-blur-xl">
        <BrandMark />
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-[#171912] text-white"
                  : "text-[#6c7065] hover:bg-[#eff9d4] hover:text-[#171912]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl border sm:hidden",
              "border-[#171912]/14 bg-white text-[#171912]",
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link
            href={cta.href}
            onClick={() => setMenuPath(null)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border border-[#171912] bg-[#c8f85a] px-4 text-sm font-extrabold text-[#171912] shadow-[0_3px_0_#171912] transition-transform hover:-translate-y-0.5",
            )}
          >
            <span className="hidden sm:inline">{cta.label}</span>
            <span className="sm:hidden">
              {pathname === "/check" ? "Example" : "Check"}
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div
          id="mobile-navigation"
          className={cn(
            "border-t px-4 py-3 sm:hidden",
            "border-[#171912]/10 bg-[#fffdf8]/96",
          )}
        >
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuPath(null)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-center text-sm font-semibold",
                  pathname === link.href
                    ? "bg-[#171912] text-white"
                    : "text-[#6c7065]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
