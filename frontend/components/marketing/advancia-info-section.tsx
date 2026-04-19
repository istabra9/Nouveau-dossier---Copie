import Link from "next/link";
import { Award, Globe2, GraduationCap, Sparkles } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { getCurrentLocale } from "@/frontend/i18n/server";

const copy = {
  en: {
    eyebrow: "About Advancia",
    title: "A leading IT training center in Tunisia.",
    body:
      "Advancia is a leading IT training center in Tunisia offering international certifications in partnership with global IT companies.",
    pillars: [
      {
        icon: GraduationCap,
        title: "Expert trainers",
        text: "Hand-picked specialists with field experience.",
      },
      {
        icon: Award,
        title: "International certifications",
        text: "Official prep for global IT credentials.",
      },
      {
        icon: Globe2,
        title: "Global partners",
        text: "Working with the world\u2019s top IT companies.",
      },
      {
        icon: Sparkles,
        title: "Modern experience",
        text: "Live sessions, hybrid formats, friendly support.",
      },
    ],
    ctaPrimary: "Browse trainings",
    ctaSecondary: "Talk to us",
  },
  fr: {
    eyebrow: "\u00c0 propos d\u2019Advancia",
    title: "Centre de formation IT leader en Tunisie.",
    body:
      "Advancia est un centre de formation IT de premier plan en Tunisie, proposant des certifications internationales en partenariat avec les plus grands acteurs mondiaux de l\u2019IT.",
    pillars: [
      {
        icon: GraduationCap,
        title: "Formateurs experts",
        text: "Sp\u00e9cialistes s\u00e9lectionn\u00e9s avec exp\u00e9rience terrain.",
      },
      {
        icon: Award,
        title: "Certifications internationales",
        text: "Pr\u00e9paration officielle aux titres IT mondiaux.",
      },
      {
        icon: Globe2,
        title: "Partenaires mondiaux",
        text: "Avec les leaders technologiques mondiaux.",
      },
      {
        icon: Sparkles,
        title: "Exp\u00e9rience moderne",
        text: "Sessions live, formats hybrides, support sympathique.",
      },
    ],
    ctaPrimary: "Voir les formations",
    ctaSecondary: "Nous contacter",
  },
  ar: {
    eyebrow: "\u0639\u0646 \u0623\u062f\u0641\u0627\u0646\u0633\u064a\u0627",
    title: "\u0645\u0631\u0643\u0632 \u062a\u062f\u0631\u064a\u0628 \u0631\u0627\u0626\u062f \u0641\u064a \u062a\u0648\u0646\u0633.",
    body:
      "\u0623\u062f\u0641\u0627\u0646\u0633\u064a\u0627 \u0645\u0631\u0643\u0632 \u062a\u062f\u0631\u064a\u0628 \u062a\u0642\u0646\u064a \u0631\u0627\u0626\u062f \u064a\u0642\u062f\u0651\u0645 \u0634\u0647\u0627\u062f\u0627\u062a \u062f\u0648\u0644\u064a\u0629 \u0628\u0627\u0644\u062a\u0639\u0627\u0648\u0646 \u0645\u0639 \u0623\u0643\u0628\u0631 \u0634\u0631\u0643\u0627\u062a \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0641\u064a \u0627\u0644\u0639\u0627\u0644\u0645.",
    pillars: [
      {
        icon: GraduationCap,
        title: "\u0645\u062f\u0631\u0651\u0628\u0648\u0646 \u062e\u0628\u0631\u0627\u0621",
        text: "\u0645\u062a\u062e\u0635\u0635\u0648\u0646 \u0645\u0639 \u062e\u0628\u0631\u0629 \u0645\u064a\u062f\u0627\u0646\u064a\u0629.",
      },
      {
        icon: Award,
        title: "\u0634\u0647\u0627\u062f\u0627\u062a \u062f\u0648\u0644\u064a\u0629",
        text: "\u062a\u062d\u0636\u064a\u0631 \u0631\u0633\u0645\u064a \u0644\u0644\u0634\u0647\u0627\u062f\u0627\u062a \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629.",
      },
      {
        icon: Globe2,
        title: "\u0634\u0631\u0643\u0627\u0621 \u0639\u0627\u0644\u0645\u064a\u0648\u0646",
        text: "\u0628\u0627\u0644\u062a\u0639\u0627\u0648\u0646 \u0645\u0639 \u0627\u0644\u0631\u0648\u0627\u062f.",
      },
      {
        icon: Sparkles,
        title: "\u062a\u062c\u0631\u0628\u0629 \u062d\u062f\u064a\u062b\u0629",
        text: "\u062c\u0644\u0633\u0627\u062a \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u062f\u0639\u0645 \u0648\u062f\u0648\u062f.",
      },
    ],
    ctaPrimary: "\u062a\u0635\u0641\u062d \u0627\u0644\u062f\u0648\u0631\u0627\u062a",
    ctaSecondary: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627",
  },
} as const;

export async function AdvanciaInfoSection() {
  const locale = await getCurrentLocale();
  const t = copy[locale] ?? copy.en;

  return (
    <section id="about-advancia" className="section-wrap py-16">
      <Reveal className="cinematic-panel relative overflow-hidden p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="stat-chip">{t.eyebrow}</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              <span className="headline-gradient">{t.title}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
              {t.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/trainings"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(190,34,60,0.28)] hover:-translate-y-0.5 hover:bg-brand-600"
              >
                {t.ctaPrimary}
              </Link>
              <a
                href="https://www.advancia-training.com/contacts/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-line-strong bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-300"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {t.pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="surface-panel p-5 hover-lift"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-foreground">
                    {pillar.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {pillar.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
