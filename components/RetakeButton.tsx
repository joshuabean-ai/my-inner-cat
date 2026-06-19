"use client";

import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { Button } from "./ui/Button";

export function RetakeButton() {
  const router = useRouter();

  function retake() {
    track("quiz_retaken");
    router.push("/quiz");
  }

  return (
    <Button onClick={retake} variant="secondary">
      Take it again
    </Button>
  );
}
