/** The little paw used in the masthead and footer brand marks. */
export function PawMark({ className = "" }: { className?: string }) {
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
