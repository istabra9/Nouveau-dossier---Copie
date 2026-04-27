"use client";

import { motion } from "framer-motion";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import type { OAuthProvider } from "@/frontend/types";
import { cn } from "@/frontend/utils/cn";

type SocialAuthButtonsProps = {
  mode: "login" | "register";
  next?: string;
  providers?: OAuthProvider[];
};

const socialProviders = [
  {
    id: "google",
    label: "Google",
    badge: "G",
    badgeClassName: "bg-white text-[#db4437]",
  },
  {
    id: "facebook",
    label: "Facebook",
    badge: "f",
    badgeClassName: "bg-[#1877f2] text-white",
  },
  {
    id: "yahoo",
    label: "Yahoo",
    badge: "Y!",
    badgeClassName: "bg-[#6001d2] text-white",
  },
] as const;

export function SocialAuthButtons({
  mode,
  next,
  providers,
}: SocialAuthButtonsProps) {
  const { locale } = useLocale();
  const enabledProviderIds = providers ?? socialProviders.map((provider) => provider.id);
  const enabledProviders = socialProviders.filter((provider) =>
    enabledProviderIds.includes(provider.id),
  );

  const copy =
    locale === "fr"
      ? {
          title:
            mode === "register"
              ? "Creer un compte avec"
              : "Continuer avec",
          divider: "ou utiliser votre email",
        }
      : locale === "ar"
        ? {
            title:
              mode === "register"
                ? "Create an account with"
                : "Continue with",
            divider: "or use your email",
          }
        : {
            title:
              mode === "register"
                ? "Create an account with"
                : "Continue with",
            divider: "or use your email",
          };

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="text-sm font-medium text-ink-soft">{copy.title}</div>

      <div className="grid gap-3 sm:grid-cols-3">
        {enabledProviders.map((provider) => {
          const params = new URLSearchParams({ mode });

          if (next) {
            params.set("next", next);
          }

          const href = `/api/auth/oauth/${provider.id}/start?${params.toString()}`;

          return (
            <motion.a
              key={provider.id}
              href={href}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-3 rounded-[22px] border border-line bg-surface px-4 py-3 text-sm font-semibold text-foreground shadow-[0_12px_28px_rgba(49,14,20,0.06)] hover:border-brand-300 hover:bg-surface-strong"
            >
              <span
                className={cn(
                  "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold",
                  provider.badgeClassName,
                )}
              >
                {provider.badge}
              </span>
              <span>{provider.label}</span>
            </motion.a>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        <span>{copy.divider}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
