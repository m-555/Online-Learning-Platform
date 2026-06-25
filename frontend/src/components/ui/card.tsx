import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-[0_1px_2px_rgba(20,23,30,0.04)]",
        className,
      )}
      {...props}
    />
  );
}
