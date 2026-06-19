import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";
import { Masthead } from "@/components/Masthead";

export const metadata: Metadata = {
  title: "The Quiz",
  description: "Ten questions to find which cat lives in you.",
};

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Masthead />
      <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-4">
        <QuizFlow />
      </div>
    </main>
  );
}
