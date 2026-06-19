"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawMark } from "./PawMark";

const NAV = [
  { href: "/quiz", label: "Quiz" },
  { href: "/cats", label: "Cats" },
  { href: "/about", label: "About" },
];

/**
 * Persistent top bar and the site's primary navigation. The wordmark returns
 * home; the links cover the other destinations. On the quiz we pass nav={false}
 * to keep that flow distraction-free (the wordmark still works as an exit).
 */
export function Masthead({ nav = true }: { nav?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4 sm:px-8">
      <Link
        href="/"
        aria-label="My Inner Cat — home"
        className="group inline-flex items-center gap-2 rounded-btn"
      >
        <PawMark className="h-5 w-5 shrink-0 text-lavender transition-colors group-hover:text-ink-soft" />
        <span className="whitespace-nowrap font-display text-base font-semibold text-ink-deep sm:text-lg">
          My Inner Cat
        </span>
      </Link>

      {nav ? (
        <nav className="flex items-center gap-3 font-body text-sm sm:gap-6">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded underline-offset-4 transition-colors hover:text-ink-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender ${
                  active
                    ? "font-medium text-ink-deep underline decoration-lavender"
                    : "text-ink-soft"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
