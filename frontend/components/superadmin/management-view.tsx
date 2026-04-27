"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Plus,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { AccountDetailsDialog } from "./account-details-dialog";
import { AccountFormDialog } from "./account-form-dialog";
import { AccountsTable } from "./accounts-table";
import { ConfirmDialog } from "./confirm-dialog";
import type {
  AccountRecord,
  AccountTarget,
  ManagementStats,
} from "@/frontend/types/superadmin";

type Tab = "users" | "admins";

type Toast = { tone: "success" | "error"; text: string } | null;

export type ManagementConfig = {
  mode: "full" | "users-only";
  usersUrl: string;
  adminsUrl?: string;
  statsUrl: string;
  exportUrl: (target: AccountTarget) => string;
};

export const superAdminConfig: ManagementConfig = {
  mode: "full",
  usersUrl: "/api/superadmin/users",
  adminsUrl: "/api/superadmin/admins",
  statsUrl: "/api/superadmin/stats",
  exportUrl: (target) =>
    `/api/superadmin/export?target=${target === "admin" ? "admins" : "users"}`,
};

export const adminConfig: ManagementConfig = {
  mode: "users-only",
  usersUrl: "/api/users",
  statsUrl: "/api/users/stats",
  exportUrl: () => "/api/users/export",
};

