import Image from "next/image";
import Link from "next/link";

import { cn } from "@/frontend/utils/cn";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  const width = compact ? 170 : 244;
  const height = compact ? 40 : 57;

  return (
    <Link
      href="/"
      aria-label="Advancia Trainings"
      className={cn(
        "group inline-flex items-center text-start",
        compact ? "max-w-[170px]" : "max-w-[250px]",
        className,
      )}
    >
      <span
        className={cn(
          "brand-mark-shell flex items-center justify-center rounded-[24px] transition duration-200 group-hover:-translate-y-0.5",
          compact ? "px-3 py-2" : "px-4 py-3",
        )}
      >
        <Image
          src="/advancia-logo.svg"
          alt="Advancia Training"
          width={width}
          height={height}
          priority={!compact}
          className={cn(
            "h-auto w-full",
            compact ? "max-w-[170px]" : "max-w-[244px]",
          )}
        />
      </span>
    </Link>
  );
}
