"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Button } from "./ui/Button";

interface ShareButtonProps {
  url: string;
  cardImageUrl: string;
  fileName: string;
  title: string;
  text: string;
}

type Status = "idle" | "working" | "copied" | "saved";

/**
 * Shares the collectible card as a real image. On devices that support sharing
 * files (mostly mobile), it hands the PNG to the native share sheet — text,
 * email, socials. Elsewhere it falls back to copying the result link.
 */
export function ShareButton({ url, cardImageUrl, fileName, title, text }: ShareButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function fetchCardFile(): Promise<File | null> {
    try {
      const res = await fetch(cardImageUrl);
      if (!res.ok) return null;
      const blob = await res.blob();
      return new File([blob], fileName, { type: "image/png" });
    } catch {
      return null;
    }
  }

  async function share() {
    setStatus("working");
    track("result_shared");

    const file = await fetchCardFile();

    // Best path: native share sheet with the actual card image.
    if (
      file &&
      typeof navigator !== "undefined" &&
      navigator.canShare?.({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], title, text, url });
        setStatus("idle");
        return;
      } catch {
        // Cancelled or failed — fall through to copying the link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("idle");
      return;
    }
    setTimeout(() => setStatus("idle"), 2200);
  }

  async function download() {
    setStatus("working");
    const file = await fetchCardFile();
    if (!file) {
      setStatus("idle");
      return;
    }
    const href = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2200);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button onClick={share} disabled={status === "working"}>
        {status === "copied" ? "Link copied!" : "Share your card"}
      </Button>
      <Button onClick={download} variant="secondary" disabled={status === "working"}>
        {status === "saved" ? "Saved!" : "Download"}
      </Button>
    </div>
  );
}
