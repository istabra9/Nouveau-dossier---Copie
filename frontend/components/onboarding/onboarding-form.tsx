"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, Sparkles, UserRoundCog } from "lucide-react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";

import {
  getCertificationLabel,
  getCertificationProvider,
  getDomainLabel,
  getOnboardingCopy,
  getSkillLabel,
  onboardingCertifications,
  onboardingDomains,
  onboardingSkills,
} from "@/frontend/content/onboarding";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { cn } from "@/frontend/utils/cn";
import type { UserOnboarding } from "@/frontend/types";

type OnboardingFormProps = {
  userName: string;
  initialValue?: UserOnboarding;
};

type Step = 0 | 1 | 2;

export function OnboardingForm({
  userName,
  initialValue,
}: OnboardingFormProps) {
  const { locale } = useLocale();
  const copy = getOnboardingCopy(locale);
  const [step, setStep] = useState<Step>(0);
  const [domain, setDomain] = useState(initialValue?.domain ?? "");
  const [managesPeople, setManagesPeople] = useState<boolean | null>(
    initialValue?.managesPeople ?? null,
  );
  const [skills, setSkills] = useState<string[]>(initialValue?.skills ?? []);
  const [certifications, setCertifications] = useState<string[]>(
    initialValue?.certifications ?? [],
  );
  const [skillSearch, setSkillSearch] = useState("");
  const [certificationSearch, setCertificationSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deferredSkillSearch = useDeferredValue(skillSearch);
  const deferredCertificationSearch = useDeferredValue(certificationSearch);

  const filteredSkills = useMemo(() => {
    const normalized = deferredSkillSearch.trim().toLowerCase();

    return onboardingSkills.filter((item) =>
      getSkillLabel(item.id, locale).toLowerCase().includes(normalized),
    );
  }, [deferredSkillSearch, locale]);

  const filteredCertifications = useMemo(() => {
    const normalized = deferredCertificationSearch.trim().toLowerCase();

    return onboardingCertifications.filter((item) => {
      const title = getCertificationLabel(item.id, locale).toLowerCase();
      const provider = getCertificationProvider(item.id, locale).toLowerCase();
      return title.includes(normalized) || provider.includes(normalized);
    });
  }, [deferredCertificationSearch, locale]);

  function toggleSelection(
    current: string[],
    nextValue: string,
    limit: number,
  ) {
    if (current.includes(nextValue)) {
      return current.filter((item) => item !== nextValue);
    }

    if (current.length >= limit) {
      return current;
    }

    return [...current, nextValue];
  }

  function goNext() {
    if (step === 0 && !domain) {
      setError(locale === "fr" ? "Choisissez un domaine." : "Choose a domain.");
      return;
    }

    setError(null);
    setStep((current) => Math.min(current + 1, 2) as Step);
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0) as Step);
  }

  function handleSubmit() {
    setError(null);

    startTransition(async () => {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain,
            managesPeople,
            skills,
            certifications,
          }),
        });

        const payload = (await response.json()) as {
          message?: string;
          redirectTo?: string;
        };

        if (!response.ok) {
          setError(payload.message ?? "Unable to save your onboarding.");
          return;
        }

        window.location.assign(payload.redirectTo ?? "/profile");
      } catch {
        setError(
          locale === "fr"
            ? "Impossible d'enregistrer le formulaire."
            : "Unable to save your onboarding.",
        );
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="surface-panel-strong overflow-hidden rounded-[36px] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,247,235,0.94),rgba(255,240,219,0.9))] px-5 py-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-[0_14px_26px_rgba(190,34,60,0.12)]">
            <UserRoundCog className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium sm:text-base">{copy.banner}</div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {copy.progress.map((label, index) => {
            const active = index === step;
            const complete = index < step;

            return (
              <div
                key={label}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
                  active
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-line bg-white text-ink-soft",
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm">
                  {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                {label}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-brand-50 text-brand-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-ink-soft">
              {locale === "fr" ? "Bienvenue" : "Welcome"}
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              {userName.split(" ")[0]}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="mt-10"
          >
            {step === 0 ? (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
                    {copy.domainTitle}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-ink-soft">
                    {copy.domainHint}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {onboardingDomains.map((option) => {
                    const selected = option.id === domain;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDomain(option.id)}
                        className={cn(
                          "flex items-center gap-4 rounded-[26px] border px-5 py-4 text-left transition",
                          selected
                            ? "border-brand-300 bg-brand-50 shadow-[0_20px_36px_rgba(190,34,60,0.12)]"
                            : "border-line bg-white/80 hover:border-brand-200 hover:bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border",
                            selected
                              ? "border-brand-500 bg-brand-500 text-white"
                              : "border-ink-soft/40 bg-white",
                          )}
                        >
                          {selected ? <Check className="h-3.5 w-3.5" /> : null}
                        </span>
                        <span className="text-base font-medium">
                          {getDomainLabel(option.id, locale)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.managesPeople}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[true, false].map((value) => {
                      const active = managesPeople === value;
                      return (
                        <button
                          key={String(value)}
                          type="button"
                          onClick={() => setManagesPeople(value)}
                          className={cn(
                            "rounded-[26px] border px-5 py-4 text-left text-base font-medium transition",
                            active
                              ? "border-brand-300 bg-brand-50 text-brand-700"
                              : "border-line bg-white/80 hover:border-brand-200 hover:bg-white",
                          )}
                        >
                          {value ? copy.yes : copy.no}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
                    {copy.skillsTitle}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-ink-soft">
                    {copy.skillsHint}
                  </p>
                </div>

                <div className="relative max-w-3xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                  <Input
                    value={skillSearch}
                    onChange={(event) => setSkillSearch(event.target.value)}
                    placeholder={copy.skillsSearch}
                    className="h-14 rounded-[22px] bg-white pl-11"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.skillsPopular}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {filteredSkills.map((option) => {
                      const selected = skills.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setSkills((current) =>
                              toggleSelection(current, option.id, 8),
                            )
                          }
                          className={cn(
                            "rounded-full border px-4 py-3 text-sm font-semibold transition",
                            selected
                              ? "border-brand-300 bg-brand-500 text-white shadow-[0_16px_28px_rgba(190,34,60,0.16)]"
                              : "border-line bg-white hover:border-brand-200 hover:bg-brand-50",
                          )}
                        >
                          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                            {selected ? <Check className="h-3.5 w-3.5" /> : "+"}
                          </span>
                          {getSkillLabel(option.id, locale)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
                    {copy.certificationsTitle}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-ink-soft">
                    {copy.certificationsHint}
                  </p>
                </div>

                <div className="relative max-w-3xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                  <Input
                    value={certificationSearch}
                    onChange={(event) => setCertificationSearch(event.target.value)}
                    placeholder={copy.certificationsSearch}
                    className="h-14 rounded-[22px] bg-white pl-11"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.certificationsPopular}
                  </h2>
                  <div className="grid gap-4">
                    {filteredCertifications.map((option) => {
                      const selected = certifications.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setCertifications((current) =>
                              toggleSelection(current, option.id, 6),
                            )
                          }
                          className={cn(
                            "grid items-center gap-4 rounded-[28px] border p-5 text-left transition sm:grid-cols-[auto_1fr_auto]",
                            selected
                              ? "border-brand-300 bg-brand-50 shadow-[0_18px_34px_rgba(190,34,60,0.12)]"
                              : "border-line bg-white hover:border-brand-200 hover:bg-white",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md border",
                              selected
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-ink-soft/40 bg-white",
                            )}
                          >
                            {selected ? <Check className="h-4 w-4" /> : null}
                          </span>
                          <span className="space-y-2">
                            <span className="block text-xl font-semibold tracking-tight">
                              {getCertificationLabel(option.id, locale)}
                            </span>
                            <span className="block text-sm text-ink-soft">
                              {getCertificationProvider(option.id, locale)}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br text-sm font-bold text-white shadow-[0_18px_32px_rgba(29,41,57,0.16)]",
                              option.accent,
                            )}
                          >
                            {option.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-line bg-white/80 px-5 py-4 shadow-[0_18px_30px_rgba(22,28,45,0.06)] backdrop-blur">
          <div>
            {step === 2 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-sm font-medium text-ink-soft hover:text-foreground disabled:opacity-60"
              >
                {copy.skip}
              </button>
            ) : (
              <span className="text-sm text-ink-soft" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {step > 0 ? (
              <Button variant="secondary" onClick={goBack}>
                {copy.back}
              </Button>
            ) : null}
            {step < 2 ? (
              <Button onClick={goNext}>{copy.next}</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !domain}>
                {isSubmitting ? copy.saving : copy.finish}
              </Button>
            )}
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-[22px] bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
