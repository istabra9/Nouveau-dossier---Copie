"use client";

import { Globe2 } from "lucide-react";

import { localeMeta, locales } from "@/frontend/i18n/config";
import { cn } from "@/frontend/utils/cn";
import { useLocale } from "@/frontend/components/providers/locale-provider";

export function LanguageSwitcher() {
  const { locale, direction, messages, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "surface-panel fixed inset-x-4 bottom-4 z-50 flex items-center gap-2 px-3 py-3 shadow-[0_22px_48px_rgba(49,14,20,0.16)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5",
        direction === "rtl" ? "sm:left-5" : "sm:right-5",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Globe2 className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
          {messages.language.label}
        </div>
        <div className="flex flex-wrap gap-1">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLocale(item)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                locale === item
                  ? "bg-brand-500 text-white shadow-[0_12px_24px_rgba(190,34,60,0.24)]"
                  : "bg-surface text-foreground hover:bg-brand-50",
              )}
              aria-label={`${messages.language.select}: ${localeMeta[item].label}`}
            >
              <span className="sm:hidden">
                {item === "en" ? "EN" : item === "fr" ? "FR" : "AR"}
              </span>
              <span className="hidden sm:inline">{localeMeta[item].label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
