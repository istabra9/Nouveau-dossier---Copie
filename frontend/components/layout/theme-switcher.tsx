"use client";

import { Moon, SunMedium } from "lucide-react";

import { useTheme } from "@/frontend/components/providers/theme-provider";
import { cn } from "@/frontend/utils/cn";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="surface-panel fixed left-4 bottom-26 z-40 flex items-center gap-1 px-2 py-2 shadow-[0_20px_44px_rgba(49,14,20,0.14)] sm:left-auto sm:right-5 sm:bottom-24">
      {[
        { id: "light", label: "Light", icon: SunMedium },
        { id: "dark", label: "Dark", icon: Moon },
      ].map((item) => {
        const Icon = item.icon;
        const active = theme === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id as "light" | "dark")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
              active
                ? "bg-brand-500 text-white shadow-[0_12px_24px_rgba(190,34,60,0.24)]"
                : "bg-surface text-foreground hover:bg-brand-50",
            )}
            aria-label={`Switch to ${item.label.toLowerCase()} mode`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
