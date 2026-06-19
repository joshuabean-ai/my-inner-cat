import type { Answer } from "@/lib/types";

interface AnswerOptionProps {
  answer: Answer;
  onSelect: (answer: Answer) => void;
  disabled?: boolean;
}

export function AnswerOption({ answer, onSelect, disabled }: AnswerOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(answer)}
      className="group flex min-h-11 w-full items-center gap-3 rounded-card border border-dove/60 bg-paper px-5 py-4 text-left font-body text-base text-ink-deep shadow-paper-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-lavender hover:shadow-paper-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender disabled:pointer-events-none disabled:opacity-60"
    >
      <span className="flex-1 text-pretty">{answer.text}</span>
      <span
        aria-hidden="true"
        className="shrink-0 text-lavender opacity-0 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        →
      </span>
    </button>
  );
}
