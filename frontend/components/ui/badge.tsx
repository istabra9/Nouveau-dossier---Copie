import type { HTMLAttributes } from "react";

import { cn } from "@/frontend/utils/cn";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "brand" | "soft" | "dark";
};

export function Badge({ className, tone = "brand", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
        tone === "brand" && "bg-brand-100 text-brand-700",
        tone === "soft" && "bg-surface text-foreground",
        tone === "dark" && "bg-brand-900 text-white",
        className,
      )}
      {...props}
    />
  );
}
