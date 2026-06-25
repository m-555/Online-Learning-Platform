"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { StarIcon } from "@/components/ui/icons";
import { Card } from "@/components/ui/card";
import type { Teacher } from "@/lib/types";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  const t = useTranslations("common");
  const tl = useTranslations("landing");
  const format = useFormatter();

  const price = format.number(teacher.hourly_rate, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <Avatar name={teacher.full_name} color={teacher.avatar_color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-bold text-ink">{teacher.full_name}</span>
            {teacher.is_pro ? <Badge variant="success">Pro</Badge> : null}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
            <StarIcon width={13} height={13} className="text-warning" />
            {teacher.rating.toFixed(1)} · {tl("lessons", { count: teacher.lessons_count })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {teacher.languages.map((code) => (
          <Badge key={code} variant="neutral" className="px-2 py-0.5 text-[11px]">
            {code.toUpperCase()}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted">
          {t("from")} <strong className="text-ink">{price}</strong>
          {t("perHour")}
        </span>
        <a href="#" className={buttonClasses("primary", "sm")}>
          {t("book")}
        </a>
      </div>
    </Card>
  );
}
