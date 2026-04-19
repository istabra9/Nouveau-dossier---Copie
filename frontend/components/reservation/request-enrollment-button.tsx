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
  const { messages } = useLocale();
  const copy = messages.enrollment;
  const [status, setStatus] = useState<
    "idle" | "pending" | "submitted" | "duplicate" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="rounded-[24px] border border-dashed border-line bg-white/75 p-5 text-sm text-ink-soft">
        {copy.loginRequired}
        <div className="mt-3">
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

  return (
    <div className="surface-panel space-y-4 p-5">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          {copy.requestButton}
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {status === "duplicate" ? copy.alreadyRequested : copy.requestSubmittedDescription}
        </p>
      </div>

      <Button
        onClick={handleClick}
        disabled={status === "pending" || isDone}
        className="w-full"
        variant={isDone ? "secondary" : "primary"}
      >
        {status === "pending" ? (
          copy.requestPending
        ) : isDone ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            {copy.requestSubmitted}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {copy.requestButton}
          </>
        )}
      </Button>

      {status === "error" && errorMessage ? (
        <div className="rounded-[20px] bg-brand-50 p-3 text-sm text-brand-700">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
