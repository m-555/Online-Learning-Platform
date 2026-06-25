"use client";

import { useTranslations } from "next-intl";

import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const THREADS = [
  {
    name: "Marc L.",
    color: "#0E9F6E",
    preview: "Great work today! I've shared the passé composé exercises.",
    time: "10:42",
    unread: true,
  },
  {
    name: "Sophie K.",
    color: "#4B47E8",
    preview: "See you tomorrow at 18:00 for the exam prep session.",
    time: "Yesterday",
    unread: true,
  },
  {
    name: "Amal D.",
    color: "#C77700",
    preview: "Here are some business vocabulary notes to review.",
    time: "Mon",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <AppShell>
      <MessagesContent />
    </AppShell>
  );
}

function MessagesContent() {
  const t = useTranslations("pages.messages");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Card className="divide-y divide-border overflow-hidden">
        {THREADS.map((thread) => (
          <div key={thread.name} className="flex items-center gap-3.5 p-4 hover:bg-canvas">
            <Avatar name={thread.name} color={thread.color} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-ink">{thread.name}</span>
                <span className="shrink-0 text-[12px] text-muted">{thread.time}</span>
              </div>
              <p className="truncate text-[13px] text-muted">{thread.preview}</p>
            </div>
            {thread.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
          </div>
        ))}
      </Card>
    </>
  );
}
