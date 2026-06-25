import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors " +
  "disabled:opacity-60 disabled:cursor-not-allowed select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-700 shadow-sm",
  secondary: "bg-surface text-ink border border-border hover:bg-canvas",
  ghost: "bg-transparent text-primary hover:bg-primary-50",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  // 44px minimum touch target on md/lg, per the design's accessibility rules.
  sm: "text-[13px] px-3.5 py-1.5 rounded-[8px]",
  md: "text-[15px] px-5 min-h-11 rounded-[10px]",
  lg: "text-[17px] px-6 min-h-12 rounded-xl",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
