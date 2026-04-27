"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Modal } from "@/frontend/components/ui/modal";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            tone === "danger"
              ? "bg-brand-50 text-brand-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={tone === "danger" ? "bg-brand-600 hover:bg-brand-700" : ""}
        >
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
