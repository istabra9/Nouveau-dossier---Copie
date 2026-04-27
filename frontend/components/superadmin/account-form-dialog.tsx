"use client";

import { useEffect, useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Modal } from "@/frontend/components/ui/modal";
import { Select } from "@/frontend/components/ui/select";
import type { AccountRecord, AccountTarget } from "@/frontend/types/superadmin";

type FormState = {
  name: string;
  age: string;
  sex: "male" | "female" | "other";
  state: string;
  emailAddress: string;
  phoneNumber: string;
  isActive: boolean;
  trainingStartDate: string;
  trainingEndDate: string;
  password: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    age: "",
    sex: "male",
    state: "",
    emailAddress: "",
    phoneNumber: "",
    isActive: true,
    trainingStartDate: "",
    trainingEndDate: "",
    password: "",
  };
}

function formFromRecord(record: AccountRecord): FormState {
  return {
    name: record.name,
    age: record.age ? String(record.age) : "",
    sex: (record.sex === "female" || record.sex === "other" ? record.sex : "male") as FormState["sex"],
    state: record.state ?? "",
    emailAddress: record.emailAddress,
    phoneNumber: record.phoneNumber ?? "",
    isActive: record.isActive,
    trainingStartDate: record.trainingStartDate?.slice(0, 10) ?? "",
    trainingEndDate: record.trainingEndDate?.slice(0, 10) ?? "",
    password: "",
  };
}

export function AccountFormDialog({
  open,
  onClose,
  target,
  record,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  target: AccountTarget;
  record?: AccountRecord | null;
  onSubmit: (payload: Record<string, unknown>) => Promise<{ ok: boolean; message?: string }>;
}) {
  const mode = record ? "edit" : "create";
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(record ? formFromRecord(record) : emptyForm());
  }, [open, record]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name is required.");
    const ageNumber = Number(form.age);
    if (!ageNumber || Number.isNaN(ageNumber) || ageNumber < 16 || ageNumber > 100) {
      return setError("Age must be between 16 and 100.");
    }
    if (!form.state.trim()) return setError("State is required.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailAddress)) {
      return setError("Use a valid email address.");
    }
    if (!/^[+()0-9\s-]{6,24}$/.test(form.phoneNumber)) {
      return setError("Use a valid phone number.");
    }
    if (!form.trainingStartDate || !form.trainingEndDate) {
      return setError("Both training dates are required.");
    }
    if (
      new Date(form.trainingEndDate).getTime() <
      new Date(form.trainingStartDate).getTime()
    ) {
      return setError("Training end date must be after the start date.");
    }
    if (mode === "create" && form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      age: ageNumber,
      sex: form.sex,
      state: form.state.trim(),
      emailAddress: form.emailAddress.trim(),
      phoneNumber: form.phoneNumber.trim(),
      isActive: form.isActive,
      trainingStartDate: form.trainingStartDate,
      trainingEndDate: form.trainingEndDate,
    };
    if (mode === "create") payload.password = form.password;

    setBusy(true);
    try {
      const result = await onSubmit(payload);
      if (!result.ok) {
        setError(result.message ?? "Unable to save.");
        return;
      }
      onClose();
    } finally {
      setBusy(false);
    }
  }

  const label = target === "admin" ? "admin" : "user";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? `Create ${label}` : `Edit ${label}`}
      description={
        mode === "create"
          ? `Fill in the details to create a new ${label} account.`
          : `Update the ${label} account details.`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-[16px] bg-brand-50 px-3 py-2 text-sm text-brand-700">
            {error}
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Full name
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Sarah Ben Ali"
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Age
            <Input
              type="number"
              min={16}
              max={100}
              value={form.age}
              onChange={(event) => setForm({ ...form, age: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Sex
            <Select
              value={form.sex}
              onChange={(event) =>
                setForm({ ...form, sex: event.target.value as FormState["sex"] })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            State / Region
            <Input
              value={form.state}
              onChange={(event) => setForm({ ...form, state: event.target.value })}
              placeholder="e.g. Tunis"
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Email address
            <Input
              type="email"
              value={form.emailAddress}
              onChange={(event) =>
                setForm({ ...form, emailAddress: event.target.value })
              }
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Phone number
            <Input
              value={form.phoneNumber}
              onChange={(event) =>
                setForm({ ...form, phoneNumber: event.target.value })
              }
              placeholder="+216 12 345 678"
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Training start date
            <Input
              type="date"
              value={form.trainingStartDate}
              onChange={(event) =>
                setForm({ ...form, trainingStartDate: event.target.value })
              }
              required
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-ink-soft">
            Training end date
            <Input
              type="date"
              value={form.trainingEndDate}
              onChange={(event) =>
                setForm({ ...form, trainingEndDate: event.target.value })
              }
              required
            />
          </label>
          <label className="col-span-2 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="h-4 w-4 rounded border-line"
            />
            Active account
          </label>
          {mode === "create" ? (
            <label className="col-span-2 space-y-1 text-xs font-medium text-ink-soft">
              Temporary password
              <Input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                placeholder="At least 8 characters"
                required
              />
            </label>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create account" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
