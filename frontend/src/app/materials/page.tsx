"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MaterialsPage() {
  return (
    <AppShell>
      <MaterialsContent />
    </AppShell>
  );
}

function MaterialsContent() {
  const t = useTranslations("pages.materials");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Card className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-primary-50 text-primary">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <p className="max-w-sm text-[14px] leading-relaxed text-muted">{t("empty")}</p>
        <Link href="/teachers" className={buttonClasses("primary", "md")}>
          {t("cta")}
        </Link>
      </Card>
    </>
  );
}
