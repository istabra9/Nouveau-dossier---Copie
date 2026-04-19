import Image from "next/image";
import Link from "next/link";

import { cn } from "@/frontend/utils/cn";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
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
      <Image
        src="/advancia-logo.svg"
        alt="Advancia Training"
        width={compact ? 170 : 244}
        height={compact ? 40 : 57}
        priority={!compact}
        className={cn(
          "h-auto w-full transition duration-200 group-hover:-translate-y-0.5",
          compact ? "max-w-[170px]" : "max-w-[244px]",
        )}
      />
    </Link>
  );
}
