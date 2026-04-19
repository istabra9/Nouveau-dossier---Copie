"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

import { TrainingCard } from "@/frontend/components/catalogue/training-card";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import { translateCategoryName } from "@/frontend/i18n/helpers";
import type { Category, Training } from "@/frontend/types";

type CatalogueExplorerProps = {
  trainings: Training[];
  categories: Array<Category & { trainingCount: number }>;
  initialQuery?: string;
  initialCategory?: string;
};

type SortMode = "best" | "relevance" | "name-asc" | "name-desc";

export function CatalogueExplorer({
  trainings,
  categories,
  initialQuery = "",
  initialCategory = "all",
}: CatalogueExplorerProps) {
  const { locale, messages } = useLocale();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const normalized = deferredQuery.toLowerCase().trim();

    return trainings
      .map((training) => {
        const haystack = `${training.code} ${training.title} ${training.summary} ${training.tags.join(" ")} ${training.outcomes.join(" ")}`.toLowerCase();
        const matchesQuery = !normalized || haystack.includes(normalized);
        const matchesCategory = category === "all" || training.categorySlug === category;

        if (!matchesQuery || !matchesCategory) {
          return null;
        }

        const titleMatch = normalized && training.title.toLowerCase().includes(normalized) ? 8 : 0;
        const codeMatch = normalized && training.code.toLowerCase().includes(normalized) ? 5 : 0;
        const tagMatch = normalized && training.tags.some((tag) => tag.toLowerCase().includes(normalized)) ? 4 : 0;
        const relevance = training.rankingScore + titleMatch + codeMatch + tagMatch;

        return { training, relevance };
      })
      .filter((item): item is { training: Training; relevance: number } => Boolean(item))
      .sort((left, right) => {
        switch (sortMode) {
          case "relevance":
            return right.relevance - left.relevance;
          case "name-asc":
            return left.training.title.localeCompare(right.training.title, locale);
          case "name-desc":
            return right.training.title.localeCompare(left.training.title, locale);
          case "best":
          default:
            return (
              right.training.rankingScore - left.training.rankingScore ||
              right.training.rating - left.training.rating
            );
        }
      });
  }, [category, deferredQuery, locale, sortMode, trainings]);

  return (
    <div className="space-y-8">
      <div className="surface-panel grid gap-4 p-4 xl:grid-cols-[1.4fr_0.9fr_0.8fr]">
        <div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/80 px-4">
          <Search className="h-4 w-4 text-brand-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={messages.catalogue.searchPlaceholder}
            className="h-auto border-0 bg-transparent px-0 py-4 shadow-none ring-0 focus:ring-0"
          />
        </div>
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">{messages.catalogue.allCategories}</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {translateCategoryName(item, locale)}
            </option>
          ))}
        </Select>
        <Select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
          <option value="best">{messages.catalogue.best}</option>
          <option value="relevance">{messages.catalogue.relevance}</option>
          <option value="name-asc">{messages.catalogue.nameAz}</option>
          <option value="name-desc">{messages.catalogue.nameZa}</option>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="stat-chip">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {messages.catalogue.sortBy}:{" "}
          {sortMode === "best"
            ? messages.catalogue.best
            : sortMode === "relevance"
              ? messages.catalogue.relevance
              : sortMode === "name-asc"
                ? messages.catalogue.nameAz
                : messages.catalogue.nameZa}
        </div>
        <div className="text-sm font-medium text-ink-soft">
          {filtered.length} {messages.catalogue.results}
        </div>
      </div>

      {filtered.length ? (
        <motion.div layout className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ training }, index) => (
            <motion.div
              key={training.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.015 }}
            >
              <TrainingCard training={training} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="surface-panel p-10 text-center">
          <h3 className="text-2xl font-semibold">{messages.catalogue.noResultsTitle}</h3>
          <p className="mt-3 text-sm text-ink-soft">
            {messages.catalogue.noResultsDescription}
          </p>
        </div>
      )}
    </div>
  );
}
