import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[8px]",
        "bg-[linear-gradient(145deg,#5B57F0,#4B47E8)] shadow-[0_4px_12px_rgba(75,71,232,0.32)]",
        className,
      )}
    >
      <span className="h-[44%] w-[44%] rounded-[50%_50%_50%_2px] border-[2.2px] border-white" />
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  wordClassName,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-7 w-7", markClassName)} />
      <span
        className={cn(
          "font-display text-[20px] font-extrabold tracking-tight text-ink",
          wordClassName,
        )}
      >
        Aula
      </span>
    </span>
  );
}
