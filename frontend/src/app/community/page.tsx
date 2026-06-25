"use client";

import { useTranslations } from "next-intl";

import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const POSTS = [
  {
    author: "Lena R.",
    color: "#B0455A",
    tag: "Grammar",
    title: "When do you use 'passé composé' vs 'imparfait'?",
    excerpt:
      "I always mix these up. My teacher explained it with a timeline that finally made it click…",
    replies: 12,
  },
  {
    author: "Paul K.",
    color: "#0E9F6E",
    tag: "Motivation",
    title: "Hit a 30-day streak — here's what kept me going",
    excerpt:
      "Short daily lessons beat long weekend cramming for me. The AI reminders helped a lot.",
    replies: 8,
  },
  {
    author: "Anne S.",
    color: "#4B47E8",
    tag: "Luxembourgish",
    title: "Best resources for Lëtzebuergesch beginners?",
    excerpt: "Looking for podcasts or apps to practise listening between lessons. Recommendations?",
    replies: 5,
  },
];

export default function CommunityPage() {
  return (
    <AppShell>
      <CommunityContent />
    </AppShell>
  );
}

function CommunityContent() {
  const t = useTranslations("pages.community");
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <button type="button" className={buttonClasses("primary", "sm")}>
          {t("newPost")}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {POSTS.map((post) => (
          <Card key={post.title} className="flex gap-3.5 p-4">
            <Avatar name={post.author} color={post.color} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink">{post.author}</span>
                <Badge variant="primary" className="px-2 py-0.5 text-[11px]">
                  {post.tag}
                </Badge>
              </div>
              <h3 className="font-display text-[15px] font-bold text-ink">{post.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{post.excerpt}</p>
              <p className="mt-2 text-[12px] font-semibold text-primary">
                {t("replies", { count: post.replies })}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
