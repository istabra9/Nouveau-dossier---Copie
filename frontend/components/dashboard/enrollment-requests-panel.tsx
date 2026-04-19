"use client";

import { startTransition, useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, Mail, MailWarning } from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import type { EnrollmentRequestRecord } from "@/frontend/types";

type EnrichedRequest = EnrollmentRequestRecord & {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  trainingTitle: string;
  trainingStartDate?: string;
  trainingEndDate?: string;
};

type DecisionResponse = {
  ok: boolean;
  email?: "sent" | "failed";
  emailError?: string;
  message?: string;
};

export function EnrollmentRequestsPanel() {
  const { messages } = useLocale();
  const copy = messages.enrollment;
  const [records, setRecords] = useState<EnrichedRequest[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/reservations");
      const payload = await response.json();
      setRecords(payload.records ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function runDecision(id: string, path: "accept" | "reject", reason?: string) {
    setBusyId(id);
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/admin/reservations/${id}/${path}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reason ? { reason } : {}),
          },
        );
        const payload = (await response.json()) as DecisionResponse;
        if (!response.ok || !payload.ok) {
          setToast({
            tone: "error",
            text: payload.message ?? "Action failed.",
          });
          return;
        }
        setToast({
          tone: payload.email === "failed" ? "error" : "success",
          text:
            payload.email === "failed"
              ? `Decision saved but email failed: ${payload.emailError ?? ""}`
              : `Decision saved and email sent.`,
        });
        setRejectingId(null);
        setRejectReason("");
        await refresh();
      } finally {
        setBusyId(null);
      }
    });
  }

  const pending = records.filter((record) => record.status === "pending");
  const decided = records.filter((record) => record.status !== "pending");

  return (
    <section className="surface-panel space-y-5 p-6">
      <header className="flex flex-col gap-1">
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          {copy.queueTitle}
        </div>
        <h3 className="text-2xl font-semibold">{copy.queueDescription}</h3>
      </header>

      {toast ? (
        <div
          className={`flex items-center gap-2 rounded-[20px] p-3 text-sm ${
            toast.tone === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {toast.tone === "success" ? (
            <Mail className="h-4 w-4" />
          ) : (
            <MailWarning className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[24px] border border-dashed border-line bg-white/75 p-4 text-sm text-ink-soft">
          {messages.common.loading}
        </div>
      ) : pending.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-line bg-white/75 p-4 text-sm text-ink-soft">
          {copy.queueEmpty}
        </div>
      ) : (
        <ul className="space-y-3">
          {pending.map((record) => (
            <li
              key={record.id}
              className="rounded-[24px] border border-line bg-white/85 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(record.requestedAt).toLocaleString()}
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {record.userName}{" "}
                    <span className="text-sm font-normal text-ink-soft">
                      ({record.userEmail})
                    </span>
                  </div>
                  <div className="text-sm text-ink-soft">
                    {copy.training}: {record.trainingTitle}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    disabled={busyId === record.id}
                    onClick={() => runDecision(record.id, "accept")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {copy.accept}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={busyId === record.id}
                    onClick={() =>
                      setRejectingId((current) =>
                        current === record.id ? null : record.id,
                      )
                    }
                  >
                    <XCircle className="h-4 w-4" />
                    {copy.reject}
                  </Button>
                </div>
              </div>

              {rejectingId === record.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    placeholder={copy.rejectReasonPlaceholder}
                    rows={2}
                    className="w-full rounded-[16px] border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                    >
                      {messages.common.cancel}
                    </Button>
                    <Button
                      variant="primary"
                      disabled={busyId === record.id}
                      onClick={() =>
                        runDecision(record.id, "reject", rejectReason || undefined)
                      }
                    >
                      {copy.reject}
                    </Button>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {decided.length ? (
        <details className="rounded-[20px] border border-line bg-white/70 p-3 text-sm">
          <summary className="cursor-pointer font-semibold text-ink-soft">
            {decided.length} decided
          </summary>
          <ul className="mt-3 space-y-2">
            {decided.slice(0, 8).map((record) => (
              <li
                key={record.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-line bg-white/80 px-3 py-2"
              >
                <span>
                  <strong>{record.userName}</strong> · {record.trainingTitle}
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    record.status === "accepted"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-brand-50 text-brand-700"
                  }`}
                >
                  {record.status === "accepted"
                    ? copy.statusAccepted
                    : copy.statusRejected}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
