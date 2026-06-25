"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { MailIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { ApiError, api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { cn } from "@/lib/cn";

export type AuthMode = "login" | "signup";

export function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
}: {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const titleId = useId();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function reset() {
    setError(null);
    setLoading(false);
  }

  function close() {
    reset();
    setSentTo(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const token = await api.login({ email, password });
        setToken(token.access_token);
        close();
        router.push("/dashboard");
        router.refresh();
      } else {
        const result = await api.signup({ email, password, full_name: fullName, role: "student" });
        setToken(result.token.access_token);
        setSentTo(email);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Post-signup confirmation step — a single screen, never stacked over the form.
  if (sentTo) {
    return (
      <Modal open={open} onClose={close} titleId={titleId} className="text-center">
        <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-primary-50 text-primary">
          <MailIcon width={28} height={28} />
        </div>
        <h2 id={titleId} className="font-display text-[19px] font-bold text-ink">
          {t("checkInbox")}
        </h2>
        <p className="mt-2 text-[13.5px] text-muted">{t("sentLinkTo")}</p>
        <p className="mt-1 text-[14px] font-semibold text-ink">{sentTo}</p>
        <Button className="mt-5 w-full">{t("openEmail")}</Button>
        <button
          type="button"
          onClick={() => {
            close();
            router.push("/dashboard");
            router.refresh();
          }}
          className="mt-4 border-t border-border pt-3.5 text-[13px] font-semibold text-muted hover:text-ink"
        >
          {t("skipExplore")}
        </button>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={close} titleId={titleId}>
      <div className="mb-5 flex items-center justify-between">
        <h2 id={titleId} className="font-display text-[18px] font-bold text-ink">
          {mode === "login" ? t("welcomeBack") : t("submitSignUp")}
        </h2>
      </div>

      {/* Segmented control: a single surface, not two overlapping flows. */}
      <div className="mb-5 flex rounded-[10px] bg-canvas p-1" role="tablist">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              onModeChange(m);
              reset();
            }}
            className={cn(
              "flex-1 rounded-[7px] py-1.5 text-[13.5px] font-semibold transition-colors",
              mode === m ? "bg-surface text-ink shadow-sm" : "text-muted",
            )}
          >
            {m === "login" ? t("logInTab") : t("signUpTab")}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <SocialButton provider="Google" label={t("continueWith", { provider: "Google" })} />
        <SocialButton provider="Apple" label={t("continueWith", { provider: "Apple" })} />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[12px] text-muted">{t("or")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {mode === "signup" ? (
          <Field
            label={t("fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        ) : null}
        <Field
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="anne@school.lu"
        />
        <Field
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {error ? (
          <p role="alert" className="text-[13px] font-medium text-danger">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? "…" : mode === "login" ? t("submitLogIn") : t("submitSignUp")}
        </Button>
      </form>

      <p className="mt-4 text-center text-[12.5px] text-muted">
        {mode === "login" ? t("noAccount") : t("haveAccount")}{" "}
        <button
          type="button"
          onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
          className="font-semibold text-primary"
        >
          {mode === "login" ? t("signUpFree") : t("logInTab")}
        </button>
      </p>
    </Modal>
  );
}

function SocialButton({ provider, label }: { provider: "Google" | "Apple"; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex flex-1 items-center justify-center gap-2 rounded-[9px] border border-border py-2.5 text-[13px] font-semibold text-ink hover:bg-canvas"
    >
      <span className={cn("font-extrabold", provider === "Google" && "text-[#4285F4]")}>
        {provider === "Google" ? "G" : ""}
      </span>
      {provider}
    </button>
  );
}
