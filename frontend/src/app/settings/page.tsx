"use client";

import { useTranslations } from "next-intl";

import { AppShell, useAppUser } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LangSwitcher } from "@/components/ui/lang-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="text-[13.5px] font-medium text-muted">{label}</span>
      <div className="text-[14px] font-semibold text-ink">{children}</div>
    </div>
  );
}

function SettingsContent() {
  const t = useTranslations("pages.settings");
  const user = useAppUser();
  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">
        {t("account")}
      </h2>
      <Card className="mb-6 divide-y divide-border">
        <Row label={t("email")}>{user.email}</Row>
        <Row label={t("role")}>
          <span className="capitalize">{user.role}</span>
        </Row>
        <Row label={t("status")}>
          {user.is_email_verified ? (
            <Badge variant="success">{t("verified")}</Badge>
          ) : (
            <Badge variant="warning">{t("unverified")}</Badge>
          )}
        </Row>
      </Card>

      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">
        {t("preferences")}
      </h2>
      <Card className="divide-y divide-border">
        <Row label={t("interfaceLanguage")}>
          <LangSwitcher />
        </Row>
        <Row label={t("theme")}>
          <ThemeToggle />
        </Row>
      </Card>
    </div>
  );
}
