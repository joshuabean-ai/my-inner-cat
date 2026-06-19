import { PawMark } from "./PawMark";

/**
 * A calm brand sign-off — not navigation (that lives in the masthead). One
 * intentional mark to close the page.
 */
export function Footer() {
  return (
    <footer className="mt-auto flex flex-col items-center gap-1.5 py-10 text-center">
      <div className="flex items-center gap-2 text-ink-deep">
        <PawMark className="h-4 w-4 text-lavender" />
        <span className="font-display text-base font-semibold">My Inner Cat</span>
      </div>
      <p className="eyebrow text-ink-whisper">A watercolor quiz by Georgia</p>
    </footer>
  );
}
