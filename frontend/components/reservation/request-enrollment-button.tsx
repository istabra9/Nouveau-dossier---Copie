"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";

type Props = {
  trainingSlug: string;
  isAuthenticated: boolean;
};

type ReservationResponse = {
  ok: boolean;
  message?: string;
  duplicate?: boolean;
};

export function RequestEnrollmentButton({
  trainingSlug,
  isAuthenticated,
}: Props) {
  const { locale, messages } = useLocale();
  const copy =
    locale === "fr"
      ? {
          eyebrow: "Demande de place",
          idle: "Un clic et votre demande part en douceur vers l'equipe ADVANCIA. 🚀",
          pending: "Votre demande est en route... ✨",
          submitted: "Demande envoyee 🎉",
          submittedBody: "Super, votre place potentielle est maintenant en cours de revue.",
          duplicateBody: "Votre demande est deja dans la file, donc pas besoin de recommencer. 🙌",
          loginRequired:
            "Connectez-vous pour demander cette formation et garder le rythme joyeux. 👋",
          button: "Envoyer ma demande 🚀",
          pendingButton: "Envoi en cours ✨",
          doneButton: "Demande envoyee 🎉",
          chips: ["Reponse claire 📬", "Parcours simple 😄", "Suivi humain 🤝"],
        }
      : {
          eyebrow: "Spot request",
          idle: "One click sends your request to the ADVANCIA team with zero fuss. 🚀",
          pending: "Your request is on the way... ✨",
          submitted: "Request sent 🎉",
          submittedBody: "Nice, your future spot is now in review.",
          duplicateBody: "Your request is already in the queue, so there is nothing else to do. 🙌",
          loginRequired: "Log in to request this training and keep the cheerful flow going. 👋",
          button: "Send my request 🚀",
          pendingButton: "Sending now ✨",
          doneButton: "Request sent 🎉",
          chips: ["Clear follow-up 📬", "Simple flow 😄", "Human support 🤝"],
        };
  const [status, setStatus] = useState<
    "idle" | "pending" | "submitted" | "duplicate" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="surface-panel space-y-4 p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          {copy.eyebrow}
        </div>
        <div className="rounded-[24px] border border-dashed border-line bg-white/78 p-5 text-sm text-ink-soft">
          {copy.loginRequired}
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.chips.map((item) => (
            <div
              key={item}
              className="rounded-full border border-white/70 bg-white/78 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {item}
            </div>
          ))}
        </div>
        <div>
          <Link href="/login">
            <Button variant="secondary">{messages.header.login}</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleClick() {
    setStatus("pending");
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trainingSlug }),
        });
        const payload = (await response.json()) as ReservationResponse;
        if (!response.ok || !payload.ok) {
          setStatus("error");
          setErrorMessage(payload.message ?? "Something went wrong.");
          return;
        }
        setStatus(payload.duplicate ? "duplicate" : "submitted");
      } catch (error) {
        setStatus("error");
        setErrorMessage((error as Error).message);
      }
    });
  }

  const isDone = status === "submitted" || status === "duplicate";
  const statusText =
    status === "pending"
      ? copy.pending
      : status === "submitted"
        ? copy.submittedBody
        : status === "duplicate"
          ? copy.duplicateBody
          : copy.idle;

  return (
    <div className="surface-panel ambient-border relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,183,126,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(223,54,72,0.16),transparent_32%)]" />

      <div className="relative space-y-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
            {copy.eyebrow}
          </div>
          <p className="mt-2 text-sm text-ink-soft">{statusText}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {copy.chips.map((item, index) => (
            <div
              key={item}
              className={`rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-foreground ${
                index === 1 ? "emoji-bounce" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <Button
          onClick={handleClick}
          disabled={status === "pending" || isDone}
          className="w-full"
          variant={isDone ? "secondary" : "primary"}
        >
          {status === "pending" ? (
            copy.pendingButton
          ) : isDone ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              {copy.doneButton}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {copy.button}
            </>
          )}
        </Button>

        {status === "error" && errorMessage ? (
          <div className="rounded-[20px] bg-brand-50 p-3 text-sm text-brand-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
