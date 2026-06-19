import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Slim persistent header. The wordmark always returns home — on the quiz it
 * doubles as a quiet exit, on the result page it anchors the brand.
 */
export function Masthead({ right }: { right?: ReactNode }) {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 sm:px-8">
      <Link
        href="/"
        aria-label="My Inner Cat — return to the start"
        className="group inline-flex items-center gap-2 rounded-btn"
      >
        <PawMark className="h-5 w-5 text-lavender transition-colors group-hover:text-ink-soft" />
        <span className="font-display text-lg font-semibold text-ink-deep">
          My Inner Cat
        </span>
      </Link>
      {right ? <div className="eyebrow text-ink-whisper">{right}</div> : null}
    </header>
  );
}

function PawMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <circle cx="6.2" cy="10.5" r="2.1" />
      <circle cx="10" cy="7.8" r="2.1" />
      <circle cx="14" cy="7.8" r="2.1" />
      <circle cx="17.8" cy="10.5" r="2.1" />
    </svg>
  );
}
