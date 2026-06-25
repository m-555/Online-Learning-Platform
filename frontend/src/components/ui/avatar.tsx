import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-[12px] rounded-[8px]",
  md: "h-11 w-11 text-[16px] rounded-[12px]",
  lg: "h-12 w-12 text-[17px] rounded-[14px]",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function Avatar({
  name,
  color = "#4B47E8",
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold text-white",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
