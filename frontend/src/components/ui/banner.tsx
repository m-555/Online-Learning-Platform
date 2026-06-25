"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { XIcon } from "./icons";

interface BannerProps {
  children: React.ReactNode;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  className?: string;
}

export function Banner({ children, action, dismissible = true, className }: BannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-[12px] border border-warning/40 bg-warning-soft px-4 py-3",
        className,
      )}
    >
      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-warning text-[13px] font-bold text-white">
        !
      </span>
      <span className="flex-1 text-[13px] text-warning">{children}</span>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[12.5px] font-bold text-warning underline underline-offset-2"
        >
          {action.label}
        </button>
      ) : null}
      {dismissible ? (
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="text-warning/80 hover:text-warning"
        >
          <XIcon width={16} height={16} />
        </button>
      ) : null}
    </div>
  );
}
