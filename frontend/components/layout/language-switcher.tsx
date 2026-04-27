"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Globe2 } from "lucide-react";

import { localeMeta, locales } from "@/frontend/i18n/config";
import { cn } from "@/frontend/utils/cn";
import { useLocale } from "@/frontend/components/providers/locale-provider";

type LanguageSwitcherProps = {
  variant?: "inline" | "floating";
  className?: string;
};

export function LanguageSwitcher({
  variant = "inline",
  className,
}: LanguageSwitcherProps) {
  const { locale, direction, messages, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const isFloating = variant === "floating";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={switcherRef}
      className={cn(
        isFloating
          ? cn(
              "fixed bottom-4 z-50 sm:bottom-5",
              direction === "rtl" ? "left-4 sm:left-5" : "right-4 sm:right-5",
            )
          : "relative shrink-0",
        className,
      )}
    >
      <div className="relative">
        {open ? (
          <div
            id={panelId}
            role="menu"
            aria-label={messages.language.select}
            className={cn(
              "surface-panel absolute z-30 min-w-[12rem] rounded-[1.4rem] border border-line/80 p-2 shadow-[0_24px_50px_rgba(49,14,20,0.2)] backdrop-blur-xl",
              isFloating ? "bottom-[calc(100%+0.75rem)]" : "top-[calc(100%+0.75rem)]",
              direction === "rtl" ? "left-0" : "right-0",
            )}
          >
            <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
              {messages.language.label}
            </div>
            <div className="space-y-1">
              {locales.map((item) => {
                const active = locale === item;

                return (
                  <button
                    key={item}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setLocale(item);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "bg-brand-500 text-white shadow-[0_12px_24px_rgba(190,34,60,0.24)]"
                        : "text-foreground hover:bg-brand-50",
                    )}
                    aria-label={`${messages.language.select}: ${localeMeta[item].label}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold uppercase leading-none",
                          active ? "bg-white/15 text-white" : "bg-surface text-foreground",
                        )}
                      >
                        {item}
                      </span>
                      <span>{localeMeta[item].label}</span>
                    </span>
                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "surface-panel relative flex h-12 w-12 items-center justify-center rounded-full border border-line/80 bg-surface-strong/95 text-foreground backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-brand-600",
            isFloating
              ? "shadow-[0_22px_48px_rgba(49,14,20,0.18)]"
              : "shadow-[0_14px_32px_rgba(49,14,20,0.1)]",
            open ? "text-brand-600" : "",
          )}
          aria-label={`${messages.language.select}: ${localeMeta[locale].label}`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <Globe2 className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 inline-flex min-w-[1.45rem] items-center justify-center rounded-full border border-background bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white shadow-[0_8px_18px_rgba(190,34,60,0.32)]">
            {locale}
          </span>
        </button>
      </div>
    </div>
  );
}
