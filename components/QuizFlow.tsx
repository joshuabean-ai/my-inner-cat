"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import type { Answer, Question, UserAnswer } from "@/lib/types";
import { questions as allQuestions, cats, toSlug } from "@/lib/data";
import { selectQuestions } from "@/lib/selection";
import { matchArchetype, selectVariant } from "@/lib/matching";
import { flagPull } from "@/lib/collection";
import { ProgressBar } from "./ui/ProgressBar";
import { QuestionCard } from "./QuestionCard";

const QUESTION_COUNT = 10;

export function QuizFlow() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Pick the random question set on the client only, to avoid an SSR/CSR
  // hydration mismatch from Math.random.
  useEffect(() => {
    setQuestions(selectQuestions(allQuestions, QUESTION_COUNT));
  }, []);

  function finish(finalAnswers: UserAnswer[]) {
    setSubmitting(true);
    const archetypeId = matchArchetype(finalAnswers);
    const cat = selectVariant(archetypeId, cats);
    track("quiz_completed", { archetype: archetypeId, cat: cat.id });
    flagPull(cat.id); // mark as drawn so the result page records it as collected
    router.push(`/result/${toSlug(archetypeId)}/${toSlug(cat.id)}`);
  }

  function handleAnswer(answer: Answer) {
    if (!questions || submitting) return;

    const next: UserAnswer[] = [
      ...answers,
      { questionId: questions[index].id, answer },
    ];
    setAnswers(next);

    if (index + 1 >= questions.length) {
      finish(next);
    } else {
      setIndex(index + 1);
    }
  }

  if (!questions) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-body text-ink-whisper">
        Shuffling the deck…
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <ProgressBar current={index + 1} total={questions.length} />
      <div className="mt-10">
        <QuestionCard
          question={questions[index]}
          onAnswer={handleAnswer}
          disabled={submitting}
        />
      </div>
    </div>
  );
}
