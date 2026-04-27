import Link from "next/link";
import {
  Bot,
  Code2,
  LayoutPanelTop,
  PlaySquare,
  Sparkles,
} from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { Button } from "@/frontend/components/ui/button";
import { getCurrentLocale } from "@/frontend/i18n/server";

export async function PlatformExperienceSection() {
  const locale = await getCurrentLocale();
  const isFrench = locale === "fr";

  const platformCards = [
    {
      title: isFrench ? "Etapes faciles 😄" : "Easy steps 😄",
      text: isFrench
        ? "Choisissez, comparez, puis avancez sans friction."
        : "Choose, compare, and move forward without friction.",
      icon: LayoutPanelTop,
      emoji: "🎯",
      tint: "from-[#fff0d1] to-[#ffe2d7]",
    },
    {
      title: isFrench ? "Pratique live 🚀" : "Live practice 🚀",
      text: isFrench
        ? "Des sessions concretes avec une vraie energie de groupe."
        : "Real sessions with genuine group energy.",
      icon: PlaySquare,
      emoji: "🎈",
      tint: "from-[#ffe7ef] to-[#fff2d9]",
    },
    {
      title: isFrench ? "Assistant cool 🤖" : "Cheerful assistant 🤖",
      text: isFrench
        ? "Posez une question et obtenez une piste utile tout de suite."
        : "Ask a question and get a useful next step right away.",
      icon: Bot,
      emoji: "✨",
      tint: "from-[#efe9ff] to-[#ffe6f0]",
    },
    {
      title: isFrench ? "Suivi joyeux 📈" : "Playful progress 📈",
      text: isFrench
        ? "Reperez vos prochaines etapes sans ecran triste ni surcharge."
        : "Spot your next steps without dull or overloaded screens.",
      icon: Code2,
      emoji: "🌈",
      tint: "from-[#e4f7ff] to-[#eef7e8]",
    },
  ];

  const sectionCopy = isFrench
    ? {
        eyebrow: "Plateforme en mode pep's",
        title: "Une facon plus fun, moderne et claire de naviguer.",
        body:
          "Nous avons remplace le ton trop strict par une interface plus vivante: plus de sourire, plus de couleur, plus de rythme, et toujours une vraie structure produit.",
        pills: ["Navigation joyeuse 😎", "Micro-motions douces ✨", "Repere rapide 🗓️"],
        boardEyebrow: "Fun board",
        boardTitle: "Le parcours donne envie d'avancer.",
        boardBody:
          "Choisissez une ambiance, suivez la date, demandez votre place, puis laissez Advancia Support vous guider.",
        ctaPrimary: "Explorer maintenant 😎",
        ctaSecondary: "Voir le calendrier 🗓️",
        chatOne: "Je veux une formation motivante 😄",
        chatTwo: "Essayez IA, cloud ou leadership 🚀",
        chatThree: "Parfait, je veux une prochaine date !",
        meterTitle: "Cheer meter",
        meterOne: "Clarte",
        meterTwo: "Motion",
        meterThree: "Guidage",
        meterFour: "Fun",
        footerNote:
          "Le resultat: une plateforme plus lumineuse, plus utile, et plus memorable. 🎉",
      }
    : {
        eyebrow: "Platform joy mode",
        title: "A more fun, modern, and cheerful way to explore.",
        body:
          "We swapped the stiff vibe for a brighter interface with more smile, more color, more rhythm, and the same real product structure underneath.",
        pills: ["Friendly navigation 😎", "Soft micro-motion ✨", "Fast date spotting 🗓️"],
        boardEyebrow: "Fun board",
        boardTitle: "The journey feels exciting now.",
        boardBody:
          "Pick a learning mood, track the next date, send your request, and let Advancia Support guide the next step.",
        ctaPrimary: "Start exploring 😎",
        ctaSecondary: "See calendar 🗓️",
        chatOne: "I want a motivating training path 😄",
        chatTwo: "Try AI, cloud, or leadership 🚀",
        chatThree: "Perfect, show me the next date!",
        meterTitle: "Cheer meter",
        meterOne: "Clarity",
        meterTwo: "Motion",
        meterThree: "Guidance",
        meterFour: "Fun",
        footerNote:
          "Result: a brighter, more useful, and more memorable platform. 🎉",
      };

  return (
    <section className="section-wrap py-12">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Reveal className="surface-panel-strong relative overflow-hidden p-7 sm:p-9">
          <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-[#ffd166]/35 blur-3xl float-slow" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#ff8ba7]/22 blur-3xl float-reverse" />

          <div className="relative text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/72">
            {sectionCopy.eyebrow}
          </div>
          <h2 className="relative mt-4 text-4xl font-semibold tracking-tight text-foreground">
            {sectionCopy.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-ink-soft">{sectionCopy.body}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {sectionCopy.pills.map((pill, index) => (
              <div
                key={pill}
                className={`rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-[0_14px_24px_rgba(121,40,46,0.08)] ${
                  index === 1 ? "emoji-bounce" : index === 2 ? "wiggle-soft" : ""
                }`}
              >
                {pill}
              </div>
            ))}
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
            {platformCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-line bg-surface p-4 shadow-[0_16px_30px_rgba(121,40,46,0.08)] backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br ${item.tint} text-brand-700`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl">{item.emoji}</div>
                  </div>
                  <div className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">{item.text}</div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal
          delay={0.06}
          className="surface-panel-strong relative overflow-hidden p-7 sm:p-9"
        >
          <div className="absolute right-6 top-6 text-4xl emoji-bounce">✨</div>
          <div className="absolute bottom-5 left-6 text-4xl wiggle-soft">🎉</div>

          <div className="relative rounded-[30px] border border-line bg-surface-strong p-5 shadow-[0_22px_42px_rgba(223,54,72,0.1)]">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {sectionCopy.boardEyebrow}
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {sectionCopy.boardTitle}
                </div>
              </div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#df3648_0%,#ff7a45_100%)] text-white shadow-[0_18px_34px_rgba(223,54,72,0.22)]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm text-ink-soft">{sectionCopy.boardBody}</p>

            <div className="mt-5 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-3">
                <div className="w-fit rounded-2xl bg-brand-50 px-4 py-3 text-sm text-foreground">
                  {sectionCopy.chatOne}
                </div>
                <div className="ml-auto w-fit rounded-2xl bg-[#1a1220] px-4 py-3 text-sm text-white">
                  {sectionCopy.chatTwo}
                </div>
                <div className="w-fit rounded-2xl bg-surface-soft px-4 py-3 text-sm text-foreground">
                  {sectionCopy.chatThree}
                </div>
              </div>

              <div className="rounded-[26px] border border-line bg-surface p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {sectionCopy.meterTitle}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: sectionCopy.meterOne, value: "98%", emoji: "🎯" },
                    { label: sectionCopy.meterTwo, value: "24/7", emoji: "✨" },
                    { label: sectionCopy.meterThree, value: "A+", emoji: "🤖" },
                    { label: sectionCopy.meterFour, value: "100%", emoji: "🌈" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-line bg-surface-strong p-4 text-center shadow-[0_12px_22px_rgba(121,40,46,0.06)]"
                    >
                      <div className="text-2xl">{item.emoji}</div>
                      <div className="mt-2 text-xl font-semibold">{item.value}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-soft">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-dashed border-brand-200 bg-brand-50/70 px-4 py-3 text-sm text-brand-700">
              {sectionCopy.footerNote}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
              <Link href="/trainings">
                <Button>{sectionCopy.ctaPrimary}</Button>
              </Link>
              <Link href="/trainings/calendar">
                <Button variant="secondary">{sectionCopy.ctaSecondary}</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
