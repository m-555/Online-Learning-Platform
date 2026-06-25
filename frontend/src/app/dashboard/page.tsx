"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartIcon, StarIcon } from "@/components/ui/icons";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Dashboard } from "@/lib/types";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const format = useFormatter();

  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api
      .dashboard(token)
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return <p className="text-muted">Loading dashboard…</p>;
  }

  const { stats, upcoming_classes, recommendation, matched_teacher } = data;

  return (
    <>
      <h1 className="font-display text-[26px] font-bold tracking-tight text-ink">
        {t("welcome", { name: data.student_name })}
      </h1>
      <p className="mt-1 text-[14px] text-muted">{t("streak", { days: stats.streak_days })}</p>

      {/* Stat cards */}
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("profile")}>
          <div className="font-display text-[22px] font-extrabold text-ink">
            {stats.profile_completion}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${stats.profile_completion}%` }}
            />
          </div>
        </StatCard>
        <StatCard label={t("nextClass")}>
          <div className="font-display text-[22px] font-extrabold text-ink">
            {stats.next_class_label}
          </div>
          {upcoming_classes[0] ? (
            <div className="mt-1 text-[12px] font-semibold text-success">
              {format.dateTime(new Date(upcoming_classes[0].start_time), {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          ) : null}
        </StatCard>
        <StatCard label={t("lessonsDone")}>
          <div className="font-display text-[22px] font-extrabold text-ink">
            {stats.lessons_done}
          </div>
          <div className="mt-1 text-[12px] text-muted">{t("thisMonth")}</div>
        </StatCard>
        <StatCard label={t("messages")}>
          <div className="font-display text-[22px] font-extrabold text-ink">
            {stats.messages_count}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-primary">{t("viewInbox")} →</div>
        </StatCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Upcoming classes */}
          <Card className="p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="font-display text-[16px] font-bold text-ink">{t("upcoming")}</h2>
              <span className="text-[12.5px] font-semibold text-primary">{t("calendar")} →</span>
            </div>
            {upcoming_classes.length > 0 ? (
              upcoming_classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3.5 rounded-[12px] border border-border p-3.5"
                >
                  <div className="rounded-[10px] bg-primary-50 px-3 py-2 text-center text-primary">
                    <div className="text-[11px] font-bold uppercase">
                      {format.dateTime(new Date(c.start_time), { month: "short" })}
                    </div>
                    <div className="font-display text-[18px] font-extrabold">
                      {format.dateTime(new Date(c.start_time), { day: "numeric" })}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-ink">{c.title}</div>
                    <div className="text-[12.5px] text-muted">
                      {format.dateTime(new Date(c.start_time), {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {c.teacher_name}
                    </div>
                  </div>
                  <Button size="sm">{t("join")}</Button>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-muted">{t("noUpcoming")}</p>
            )}
          </Card>

          {/* AI recommendation */}
          {recommendation ? (
            <div className="rounded-[14px] bg-[linear-gradient(135deg,#23204F,#3A37C9)] p-5 text-white">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A7E8C8]" />
                <span className="text-[11.5px] font-semibold">{t("aiRecommendation")}</span>
              </div>
              <h3 className="font-display text-[18px] font-bold">{recommendation.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
                {recommendation.body}
              </p>
              <div className="mt-4 flex gap-2.5">
                <button className="rounded-[9px] bg-white px-4 py-2 text-[13px] font-semibold text-[#23204F]">
                  {t("startExercises")}
                </button>
                <button className="rounded-[9px] border border-white/30 px-4 py-2 text-[13px] font-semibold text-white">
                  {tc("notNow")}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* AI-matched teacher */}
        {matched_teacher ? (
          <Card className="p-5">
            <h2 className="font-display text-[16px] font-bold text-ink">{t("matched")}</h2>
            <p className="mt-0.5 text-[12.5px] text-muted">{t("matchedSub", { level: "A2" })}</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={matched_teacher.full_name} color={matched_teacher.avatar_color} />
              <div>
                <div className="text-[15px] font-bold text-ink">{matched_teacher.full_name}</div>
                <div className="flex items-center gap-1 text-[12.5px] text-muted">
                  <StarIcon width={13} height={13} className="text-warning" />
                  {matched_teacher.rating.toFixed(1)} ·{" "}
                  {matched_teacher.languages.map((l) => l.toUpperCase()).join(" · ")}
                </div>
              </div>
              {matched_teacher.is_pro ? (
                <Badge variant="primary" className="ml-auto">
                  AI pick
                </Badge>
              ) : null}
            </div>
            <p className="mt-3.5 rounded-[10px] bg-canvas p-3 text-[12.5px] leading-relaxed text-muted">
              {matched_teacher.short_bio}
            </p>
            <div className="mt-3.5 flex gap-2">
              <Button className="flex-1">{tc("bookClass")}</Button>
              <button
                type="button"
                aria-label="Favorite"
                className="flex w-10 items-center justify-center rounded-[9px] border border-border text-primary"
              >
                <HeartIcon width={16} height={16} />
              </button>
            </div>
          </Card>
        ) : null}
      </div>
    </>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-2.5 text-[12.5px] text-muted">{label}</div>
      {children}
    </Card>
  );
}
