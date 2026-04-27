"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import { formatDateLabel } from "@/frontend/utils/format";
import type { Role, UserRecord, UserSex } from "@/frontend/types";

type CreateUserState = {
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  department: string;
  password: string;
  role: "user" | "admin";
};

type EditUserState = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company: string;
  department: string;
  role: "user" | "admin";
  status: "active" | "pending";
};

const roleStyles: Record<Role, string> = {
  super_admin: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  admin: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
  user: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

const statusStyles: Record<"active" | "pending", string> = {
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const avatarPalette = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

type SexFilter = "all" | UserSex | "unspecified";
type TrainingFilter = "all" | "in_training" | "scheduled" | "completed" | "none";

function paletteFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum = (sum + id.charCodeAt(i)) % 97;
  return avatarPalette[sum % avatarPalette.length];
}

function formatRole(role: Role) {
  if (role === "super_admin") return "Super admin";
  if (role === "admin") return "Admin";
  return "User";
}

function sexIcon(sex?: UserRecord["sex"]) {
  if (sex === "female") return "♀";
  if (sex === "male") return "♂";
  if (sex === "other") return "⚧";
  return "—";
}

function sexLabel(sex?: UserRecord["sex"]) {
  if (sex === "female") return "Female";
  if (sex === "male") return "Male";
  if (sex === "other") return "Other";
  if (sex === "prefer_not_to_say") return "Prefer not to say";
  return "—";
}

function isInTraining(user: UserRecord) {
  if (!user.currentTrainingName && !user.trainingStartDate && !user.trainingEndDate) return false;
  const start = user.trainingStartDate ? new Date(user.trainingStartDate).getTime() : null;
  const end = user.trainingEndDate ? new Date(user.trainingEndDate).getTime() : null;
  const now = Date.now();
  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

function getTrainingState(user: UserRecord): Exclude<TrainingFilter, "all"> {
  if (!user.currentTrainingName && !user.trainingStartDate && !user.trainingEndDate) {
    return "none";
  }

  const start = user.trainingStartDate ? new Date(user.trainingStartDate).getTime() : Number.NaN;
  const end = user.trainingEndDate ? new Date(user.trainingEndDate).getTime() : Number.NaN;
  const now = Date.now();

  if (Number.isFinite(end) && end < now) return "completed";
  if (Number.isFinite(start) && start > now) return "scheduled";
  return "in_training";
}

function formatTrainingDuration(user: UserRecord) {
  if (!user.currentTrainingDurationDays && !user.currentTrainingDurationHours) {
    return "Not scheduled";
  }

  const parts: string[] = [];

  if (user.currentTrainingDurationDays) {
    parts.push(
      `${user.currentTrainingDurationDays} day${user.currentTrainingDurationDays > 1 ? "s" : ""}`,
    );
  }

  if (user.currentTrainingDurationHours) {
    parts.push(`${user.currentTrainingDurationHours}h`);
  }

  return parts.join(" / ");
}

export function UserManagementPanel({
  initialUsers,
  canManageRoles = false,
  title = "Users management",
}: {
  initialUsers: UserRecord[];
  canManageRoles?: boolean;
  title?: string;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [sexFilter, setSexFilter] = useState<SexFilter>("all");
  const [trainingFilter, setTrainingFilter] = useState<TrainingFilter>("all");
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<EditUserState | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [createState, setCreateState] = useState<CreateUserState>({
    name: "",
    email: "",
    phoneNumber: "",
    company: "",
    department: "",
    password: "",
    role: "user",
  });

  const filteredUsers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (sexFilter !== "all") {
        if (sexFilter === "unspecified" && user.sex) return false;
        if (sexFilter !== "unspecified" && user.sex !== sexFilter) return false;
      }
      if (trainingFilter !== "all" && getTrainingState(user) !== trainingFilter) return false;
      if (!normalized) return true;
      return `${user.name} ${user.email} ${user.phoneNumber ?? ""} ${user.company} ${user.department} ${user.currentTrainingName ?? ""} ${user.currentTrainerName ?? ""}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [roleFilter, search, sexFilter, statusFilter, trainingFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const from = filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  async function refreshView() {
    router.refresh();
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createState),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      user?: UserRecord;
    };

    if (!response.ok || !payload.user) {
      setMessage({ tone: "error", text: payload.message ?? "Unable to create user." });
      return;
    }

    setUsers((current) => [payload.user!, ...current]);
    setCreateState({
      name: "",
      email: "",
      phoneNumber: "",
      company: "",
      department: "",
      password: "",
      role: "user",
    });
    setShowCreate(false);
    setMessage({ tone: "success", text: "User created." });
    await refreshView();
  }

  async function handleSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setMessage(null);

    const updates: Partial<EditUserState> = {
      firstName: editing.firstName,
      lastName: editing.lastName,
      phoneNumber: editing.phoneNumber,
      company: editing.company,
      department: editing.department,
      status: editing.status,
    };
    if (canManageRoles) updates.role = editing.role;

    const response = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      user?: UserRecord;
    };

    if (!response.ok || !payload.user) {
      setMessage({ tone: "error", text: payload.message ?? "Unable to update user." });
      return;
    }

    setUsers((current) =>
      current.map((user) => (user.id === editing.id ? payload.user! : user)),
    );
    setEditing(null);
    setMessage({ tone: "success", text: "User updated." });
    await refreshView();
  }

  async function handleInlineStatus(userId: string, status: "active" | "pending") {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { ok?: boolean; user?: UserRecord; message?: string };
    if (!response.ok || !payload.user) {
      setMessage({ tone: "error", text: payload.message ?? "Unable to update user." });
      return;
    }
    setUsers((current) => current.map((u) => (u.id === userId ? payload.user! : u)));
    await refreshView();
  }

  async function handleDeleteUser(userId: string) {
    setMessage(null);
    const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    const payload = (await response.json()) as { ok?: boolean; message?: string };

    if (!response.ok) {
      setMessage({ tone: "error", text: payload.message ?? "Unable to delete user." });
      setConfirmDeleteId(null);
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== userId));
    setConfirmDeleteId(null);
    setMessage({ tone: "success", text: "User deleted." });
    await refreshView();
  }

  function openEdit(user: UserRecord) {
    setEditing({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? "",
      company: user.company,
      department: user.department,
      role: user.role === "super_admin" ? "admin" : (user.role as "user" | "admin"),
      status: user.status,
    });
  }

  return (
    <div className="surface-panel space-y-4 p-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-sm text-ink-soft">
            Manage accounts and keep the assigned training schedule visible in one place.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            setMessage(null);
          }}
        >
          {showCreate ? (
            <>
              <X className="h-4 w-4" />
              Close
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add user
            </>
          )}
        </Button>
      </header>

      {showCreate ? (
        <form
          onSubmit={handleCreateUser}
          className="grid gap-3 rounded-[20px] border border-line bg-white/70 p-4 lg:grid-cols-6"
        >
          <Input
            value={createState.name}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Full name"
            required
            className="lg:col-span-2"
          />
          <Input
            type="email"
            value={createState.email}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email"
            required
            className="lg:col-span-2"
          />
          <Input
            type="tel"
            value={createState.phoneNumber}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, phoneNumber: event.target.value }))
            }
            placeholder="Phone number"
            required
          />
          <Input
            value={createState.company}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, company: event.target.value }))
            }
            placeholder="Company"
            required
          />
          <Input
            value={createState.department}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, department: event.target.value }))
            }
            placeholder="Department"
            required
          />
          <Input
            type="password"
            value={createState.password}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Password"
            required
            className="lg:col-span-2"
          />
          <Select
            value={createState.role}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                role: event.target.value as "user" | "admin",
              }))
            }
            disabled={!canManageRoles}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          <div className="lg:col-span-3">
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          Show
          <Select
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-10 w-20"
          >
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="15">15</option>
            <option value="25">25</option>
          </Select>
          entries
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="h-10 min-w-[140px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </Select>
          <Select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as typeof roleFilter);
              setPage(1);
            }}
            className="h-10 min-w-[140px]"
          >
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {canManageRoles ? <option value="super_admin">Super admin</option> : null}
          </Select>
          <Select
            value={sexFilter}
            onChange={(event) => {
              setSexFilter(event.target.value as SexFilter);
              setPage(1);
            }}
            className="h-10 min-w-[150px]"
          >
            <option value="all">All genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="unspecified">Unspecified</option>
          </Select>
          <Select
            value={trainingFilter}
            onChange={(event) => {
              setTrainingFilter(event.target.value as TrainingFilter);
              setPage(1);
            }}
            className="h-10 min-w-[160px]"
          >
            <option value="all">All training states</option>
            <option value="in_training">In training</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="none">No training</option>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, phone, company, or training"
              className="h-10 w-72 pl-9"
            />
          </div>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-[20px] px-4 py-3 text-sm ${
            message.tone === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[24px] border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Learner</th>
                <th className="px-4 py-3 font-medium">Profile</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Training</th>
                <th className="px-4 py-3 font-medium">Started</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-ink-soft">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const inTraining = isInTraining(user);
                  return (
                    <tr
                      key={user.id}
                      className="border-t border-line align-middle transition hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${paletteFor(
                              user.id,
                            )}`}
                          >
                            {user.avatar || user.firstName?.[0] || "?"}
                          </div>
                          <div className="leading-tight">
                            <div className="font-semibold text-foreground">{user.name}</div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${roleStyles[user.role]}`}
                              >
                                {formatRole(user.role)}
                              </span>
                              <span className="text-[11px] text-ink-soft">{user.uniqueId}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="leading-tight">
                          <div className="text-foreground">
                            {user.age ? `${user.age} yrs` : "—"}
                          </div>
                          <div className="text-[11px] text-ink-soft">
                            <span className="mr-1">{sexIcon(user.sex)}</span>
                            {sexLabel(user.sex)}
                          </div>
                        </div>
                      </td>
                    <td className="px-4 py-3">
                      <div className="leading-tight">
                        <div className="text-foreground">{user.email}</div>
                        <div className="text-[11px] text-ink-soft">
                          {user.phoneNumber ?? "No phone number"}
                        </div>
                        <div className="text-[11px] text-ink-soft">
                          {user.company} / {user.department}
                        </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="leading-tight">
                          <div className="font-medium text-foreground">
                            {user.currentTrainingName ?? "No training"}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                                inTraining
                                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                  : "bg-slate-100 text-slate-600 ring-slate-200"
                              }`}
                            >
                              <span aria-hidden>{inTraining ? "🟢" : "⚪"}</span>
                              {inTraining ? "En cours" : "Not in training"}
                            </span>
                            {user.currentTrainerName ? (
                              <span className="text-[11px] text-ink-soft">
                                {user.currentTrainerName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="leading-tight">
                          <div className="text-foreground">
                            {user.trainingStartDate
                              ? formatDateLabel(user.trainingStartDate, locale)
                              : "—"}
                          </div>
                          <div className="text-[11px] text-ink-soft">
                            {user.trainingEndDate
                              ? `→ ${formatDateLabel(user.trainingEndDate, locale)}`
                              : formatTrainingDuration(user)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleInlineStatus(
                              user.id,
                              user.status === "active" ? "pending" : "active",
                            )
                          }
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize transition hover:opacity-80 ${statusStyles[user.status]}`}
                          title="Toggle status"
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            disabled={user.role === "super_admin" && !canManageRoles}
                            className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(user.id)}
                            disabled={user.role === "super_admin"}
                            className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
          <div className="text-sm text-ink-soft">
            Showing {from} to {to} of {filteredUsers.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1),
              )
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center gap-1">
                  {idx > 0 && p - arr[idx - 1] > 1 ? (
                    <span className="px-1 text-ink-soft">…</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-[36px] rounded-full px-2 text-sm font-semibold transition ${
                      p === currentPage
                        ? "bg-foreground text-white"
                        : "border border-line text-ink-soft hover:border-brand-300 hover:text-brand-600"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl space-y-4 rounded-[24px] bg-white p-6 shadow-[0_30px_80px_rgba(15,15,20,0.28)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold">Edit user</h4>
                <p className="text-sm text-ink-soft">Update this account&rsquo;s details.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full p-2 text-ink-soft transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                First name
                <Input
                  value={editing.firstName}
                  onChange={(event) =>
                    setEditing((current) =>
                      current ? { ...current, firstName: event.target.value } : current,
                    )
                  }
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                Last name
                <Input
                  value={editing.lastName}
                  onChange={(event) =>
                    setEditing((current) =>
                      current ? { ...current, lastName: event.target.value } : current,
                    )
                  }
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                Phone number
                <Input
                  type="tel"
                  value={editing.phoneNumber}
                  onChange={(event) =>
                    setEditing((current) =>
                      current ? { ...current, phoneNumber: event.target.value } : current,
                    )
                  }
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                Company
                <Input
                  value={editing.company}
                  onChange={(event) =>
                    setEditing((current) =>
                      current ? { ...current, company: event.target.value } : current,
                    )
                  }
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                Department
                <Input
                  value={editing.department}
                  onChange={(event) =>
                    setEditing((current) =>
                      current ? { ...current, department: event.target.value } : current,
                    )
                  }
                  required
                />
              </label>
              {canManageRoles ? (
                <label className="space-y-1 text-xs font-medium text-ink-soft">
                  Role
                  <Select
                    value={editing.role}
                    onChange={(event) =>
                      setEditing((current) =>
                        current
                          ? { ...current, role: event.target.value as "user" | "admin" }
                          : current,
                      )
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </label>
              ) : null}
              <label className="space-y-1 text-xs font-medium text-ink-soft">
                Status
                <Select
                  value={editing.status}
                  onChange={(event) =>
                    setEditing((current) =>
                      current
                        ? {
                            ...current,
                            status: event.target.value as "active" | "pending",
                          }
                        : current,
                    )
                  }
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </Select>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </div>
      ) : null}

      {confirmDeleteId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-[24px] bg-white p-6 shadow-[0_30px_80px_rgba(15,15,20,0.28)]"
          >
            <h4 className="text-xl font-semibold">Delete user?</h4>
            <p className="text-sm text-ink-soft">
              This removes the account and revokes access. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleDeleteUser(confirmDeleteId)}
                className="bg-brand-600 hover:bg-brand-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
