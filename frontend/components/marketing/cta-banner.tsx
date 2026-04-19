import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { getCurrentLocale } from "@/frontend/i18n/server";

const copy = {
  en: {
    eyebrow: "Ready when you are",
    title: "Start your next certification today.",
    body: "Free orientation. Friendly humans. Zero pressure.",
    primary: "Sign up",
    secondary: "Browse trainings",
  },
  fr: {
    eyebrow: "Quand vous voulez",
    title: "Lancez votre prochaine certification.",
    body: "Orientation gratuite. \u00c9quipe sympa. Zero pression.",
    primary: "Cr\u00e9er un compte",
    secondary: "Voir les formations",
  },
  ar: {
    eyebrow: "\u062c\u0627\u0647\u0632\u0648\u0646",
    title: "\u0627\u0628\u062f\u0623 \u0634\u0647\u0627\u062f\u062a\u0643 \u0627\u0644\u0642\u0627\u062f\u0645\u0629 \u0627\u0644\u064a\u0648\u0645.",
    body: "\u062a\u0648\u062c\u064a\u0647 \u0645\u062c\u0627\u0646\u064a \u0648\u062f\u0639\u0645 \u0648\u062f\u0648\u062f.",
    primary: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
    secondary: "\u062a\u0635\u0641\u062d \u0627\u0644\u062f\u0648\u0631\u0627\u062a",
  },
} as const;

export async function CtaBanner() {
  const locale = await getCurrentLocale();
  const t = copy[locale] ?? copy.en;

  return (
    <section className="section-wrap py-12">
      <div className="cta-banner-shell relative overflow-hidden rounded-[34px] p-8 text-white sm:p-12">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t.eyebrow}
            </span>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {t.title}
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/78 sm:text-lg">{t.body}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="h-14 px-7 text-base">
                {t.primary}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/trainings">
              <button className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur hover:bg-white/16">
                {t.secondary}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
