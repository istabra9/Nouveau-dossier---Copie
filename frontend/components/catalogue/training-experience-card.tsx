"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";

type TrainingExperienceCardProps = {
  trainer: string;
  sessionDate: string;
  duration: string;
  format: string;
  location: string;
  isAuthenticated: boolean;
};

const experienceCopy = {
  en: {
    eyebrow: "Session vibe",
    glow: "Friendly ADVANCIA glow ✨",
    title: "Your next learning win starts here. 😄",
    intro:
      "Everything is lined up for a smooth ADVANCIA experience: clear dates, a friendly trainer, and a bright path to jump in.",
    trainer: "Coach",
    date: "Next dates",
    duration: "Time",
    location: "Where",
    highlightsLabel: "What makes this one fun",
    highlights: [
      "Hands-on moments 🛠️",
      "Friendly guidance 🤝",
      "Clear structure ✨",
      "Progress energy 🚀",
    ],
    flowTitle: "Flow",
    flowBody: "Browse the details, send your request, then get guided to the next step.",
    formatTitle: "Format mood",
    formatBody: "This session runs in a way that keeps the rhythm easy to follow.",
    ready: "You are ready to send your request whenever you are. 🙌",
    loginHint: "Log in to send your request and keep the cheerful flow going. 👋",
  },
  fr: {
    eyebrow: "Ambiance session",
    glow: "Touche ADVANCIA chaleureuse ✨",
    title: "Votre prochaine victoire d'apprentissage commence ici. 😄",
    intro:
      "Tout est pret pour une experience ADVANCIA fluide : dates claires, formateur accueillant et parcours simple pour avancer.",
    trainer: "Coach",
    date: "Prochaines dates",
    duration: "Duree",
    location: "Lieu",
    highlightsLabel: "Pourquoi c'est sympa",
    highlights: [
      "Moments pratiques 🛠️",
      "Guidage humain 🤝",
      "Parcours clair ✨",
      "Belle energie 🚀",
    ],
    flowTitle: "Parcours",
    flowBody: "Consultez les details, envoyez votre demande, puis laissez-vous guider.",
    formatTitle: "Style de session",
    formatBody: "Le format garde un rythme simple, lisible et agreable.",
    ready: "Vous etes pret a envoyer votre demande quand vous voulez. 🙌",
    loginHint: "Connectez-vous pour envoyer votre demande et garder ce rythme joyeux. 👋",
  },
  ar: {
    eyebrow: "أجواء الجلسة",
    glow: "لمسة ADVANCIA ودودة ✨",
    title: "انطلاقة نجاحك التالي تبدأ هنا. 😄",
    intro:
      "كل شيء جاهز لتجربة ADVANCIA سلسة: مواعيد واضحة، مدرب ودود، ومسار مشرق للانطلاق.",
    trainer: "المدرب",
    date: "المواعيد القادمة",
    duration: "المدة",
    location: "المكان",
    highlightsLabel: "ما يجعلها ممتعة",
    highlights: [
      "لحظات تطبيقية 🛠️",
      "توجيه ودي 🤝",
      "هيكلة واضحة ✨",
      "طاقة تقدم 🚀",
    ],
    flowTitle: "المسار",
    flowBody: "تصفح التفاصيل، أرسل طلبك، ثم دعنا نرشدك للخطوة التالية.",
    formatTitle: "طابع الصيغة",
    formatBody: "الجلسة تجري بإيقاع سهل المتابعة.",
    ready: "أنت جاهز لإرسال طلبك متى شئت. 🙌",
    loginHint: "سجل الدخول لإرسال طلبك ومواصلة التجربة المرحة. 👋",
  },
} as const;

export function TrainingExperienceCard({
  trainer,
  sessionDate,
  duration,
  format,
  location,
  isAuthenticated,
}: TrainingExperienceCardProps) {
  const { locale } = useLocale();
  const copy = experienceCopy[locale] ?? experienceCopy.en;
  const factCards = [
    {
      label: copy.trainer,
      value: trainer,
      icon: UserRound,
    },
    {
      label: copy.date,
      value: sessionDate,
      icon: CalendarDays,
    },
    {
      label: copy.duration,
      value: duration,
      icon: Clock3,
    },
    {
      label: copy.location,
      value: location,
      icon: MapPin,
    },
  ];

  return (
    <div className="surface-panel-strong ambient-border relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,181,124,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(223,54,72,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="stat-chip">
            <Sparkles className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </div>
          <div className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-brand-700 shadow-[0_14px_24px_rgba(121,40,46,0.08)]">
            {copy.glow}
          </div>
        </div>

        <div>
          <div className="text-3xl font-semibold">{copy.title}</div>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{copy.intro}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {factCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[24px] border border-line bg-surface p-4 shadow-[0_16px_30px_rgba(121,40,46,0.06)]"
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-brand-50 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  {item.label}
                </div>
                <div className="mt-3 font-semibold">{item.value}</div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[28px] border border-line bg-surface-strong p-5 shadow-[0_18px_34px_rgba(121,40,46,0.08)]">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-600">
            {copy.highlightsLabel}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.highlights.map((item, index) => (
              <div
                key={item}
                className={`rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-foreground ${
                  index === 1 ? "float-slow" : index === 3 ? "float-reverse" : ""
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-surface-soft p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-brand-600">
                {copy.flowTitle}
              </div>
              <div className="mt-2 text-sm text-ink-soft">{copy.flowBody}</div>
            </div>
            <div className="rounded-[22px] bg-surface-soft p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-brand-600">
                {copy.formatTitle}
              </div>
              <div className="mt-2 text-sm text-ink-soft">
                {copy.formatBody} {format}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-[linear-gradient(135deg,#1f1321_0%,#5e1830_52%,#df3648_100%)] px-4 py-4 text-sm text-white shadow-[0_22px_44px_rgba(121,40,46,0.18)]">
          {isAuthenticated ? copy.ready : copy.loginHint}
        </div>
      </div>
    </div>
  );
}
