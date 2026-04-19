import Link from "next/link";
import { BriefcaseBusiness, ChartColumnIncreasing, Code2, MonitorSmartphone } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";
import { translateCategoryName } from "@/frontend/i18n/helpers";
import type { Category } from "@/frontend/types";

type CategoriesShowcaseProps = {
  categories: Array<Category & { trainingCount: number }>;
};

const showcaseIcons = [Code2, BriefcaseBusiness, ChartColumnIncreasing, MonitorSmartphone];
const showcaseColors = [
  "from-[#7c4dff] to-[#8b5cf6]",
  "from-[#10b981] to-[#22c55e]",
  "from-[#3b82f6] to-[#60a5fa]",
  "from-[#f97316] to-[#fb923c]",
];

export async function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
  const locale = await getCurrentLocale();
  const copy = getMessages(locale);

  return (
    <section id="categories" className="section-wrap py-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">Categories</h2>
          </div>
          <Link href="/trainings" className="text-lg font-medium text-brand-500 hover:text-brand-700">
            View all
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.slice(0, 8).map((category, index) => {
          const Icon = showcaseIcons[index % showcaseIcons.length];
          const color = showcaseColors[index % showcaseColors.length];

          return (
            <Link
              key={category.id}
              href={`/trainings?category=${category.slug}`}
              className="rounded-[28px] border border-line bg-white p-8 shadow-[0_12px_30px_rgba(28,23,25,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(28,23,25,0.08)]"
            >
              <div className={`flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-gradient-to-br ${color} p-5 text-white shadow-[0_12px_24px_rgba(28,23,25,0.12)]`}>
                <Icon className="h-8 w-8" />
              </div>
              <div className="mt-8">
                <div className="text-2xl font-semibold text-foreground">
                  {translateCategoryName(category, locale)}
                </div>
                <div className="mt-3 text-lg text-ink-soft">
                  {category.trainingCount} {copy.categories.programs}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
