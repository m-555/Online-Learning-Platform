import { getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/layout/site-header";
import { TeacherCard } from "@/components/teachers/teacher-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import { api } from "@/lib/api";
import type { Teacher } from "@/lib/types";

async function getTopTeachers(): Promise<Teacher[]> {
  try {
    return await api.listTeachers({ sort: "top_rated" });
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tCommon = await getTranslations("common");
  const teachers = await getTopTeachers();

  return (
    <div className="min-h-full">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-[1240px] px-6 pb-6 pt-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5">
          <span className="rounded-[5px] bg-surface px-1.5 py-0.5 text-[11px] font-bold text-primary">
            {t("new")}
          </span>
          <span className="text-[12.5px] font-medium text-primary">{t("announce")}</span>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="font-display text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.05] tracking-tight text-ink">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              {t("heroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/placement" className={buttonClasses("primary", "lg")}>
                {t("ctaPrimary")}
              </a>
              <a href="#teachers" className={buttonClasses("secondary", "lg")}>
                {t("ctaSecondary")}
              </a>
            </div>
            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2">
                <Avatar name="Sophie K" color="#4B47E8" size="sm" className="ring-2 ring-canvas" />
                <Avatar name="Marc L" color="#0E9F6E" size="sm" className="ring-2 ring-canvas" />
                <Avatar name="Amal D" color="#C77700" size="sm" className="ring-2 ring-canvas" />
              </div>
              <p className="flex items-center gap-1.5 text-[13px] text-muted">
                <StarIcon width={14} height={14} className="text-warning" />
                <strong className="text-ink">4.9</strong> · {t("socialProof", { count: "2,400" })}
              </p>
            </div>
          </div>

          {/* Decorative hero panel */}
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,#EFEEFD,#F5F6FA)] lg:block dark:bg-[linear-gradient(135deg,#23204F,#181B22)]">
            <div className="absolute inset-6 rounded-xl border border-border bg-surface/70 backdrop-blur-sm" />
            <div className="absolute bottom-8 left-8 right-8 rounded-xl border border-border bg-surface p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar name="Marc L" color="#0E9F6E" />
                <div>
                  <div className="text-[14px] font-bold text-ink">Marc L.</div>
                  <div className="text-[12px] text-muted">★ 5.0 · LB · EN · FR</div>
                </div>
                <Badge variant="primary" className="ml-auto">
                  AI pick
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top-rated teachers */}
      <section id="teachers" className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-[26px] font-bold text-ink">{t("topTeachers")}</h2>
          <a href="#" className="flex items-center gap-1 text-[13px] font-semibold text-primary">
            {tCommon("seeAll")} <ArrowRightIcon width={14} height={14} />
          </a>
        </div>

        {teachers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.slice(0, 6).map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-[14px] text-muted">
            Teachers will appear here once the API is running.
          </p>
        )}
      </section>

      <footer className="mx-auto max-w-[1240px] px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7 text-[13px] text-muted">
          <span>© {new Date().getFullYear()} Aula</span>
          <span className="font-mono text-[12px]">WCAG AA · LB / EN / FR · Light &amp; dark</span>
        </div>
      </footer>
    </div>
  );
}
