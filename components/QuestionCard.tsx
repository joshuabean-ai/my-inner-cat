import type { Answer, Question } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: Answer) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  onAnswer,
  disabled,
}: QuestionCardProps) {
  return (
    <article className="animate-fade-up" key={question.id}>
      <h2 className="font-display text-section-title font-semibold text-ink-deep text-balance">
        {question.title}
      </h2>
      <p className="mt-3 font-body text-lg text-ink-soft text-pretty">
        {question.setup}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {question.answers.map((answer) => (
          <AnswerOption
            key={answer.id}
            answer={answer}
            onSelect={onAnswer}
            disabled={disabled}
          />
        ))}
      </div>
    </article>
  );
}
