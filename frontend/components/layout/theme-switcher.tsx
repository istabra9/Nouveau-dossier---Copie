"use client";

import { useSyncExternalStore } from "react";
import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/frontend/components/providers/theme-provider";
import { cn } from "@/frontend/utils/cn";

type ThemeSwitcherProps = {
  variant?: "inline" | "floating";
  className?: string;
};

const subscribeNoop = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

export function ThemeSwitcher({
  variant = "inline",
  className,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getMountedClient,
    getMountedServer,
  );
  const isFloating = variant === "floating";
  const isDark = mounted && theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const buttonClassName = cn(
    isFloating
      ? "surface-panel fixed left-4 bottom-26 z-40 flex h-13 w-13 items-center justify-center shadow-[0_20px_44px_rgba(49,14,20,0.14)] sm:left-auto sm:right-5 sm:bottom-24"
      : "group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface-strong shadow-[0_14px_32px_rgba(49,14,20,0.1)] backdrop-blur hover:border-brand-300 hover:bg-surface",
    className,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        suppressHydrationWarning
        className={buttonClassName}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,178,132,0.18),transparent_60%)] opacity-70" />
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(255,245,241,0.72))] text-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(49,14,20,0.14)]" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextTheme} mode`}
      className={buttonClassName}
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,178,132,0.18),transparent_60%)] opacity-70 transition group-hover:opacity-100" />
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(255,245,241,0.72))] text-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(49,14,20,0.14)]">
        <SunMedium
          className={cn(
            "absolute h-4.5 w-4.5 transition duration-300",
            isDark
              ? "translate-y-6 rotate-180 opacity-0"
              : "translate-y-0 rotate-0 opacity-100",
          )}
        />
        <MoonStar
          className={cn(
            "absolute h-4.5 w-4.5 transition duration-300",
            isDark
              ? "translate-y-0 rotate-0 opacity-100"
              : "-translate-y-6 -rotate-180 opacity-0",
          )}
        />
      </span>
      <span className="sr-only">
        {isDark ? "Dark mode enabled" : "Light mode enabled"}
      </span>
    </button>
  );
}
