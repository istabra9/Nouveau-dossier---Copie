"use client";

import { Fragment, startTransition, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MailWarning,
  Search,
  XCircle,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
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

type StatusFilter = "all" | "pending" | "accepted" | "rejected";
type ScheduleFilter = "all" | "upcoming" | "ongoing" | "ended" | "unscheduled";

const statusStyles: Record<EnrollmentRequestRecord["status"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  accepted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  rejected: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
};

const avatarPalette = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function paletteFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum = (sum + id.charCodeAt(i)) % 97;
  return avatarPalette[sum % avatarPalette.length];
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getScheduleState(record: EnrichedRequest): Exclude<ScheduleFilter, "all"> {
  if (!record.trainingStartDate && !record.trainingEndDate) {
    return "unscheduled";
  }

  const start = record.trainingStartDate
    ? new Date(record.trainingStartDate).getTime()
    : Number.NaN;
  const end = record.trainingEndDate
    ? new Date(record.trainingEndDate).getTime()
    : Number.NaN;
  const now = Date.now();

  if (Number.isFinite(end) && end < now) return "ended";
  if (Number.isFinite(start) && start > now) return "upcoming";
  return "ongoing";
}

export function EnrollmentRequestsPanel() {
  const { messages } = useLocale();
  const copy = messages.enrollment;
  const [records, setRecords] = useState<EnrichedRequest[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>("all");
  const [search, setSearch] = useState("");

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
        const response = await fetch(`/api/admin/reservations/${id}/${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reason ? { reason } : {}),
        });
        const payload = (await response.json()) as DecisionResponse;
        if (!response.ok || !payload.ok) {
          setToast({ tone: "error", text: payload.message ?? "Action failed." });
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

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return records.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) return false;
      if (scheduleFilter !== "all" && getScheduleState(record) !== scheduleFilter) {
        return false;
      }
      if (!normalized) return true;
      return `${record.userName} ${record.userEmail} ${record.trainingTitle}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [records, scheduleFilter, search, statusFilter]);

  const pendingCount = records.filter((r) => r.status === "pending").length;

  return (
    <section className="surface-panel space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
            {copy.queueTitle}
          </div>
          <h3 className="text-2xl font-semibold">{copy.queueDescription}</h3>
          <p className="text-sm text-ink-soft">
            {pendingCount} pending · {records.length} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="h-10 min-w-[140px]"
          >
            <option value="all">All requests</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select
            value={scheduleFilter}
            onChange={(event) => setScheduleFilter(event.target.value as ScheduleFilter)}
            className="h-10 min-w-[150px]"
          >
            <option value="all">All schedules</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
            <option value="unscheduled">Unscheduled</option>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search user, email, or training"
              className="h-10 w-64 pl-9"
            />
          </div>
        </div>
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

      <div className="overflow-hidden rounded-[24px] border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-ink-soft">
              <tr>
                <th className="px-5 py-4 font-medium">Learner</th>
                <th className="px-5 py-4 font-medium">Training</th>
                <th className="px-5 py-4 font-medium">Schedule</th>
                <th className="px-5 py-4 font-medium">Requested</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-ink-soft">
                    {messages.common.loading}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-ink-soft">
                    {copy.queueEmpty}
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <Fragment key={record.id}>
                    <tr className="border-t border-line align-middle transition hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${paletteFor(
                              record.userId,
                            )}`}
                          >
                            {initialsOf(record.userName)}
                          </div>
                          <div className="leading-tight">
                            <div className="font-semibold text-foreground">{record.userName}</div>
                            <div className="text-xs text-ink-soft">{record.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[280px] font-medium text-foreground">
                          {record.trainingTitle}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        <div className="leading-tight">
                          <div>{formatDate(record.trainingStartDate)}</div>
                          <div className="text-xs">→ {formatDate(record.trainingEndDate)}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(record.requestedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[record.status]}`}
                        >
                          {record.status === "pending"
                            ? copy.statusPending
                            : record.status === "accepted"
                              ? copy.statusAccepted
                              : copy.statusRejected}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === "pending" ? (
                            <>
                              <Button
                                variant="primary"
                                disabled={busyId === record.id}
                                onClick={() => runDecision(record.id, "accept")}
                                className="px-4 py-2 text-xs"
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
                                className="px-4 py-2 text-xs"
                              >
                                <XCircle className="h-4 w-4" />
                                {copy.reject}
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-ink-soft">
                              {record.decidedAt
                                ? new Date(record.decidedAt).toLocaleDateString()
                                : "—"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {rejectingId === record.id ? (
                      <tr className="border-t border-line bg-brand-50/30">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="space-y-2">
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
                                className="px-4 py-2 text-xs"
                              >
                                {messages.common.cancel}
                              </Button>
                              <Button
                                variant="primary"
                                disabled={busyId === record.id}
                                onClick={() =>
                                  runDecision(record.id, "reject", rejectReason || undefined)
                                }
                                className="px-4 py-2 text-xs"
                              >
                                {copy.reject}
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
