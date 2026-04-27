import { Star } from "lucide-react";

import { cn } from "@/frontend/utils/cn";

type TrainingRecommendationStarsProps = {
  rating: number;
  size?: "sm" | "md";
  tone?: "default" | "light";
  showValue?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: {
    star: "h-3.5 w-3.5",
    text: "text-[11px]",
  },
  md: {
    star: "h-4 w-4",
    text: "text-xs",
  },
} as const;

export function TrainingRecommendationStars({
  rating,
  size = "sm",
  tone = "default",
  showValue = true,
  className,
}: TrainingRecommendationStarsProps) {
  const normalized = Math.max(0, Math.min(5, rating));
  const activeStars = Math.floor(normalized + 0.5);
  const palette =
    tone === "light"
      ? {
          active: "text-[#ffd36d]",
          inactive: "text-white/25",
          value: "text-white/88",
        }
      : {
          active: "text-amber-500",
          inactive: "text-slate-300",
          value: "text-foreground/80",
        };

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`Recommended ${normalized.toFixed(1)} out of 5`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const active = index < activeStars;
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size].star,
                active ? palette.active : palette.inactive,
              )}
              fill={active ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          );
        })}
      </div>
      {showValue ? (
        <span className={cn("font-semibold tabular-nums", sizeClasses[size].text, palette.value)}>
          {normalized.toFixed(1)}/5
        </span>
      ) : null}
    </div>
  );
}
