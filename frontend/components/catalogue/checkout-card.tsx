"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Landmark,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import type { CheckoutPaymentMethod } from "@/frontend/types";

type CheckoutCardProps = {
  trainingSlug: string;
  trainer: string;
  sessionDate: string;
  duration: string;
  format: string;
  location: string;
  isAuthenticated: boolean;
};

type CheckoutResponse = {
  ok: boolean;
  message: string;
  invoiceNumber?: string;
  paymentStatus?: string;
  paymentMethod?: string;
};

const checkoutCopy = {
  en: {
    title: "Choose how to pay",
    paymentMode: "Payment method",
    trainer: "Trainer",
    date: "Date",
    duration: "Duration",
    location: "Location",
    methods: {
      card: "Bank card",
      bank_transfer: "Bank transfer",
      on_site: "Pay on site",
    },
    hints: {
      card: "Immediate confirmation",
      bank_transfer: "Manual validation after transfer",
      on_site: "Reserve now and pay at the session",
    },
    receiptReady: "Receipt and invoice prepared automatically",
  },
  fr: {
    title: "Choisissez votre paiement",
    paymentMode: "Mode de paiement",
    trainer: "Formateur",
    date: "Date",
    duration: "Duree",
    location: "Lieu",
    methods: {
      card: "Carte bancaire",
      bank_transfer: "Virement bancaire",
      on_site: "Paiement sur place",
    },
    hints: {
      card: "Confirmation immediate",
      bank_transfer: "Validation manuelle apres reception",
      on_site: "Reservation maintenant, paiement le jour de la session",
    },
    receiptReady: "Recu et facture prepares automatiquement",
  },
  ar: {
    title: "Choose how to pay",
    paymentMode: "Payment method",
    trainer: "Trainer",
    date: "Date",
    duration: "Duration",
    location: "Location",
    methods: {
      card: "Card",
      bank_transfer: "Transfer",
      on_site: "On site",
    },
    hints: {
      card: "Instant confirmation",
      bank_transfer: "Manual validation",
      on_site: "Reserve now and pay later",
    },
    receiptReady: "Receipt and invoice prepared automatically",
  },
} as const;

export function CheckoutCard({
  trainingSlug,
  trainer,
  sessionDate,
  duration,
  format,
  location,
  isAuthenticated,
}: CheckoutCardProps) {
  const { locale, messages } = useLocale();
  const copy = checkoutCopy[locale];
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("card");

  const paymentOptions = [
    {
      id: "card" as const,
      icon: CreditCard,
      label: copy.methods.card,
      hint: copy.hints.card,
    },
    {
      id: "bank_transfer" as const,
      icon: Landmark,
      label: copy.methods.bank_transfer,
      hint: copy.hints.bank_transfer,
    },
    {
      id: "on_site" as const,
      icon: Wallet,
      label: copy.methods.on_site,
      hint: copy.hints.on_site,
    },
  ];

  function handleCheckout() {
    startTransition(async () => {
      setIsPending(true);

      try {
        const response = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainingSlug, paymentMethod }),
        });

        const payload = (await response.json()) as CheckoutResponse;
        setResult(payload);
      } finally {
        setIsPending(false);
      }
    });
  }

  return (
    <div className="surface-panel-strong space-y-5 p-6">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          {messages.training.enrollment}
        </div>
        <div className="mt-3 text-3xl font-semibold">{copy.title}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] border border-line bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            {copy.trainer}
          </div>
          <div className="mt-2 font-semibold">{trainer}</div>
        </div>
        <div className="rounded-[24px] border border-line bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            {copy.date}
          </div>
          <div className="mt-2 font-semibold">{sessionDate}</div>
        </div>
        <div className="rounded-[24px] border border-line bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            {copy.duration}
          </div>
          <div className="mt-2 font-semibold">{duration}</div>
        </div>
        <div className="rounded-[24px] border border-line bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            {copy.location}
          </div>
          <div className="mt-2 font-semibold">{location}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
          {copy.paymentMode}
        </div>
        <div className="grid gap-3">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = paymentMethod === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id)}
                className={`flex items-start gap-4 rounded-[24px] border p-4 text-start transition ${
                  isSelected
                    ? "border-brand-300 bg-brand-50 text-brand-700 shadow-[0_18px_35px_rgba(190,34,60,0.12)]"
                    : "border-line bg-white/80 text-foreground hover:border-brand-200 hover:bg-white"
                }`}
              >
                <div className="mt-1 rounded-2xl bg-white/80 p-2">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="mt-1 text-sm text-ink-soft">{option.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-[24px] border border-line bg-white/80 p-4 text-sm text-ink-soft">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          {messages.training.secureCheckout}
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-brand-600" />
          {format}
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-brand-600" />
          {copy.location}: {location}
        </div>
        <div className="flex items-center gap-3">
          <BadgeCheck className="h-4 w-4 text-brand-600" />
          {copy.receiptReady}
        </div>
      </div>

      {isAuthenticated ? (
        <Button onClick={handleCheckout} disabled={isPending} className="w-full">
          {isPending ? messages.training.processing : messages.training.enrollAndPay}
        </Button>
      ) : (
        <Link href="/login" className="block">
          <Button className="w-full">{messages.training.loginToEnroll}</Button>
        </Link>
      )}

      {result ? (
        <div
          className={`rounded-[24px] p-4 text-sm ${
            result.paymentStatus === "pending"
              ? "bg-amber-50 text-amber-800"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          <div className="font-semibold">{result.message}</div>
          {result.invoiceNumber ? (
            <div className="mt-2">
              {messages.training.invoice} {result.invoiceNumber} - {result.paymentStatus}
              {result.paymentMethod ? ` - ${result.paymentMethod}` : ""}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
