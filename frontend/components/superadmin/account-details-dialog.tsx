"use client";

import { Modal } from "@/frontend/components/ui/modal";
import type { AccountRecord } from "@/frontend/types/superadmin";

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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2 last:border-none">
      <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</div>
      <div className="text-sm font-medium text-foreground">{value ?? "—"}</div>
    </div>
  );
}

export function AccountDetailsDialog({
  open,
  record,
  onClose,
}: {
  open: boolean;
  record: AccountRecord | null;
  onClose: () => void;
}) {
  if (!record) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record.name}
      description={`${record.role === "admin" ? "Admin" : "User"} · ${record.userId}`}
    >
      <div className="divide-y divide-line">
        <Row label="Age" value={record.age ?? "—"} />
        <Row label="Sex" value={<span className="capitalize">{record.sex ?? "—"}</span>} />
        <Row label="State" value={record.state ?? "—"} />
        <Row label="Email" value={record.emailAddress} />
        <Row label="Phone" value={record.phoneNumber ?? "—"} />
        <Row
          label="Status"
          value={
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                record.isActive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-slate-100 text-slate-600 ring-slate-200"
              }`}
            >
              {record.isActive ? "Active" : "Inactive"}
            </span>
          }
        />
        <Row label="Training start" value={formatDate(record.trainingStartDate)} />
        <Row label="Training end" value={formatDate(record.trainingEndDate)} />
        <Row label="Company" value={record.company} />
        <Row label="Department" value={record.department} />
      </div>
    </Modal>
  );
}
