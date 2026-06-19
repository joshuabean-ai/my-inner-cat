import Link from "next/link";

const links = [
  { href: "/quiz", label: "Take the quiz" },
  { href: "/cats", label: "All cats" },
];

export function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-3 py-8 font-body text-sm text-ink-whisper">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded transition-colors hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/"
        className="rounded transition-colors hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
      >
        myinnercat.com
      </Link>
    </footer>
  );
}
