"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13.5px] font-medium",
        active ? "bg-primary-50 font-semibold text-primary" : "text-muted hover:text-ink",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-[2px]", active ? "bg-primary" : "bg-border")} />
      {label}
    </Link>
  );
}

export function DashboardSidebar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ta = useTranslations("dashboard");
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/teachers", label: t("findTeacher") },
    { href: "/messages", label: t("messages") },
    { href: "/materials", label: t("materials") },
    { href: "/community", label: t("community") },
  ];

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
      <div className="mb-6 px-2">
        <Logo />
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}
      </nav>
      <div className="mt-auto rounded-[12px] bg-canvas p-3.5">
        <div className="text-[12px] font-bold text-ink">{ta("aiRecommendation")}</div>
        <Link
          href="/placement"
          className="mt-2 block w-full rounded-[8px] bg-primary py-1.5 text-center text-[12px] font-semibold text-on-primary"
        >
          {tc("start")}
        </Link>
      </div>
    </aside>
  );
}
