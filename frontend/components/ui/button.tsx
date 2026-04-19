"use client";

import { forwardRef } from "react";

import { cn } from "@/frontend/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "brand-ring bg-brand-500 text-white shadow-[0_18px_40px_rgba(190,34,60,0.28)] hover:bg-brand-600",
          variant === "secondary" &&
            "border border-line-strong bg-surface text-foreground backdrop-blur hover:border-brand-300 hover:bg-surface-strong",
          variant === "ghost" &&
            "bg-transparent text-foreground hover:bg-surface",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
