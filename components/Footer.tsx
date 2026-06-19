import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto py-8 text-center font-body text-sm text-ink-whisper">
      <Link
        href="/"
        className="transition-colors hover:text-ink-soft"
      >
        myinnercat.com
      </Link>
    </footer>
  );
}
