import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  as?: "div" | "article" | "section";
}

export function Card({
  children,
  className = "",
  elevated = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={`bg-paper rounded-card ${
        elevated ? "shadow-paper-md" : "shadow-paper-sm"
      } ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