export function ManagementView({
  config = superAdminConfig,
}: {
  config?: ManagementConfig;
} = {}) {
  const [tab, setTab] = useState<Tab>("users");
  const target: AccountTarget = tab === "admins" ? "admin" : "user";
  const isUsersOnly = config.mode === "users-only";

  const endpoint = useCallback(
    (target: AccountTarget, id?: string) => {
      const base = target === "admin" ? config.adminsUrl ?? "" : config.usersUrl;
      return id ? `${base}/${id}` : base;
    },
    [config],
  );

  const [users, setUsers] = useState<AccountRecord[]>([]);
  const [admins, setAdmins] = useState<AccountRecord[]>([]);
  const [stats, setStats] = useState<ManagementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const [editing, setEditing] = useState<AccountRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<AccountRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccountRecord | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState<null | "activate" | "deactivate">(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const records = tab === "admins" ? admins : users;

  const showToast = useCallback((tone: "success" | "error", text: string) => {
    setToast({ tone, text });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetches = [fetch(config.usersUrl), fetch(config.statsUrl)];
      if (config.adminsUrl) fetches.push(fetch(config.adminsUrl));

      const responses = await Promise.all(fetches);
      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to load management data.");
      }

      const payloads = await Promise.all(responses.map((r) => r.json()));
      const [usersPayload, statsPayload, adminsPayload] = payloads;

      setUsers(usersPayload.records ?? []);
      setStats(statsPayload.stats ?? null);
      setAdmins(adminsPayload?.records ?? []);
      setSelected(new Set());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const summary = useMemo(() => {
    if (!stats) return null;
    const base = [
      {
        label: "Total users",
        value: stats.totals.users,
        icon: Users,
        tone: "bg-sky-50 text-sky-700 ring-sky-100",
        emoji: "👥",
      },
    ];
    if (!isUsersOnly) {
      base.push({
        label: "Total admins",
        value: stats.totals.admins,
        icon: ShieldCheck,
        tone: "bg-violet-50 text-violet-700 ring-violet-100",
        emoji: "🛡️",
      });
    }
    base.push(
      {
        label: "Active accounts",
        value: stats.active.total,
        icon: CheckCircle2,
        tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        emoji: "✅",
      },
      {
        label: "Inactive accounts",
        value: stats.inactive.total,
        icon: XCircle,
        tone: "bg-amber-50 text-amber-700 ring-amber-100",
        emoji: "⏸️",
      },
    );
    return base;
  }, [stats, isUsersOnly]);

  function updateLocal(target: AccountTarget, record: AccountRecord) {
    const setter = target === "admin" ? setAdmins : setUsers;
    setter((current) => {
      const existing = current.findIndex((r) => r.id === record.id);
      if (existing >= 0) {
        const next = [...current];
        next[existing] = record;
        return next;
      }
      return [record, ...current];
    });
  }

  function removeLocal(target: AccountTarget, id: string) {
    const setter = target === "admin" ? setAdmins : setUsers;
    setter((current) => current.filter((record) => record.id !== id));
  }

  async function submitForm(payload: Record<string, unknown>) {
    const isEdit = Boolean(editing);
    const url = endpoint(target, isEdit ? editing!.id : undefined);
    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        ok: boolean;
        record?: AccountRecord;
        message?: string;
      };
      if (!response.ok || !body.ok || !body.record) {
        showToast("error", body.message ?? "Unable to save account.");
        return { ok: false, message: body.message };
      }
      updateLocal(target, body.record);
      showToast("success", isEdit ? "Account updated." : "Account created.");
      await refresh();
      return { ok: true };
    } catch (err) {
      showToast("error", (err as Error).message);
      return { ok: false, message: (err as Error).message };
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const response = await fetch(endpoint(target, deleteTarget.id), {
        method: "DELETE",
      });
      const body = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !body.ok) {
        showToast("error", body.message ?? "Unable to delete account.");
        return;
      }
      removeLocal(target, deleteTarget.id);
      showToast("success", "Account deleted.");
      setDeleteTarget(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(record: AccountRecord) {
    const response = await fetch(endpoint(target, record.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !record.isActive }),
    });
    const body = (await response.json()) as {
      ok: boolean;
      record?: AccountRecord;
      message?: string;
    };
    if (!response.ok || !body.ok || !body.record) {
      showToast("error", body.message ?? "Unable to update status.");
      return;
    }
    updateLocal(target, body.record);
    showToast("success", `Marked ${body.record.isActive ? "active" : "inactive"}.`);
    await refresh();
  }

  async function confirmBulk() {
    if (!bulkConfirm) return;
    const ids = Array.from(selected);
    if (ids.length === 0) {
      setBulkConfirm(null);
      return;
    }
    setBusy(true);
    try {
      const responses = await Promise.all(
        ids.map((id) =>
          fetch(endpoint(target, id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: bulkConfirm === "activate" }),
          }).then((r) => r.json()),
        ),
      );
      const failures = responses.filter((r) => !r.ok).length;
      if (failures > 0) {
        showToast("error", `${failures} account(s) failed to update.`);
      } else {
        showToast(
          "success",
          `${ids.length} account(s) ${bulkConfirm === "activate" ? "activated" : "deactivated"}.`,
        );
      }
      setBulkConfirm(null);
      setSelected(new Set());
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function handleToggleSelect(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleToggleSelectAll(ids: string[], nextState: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (nextState) ids.forEach((id) => next.add(id));
      else ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div
          className={`rounded-[20px] px-4 py-3 text-sm ${
            toast.tone === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {toast.text}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(summary ?? []).map((card) => (
          <div
            key={card.label}
            className="surface-panel flex items-start justify-between gap-3 p-4"
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                {card.label}
              </div>
              <div className="mt-2 text-2xl font-semibold">{card.value}</div>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg ring-1 ${card.tone}`}
              aria-hidden
            >
              {card.emoji}
            </div>
          </div>
        ))}
        {!summary
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="surface-panel h-24 animate-pulse p-4"
              />
            ))
          : null}
      </div>

      <div className="surface-panel space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {isUsersOnly ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white">
              <Users className="h-4 w-4" />
              Users ({users.length})
            </div>
          ) : (
            <div className="inline-flex rounded-full border border-line bg-white p-1">
              <button
                type="button"
                onClick={() => setTab("users")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === "users"
                    ? "bg-foreground text-white"
                    : "text-ink-soft hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                Users ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("admins")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === "admins"
                    ? "bg-foreground text-white"
                    : "text-ink-soft hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admins ({admins.length})
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 ? (
              <>
                <span className="text-xs text-ink-soft">
                  {selected.size} selected
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setBulkConfirm("activate")}
                  className="px-4 py-2 text-xs"
                >
                  <UserPlus className="h-4 w-4" />
                  Activate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setBulkConfirm("deactivate")}
                  className="px-4 py-2 text-xs"
                >
                  <UserMinus className="h-4 w-4" />
                  Deactivate
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                window.location.href = config.exportUrl(target);
              }}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add {target === "admin" ? "admin" : "user"}
            </Button>
          </div>
        </div>

        <AccountsTable
          target={target}
          records={records}
          loading={loading}
          error={error}
          selected={selected}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onView={(record) => setDetailsRecord(record)}
          onEdit={(record) => {
            setEditing(record);
            setFormOpen(true);
          }}
          onDelete={(record) => setDeleteTarget(record)}
          onToggleActive={toggleActive}
        />
      </div>

      <AccountFormDialog
        open={formOpen}
        target={target}
        record={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={submitForm}
      />

      <AccountDetailsDialog
        open={Boolean(detailsRecord)}
        record={detailsRecord}
        onClose={() => setDetailsRecord(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${target === "admin" ? "admin" : "user"}?`}
        description={
          deleteTarget
            ? `${deleteTarget.name} will lose access immediately. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />

      <ConfirmDialog
        open={Boolean(bulkConfirm)}
        title={
          bulkConfirm === "activate"
            ? `Activate ${selected.size} account(s)?`
            : `Deactivate ${selected.size} account(s)?`
        }
        description={
          bulkConfirm === "activate"
            ? "Selected accounts will regain access immediately."
            : "Selected accounts will lose access until reactivated."
        }
        tone={bulkConfirm === "activate" ? "default" : "danger"}
        confirmLabel={bulkConfirm === "activate" ? "Activate" : "Deactivate"}
        onClose={() => setBulkConfirm(null)}
        onConfirm={confirmBulk}
        busy={busy}
      />
    </div>
  );
}
