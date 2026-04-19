import type { InputHTMLAttributes } from "react";

import { cn } from "@/frontend/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm text-foreground outline-none backdrop-blur placeholder:text-ink-soft/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/70",
        className,
      )}
      {...props}
    />
  );
}
