"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { TeacherCard } from "@/components/teachers/teacher-card";
import { cn } from "@/lib/cn";
import { api } from "@/lib/api";
import type { Teacher } from "@/lib/types";

const FILTERS = [
  { value: "", labelKey: "all" },
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
  { value: "lb", label: "LB" },
] as const;

export default function TeachersPage() {
  return (
    <AppShell>
      <TeachersContent />
    </AppShell>
  );
}

function TeachersContent() {
  const t = useTranslations("pages.teachers");
  const [language, setLanguage] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    api
      .listTeachers({ language: language || undefined, sort: "top_rated" })
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, [language]);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setLanguage(f.value)}
            className={cn(
              "rounded-[8px] px-3.5 py-1.5 text-[13px] font-semibold",
              language === f.value
                ? "bg-primary text-on-primary"
                : "border border-border text-muted hover:text-ink",
            )}
          >
            {"labelKey" in f ? t(f.labelKey) : f.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-[13px] text-muted">{t("results", { count: teachers.length })}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </>
  );
}
