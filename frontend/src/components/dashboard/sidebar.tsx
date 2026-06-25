"use client";

import { useTranslations } from "next-intl";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

function NavItem({ label, active, badge }: { label: string; active?: boolean; badge?: number }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium",
        active ? "bg-primary-50 font-semibold text-primary" : "text-muted hover:text-ink",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-[2px]", active ? "bg-primary" : "bg-border")} />
      {label}
      {badge ? (
        <span className="ml-auto rounded-full bg-primary px-1.5 py-px text-[11px] font-bold text-on-primary">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

export function DashboardSidebar({ messagesCount }: { messagesCount: number }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ta = useTranslations("dashboard");

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
      <div className="mb-6 px-2">
        <Logo />
      </div>
      <nav className="flex flex-col gap-0.5">
        <NavItem label={t("dashboard")} active />
        <NavItem label={t("findTeacher")} />
        <NavItem label={t("myClasses")} />
        <NavItem label={t("messages")} badge={messagesCount || undefined} />
        <NavItem label={t("materials")} />
        <NavItem label={t("community")} />
      </nav>
      <div className="mt-auto rounded-[12px] bg-canvas p-3.5">
        <div className="text-[12px] font-bold text-ink">{ta("aiRecommendation")}</div>
        <button
          type="button"
          className="mt-2 w-full rounded-[8px] bg-primary py-1.5 text-[12px] font-semibold text-on-primary"
        >
          {tc("start")}
        </button>
      </div>
    </aside>
  );
}
