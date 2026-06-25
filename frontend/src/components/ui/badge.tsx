import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeVariant = "primary" | "success" | "warning" | "neutral";

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-50 text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  neutral: "bg-canvas text-muted border border-border",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
