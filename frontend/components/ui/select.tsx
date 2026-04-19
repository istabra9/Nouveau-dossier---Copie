import type { SelectHTMLAttributes } from "react";

import { cn } from "@/frontend/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm text-foreground outline-none backdrop-blur focus:border-brand-400 focus:ring-2 focus:ring-brand-200/70",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
