"use client";

import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { Button } from "./ui/Button";

/**
 * Homepage CTA. Fires the quiz_started analytics event, then routes to /quiz.
 */
export function BeginButton() {
  const router = useRouter();

  function begin() {
    track("quiz_started");
    router.push("/quiz");
  }

  return (
    <Button onClick={begin} className="text-lg px-10">
      Begin
    </Button>
  );
}
