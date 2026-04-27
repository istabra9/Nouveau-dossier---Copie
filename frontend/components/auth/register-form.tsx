"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { SocialAuthButtons } from "@/frontend/components/auth/social-auth-buttons";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import type { OAuthProvider } from "@/frontend/types";
import { cn } from "@/frontend/utils/cn";

const AVATAR_CHOICES = [
  { id: "sunny-bunny", emoji: "🐰", label: "Sunny Bunny" },
  { id: "brave-fox", emoji: "🦊", label: "Brave Fox" },
  { id: "wise-owl", emoji: "🦉", label: "Wise Owl" },
  { id: "cosmic-cat", emoji: "🐱", label: "Cosmic Cat" },
  { id: "happy-panda", emoji: "🐼", label: "Happy Panda" },
  { id: "rocket-dog", emoji: "🐶", label: "Rocket Dog" },
  { id: "lucky-koala", emoji: "🐨", label: "Lucky Koala" },
  { id: "tiny-tiger", emoji: "🐯", label: "Tiny Tiger" },
  { id: "magic-unicorn", emoji: "🦄", label: "Magic Unicorn" },
  { id: "chill-frog", emoji: "🐸", label: "Chill Frog" },
  { id: "swift-eagle", emoji: "🦅", label: "Swift Eagle" },
  { id: "gentle-deer", emoji: "🦌", label: "Gentle Deer" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function RegisterForm({
  oauthError,
  providers,
}: {
  oauthError?: string;
  providers?: OAuthProvider[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<(typeof AVATAR_CHOICES)[number]>(
    AVATAR_CHOICES[0],
  );
  const { messages } = useLocale();
  const t = messages.auth;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);
    setIsSubmitting(true);

    try {
      const ageRaw = formData.get("age");
      const ageNumber = ageRaw ? Number(ageRaw) : undefined;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          department: formData.get("department"),
          password: formData.get("password"),
          age: Number.isFinite(ageNumber) ? ageNumber : undefined,
          sex: formData.get("sex") || undefined,
          funnyAvatar: avatar.label,
          avatarEmoji: avatar.emoji,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(payload.message ?? t.registerErrorGeneric);
        return;
      }

      form.reset();
      window.location.assign(payload.redirectTo ?? "/onboarding");
    } catch {
      setError(t.registerErrorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="surface-panel-strong w-full max-w-[680px] p-8 sm:p-10"
    >
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="stat-chip w-fit">{t.registerEyebrow}</div>
        <h1 className="text-4xl font-semibold tracking-tight">{t.registerTitle}</h1>
      </motion.div>

      <SocialAuthButtons mode="register" providers={providers} />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <motion.div variants={itemVariants} className="space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t.registerAvatar}</label>
            <span className="text-xs text-ink-soft">{avatar.label}</span>
          </div>
          <p className="text-xs text-ink-soft">{t.registerAvatarHint}</p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {AVATAR_CHOICES.map((choice) => {
              const active = choice.id === avatar.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setAvatar(choice)}
                  aria-label={choice.label}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-2xl border text-2xl transition",
                    active
                      ? "border-brand-400 bg-brand-50 shadow-[0_10px_22px_rgba(190,34,60,0.18)] scale-110"
                      : "border-line bg-white/80 hover:border-brand-200 hover:bg-brand-50/40",
                  )}
                >
                  <span className="select-none">{choice.emoji}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">{t.registerFullName}</label>
          <Input
            name="name"
            placeholder={t.registerFullNamePlaceholder}
            autoComplete="name"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">{t.registerEmail}</label>
          <Input
            name="email"
            type="email"
            placeholder={t.registerEmailPlaceholder}
            autoComplete="email"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.registerAge}</label>
          <Input
            name="age"
            type="number"
            min={10}
            max={120}
            placeholder={t.registerAgePlaceholder}
            inputMode="numeric"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.registerSex}</label>
          <select
            name="sex"
            className="h-12 w-full rounded-[18px] border border-line bg-white/85 px-4 text-sm font-medium text-foreground outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
            defaultValue=""
          >
            <option value="" disabled>
              —
            </option>
            <option value="female">{t.registerSexFemale}</option>
            <option value="male">{t.registerSexMale}</option>
            <option value="other">{t.registerSexOther}</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.registerCompany}</label>
          <Input
            name="company"
            placeholder={t.registerCompanyPlaceholder}
            autoComplete="organization"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-sm font-medium">{t.registerDepartment}</label>
          <Input
            name="department"
            placeholder={t.registerDepartmentPlaceholder}
            autoComplete="organization-title"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">{t.registerPassword}</label>
          <Input
            name="password"
            type="password"
            placeholder={t.registerPasswordPlaceholder}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </motion.div>

        {oauthError ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700 sm:col-span-2"
          >
            {oauthError}
          </motion.p>
        ) : null}

        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700 sm:col-span-2"
          >
            {error}
          </motion.p>
        ) : null}

        <motion.div variants={itemVariants} className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t.registerPending : t.registerSubmit}
          </Button>
        </motion.div>
      </form>

      <motion.p variants={itemVariants} className="mt-6 text-sm text-ink-soft">
        {t.registerHasAccount}{" "}
        <Link href="/login" className="font-semibold text-brand-600">
          {t.registerLogin}
        </Link>
      </motion.p>
    </motion.div>
  );
}
