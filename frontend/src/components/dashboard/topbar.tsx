"use client";

import { useTranslations } from "next-intl";

import { UserMenu } from "@/components/app/user-menu";
import { LangSwitcher } from "@/components/ui/lang-switcher";
import { SearchIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardTopbar({ avatarColor }: { studentName?: string; avatarColor: string }) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-3">
      <div className="flex max-w-sm flex-1 items-center gap-2 rounded-[10px] border border-border bg-canvas px-3 py-2 text-muted">
        <SearchIcon width={16} height={16} />
        <span className="truncate text-[13px]">{t("search")}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <LangSwitcher />
        <ThemeToggle />
        <UserMenu avatarColor={avatarColor} />
      </div>
    </div>
  );
}
