"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Power,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import type { AccountRecord, AccountTarget } from "@/frontend/types/superadmin";
import type { UserSex } from "@/frontend/types";

type SortKey =
  | "userId"
  | "name"
  | "age"
  | "sex"
  | "state"
  | "emailAddress"
  | "phoneNumber"
  | "isActive"
  | "trainingStartDate"
  | "trainingEndDate";

const columns: {
  key: SortKey;
  label: string;
  align?: "right";
}[] = [
  { key: "userId", label: "ID" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "sex", label: "Sex" },
  { key: "state", label: "State" },
  { key: "emailAddress", label: "Email" },
  { key: "phoneNumber", label: "Phone" },
  { key: "isActive", label: "Active" },
  { key: "trainingStartDate", label: "Start" },
  { key: "trainingEndDate", label: "End" },
];

type SexFilter = "all" | UserSex | "unspecified";
type TrainingFilter = "all" | "in_training" | "scheduled" | "completed" | "none";

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

function compare(
  a: AccountRecord,
  b: AccountRecord,
  key: SortKey,
  direction: "asc" | "desc",
) {
  const valueA = a[key];
  const valueB = b[key];
  if (valueA === valueB) return 0;
  if (valueA === undefined || valueA === null) return 1;
  if (valueB === undefined || valueB === null) return -1;
  const result =
    typeof valueA === "number" && typeof valueB === "number"
      ? valueA - valueB
      : typeof valueA === "boolean" && typeof valueB === "boolean"
        ? Number(valueA) - Number(valueB)
        : String(valueA).localeCompare(String(valueB));
  return direction === "asc" ? result : -result;
}

function getTrainingState(record: AccountRecord): Exclude<TrainingFilter, "all"> {
  if (!record.trainingStartDate && !record.trainingEndDate) {
    return "none";
  }

  const start = record.trainingStartDate
    ? new Date(record.trainingStartDate).getTime()
    : Number.NaN;
  const end = record.trainingEndDate
    ? new Date(record.trainingEndDate).getTime()
    : Number.NaN;
  const now = Date.now();

  if (Number.isFinite(end) && end < now) return "completed";
  if (Number.isFinite(start) && start > now) return "scheduled";
  return "in_training";
}

export function AccountsTable({
  target,
  records,
  loading,
  error,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  target: AccountTarget;
  records: AccountRecord[];
  loading?: boolean;
  error?: string | null;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[], next: boolean) => void;
  onView: (record: AccountRecord) => void;
  onEdit: (record: AccountRecord) => void;
  onDelete: (record: AccountRecord) => void;
  onToggleActive: (record: AccountRecord) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sexFilter, setSexFilter] = useState<SexFilter>("all");
  const [trainingFilter, setTrainingFilter] = useState<TrainingFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return records
      .filter((record) => {
        if (statusFilter === "active" && !record.isActive) return false;
        if (statusFilter === "inactive" && record.isActive) return false;
        if (sexFilter !== "all") {
          if (sexFilter === "unspecified" && record.sex) return false;
          if (sexFilter !== "unspecified" && record.sex !== sexFilter) return false;
        }
        if (trainingFilter !== "all" && getTrainingState(record) !== trainingFilter) {
          return false;
        }
        if (!normalized) return true;
        return `${record.userId} ${record.name} ${record.emailAddress} ${record.phoneNumber ?? ""} ${record.state ?? ""}`
          .toLowerCase()
          .includes(normalized);
      })
      .sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [records, search, sexFilter, sortKey, sortDir, statusFilter, trainingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const from = filtered.length ? (currentPage - 1) * pageSize + 1 : 0;
  const to = Math.min(currentPage * pageSize, filtered.length);

  const sliceIds = slice.map((record) => record.id);
  const allSelectedOnPage =
    sliceIds.length > 0 && sliceIds.every((id) => selected.has(id));

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const emptyLabel =
    target === "admin" ? "No admins match your filters." : "No users match your filters.";

  return (
    <div className="space-y-3">
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
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
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
            <option value="inactive">Inactive</option>
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
              placeholder="Search ID, name, email, phone, state, or training"
              className="h-10 w-80 pl-9"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-ink-soft">
              <tr>
                <th className="px-3 py-3 font-medium">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={(event) =>
                      onToggleSelectAll(sliceIds, event.target.checked)
                    }
                    className="h-4 w-4 rounded border-line"
                  />
                </th>
                {columns.map((column) => {
                  const active = sortKey === column.key;
                  const Icon = active
                    ? sortDir === "asc"
                      ? ArrowUp
                      : ArrowDown
                    : ArrowUpDown;
                  return (
                    <th
                      key={column.key}
                      className="px-4 py-3 font-medium"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={`inline-flex items-center gap-1 transition hover:text-foreground ${
                          active ? "text-foreground" : ""
                        }`}
                      >
                        {column.label}
                        <Icon className="h-3 w-3" />
                      </button>
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-14 text-center text-sm text-ink-soft">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-14 text-center text-sm text-brand-700">
                    {error}
                  </td>
                </tr>
              ) : slice.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-14 text-center text-sm text-ink-soft">
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                slice.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-line align-middle transition hover:bg-slate-50/60"
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(record.id)}
                        onChange={() => onToggleSelect(record.id)}
                        className="h-4 w-4 rounded border-line"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-soft">{record.userId}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{record.name}</td>
                    <td className="px-4 py-3">{record.age ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{record.sex ?? "—"}</td>
                    <td className="px-4 py-3">{record.state ?? "—"}</td>
                    <td className="px-4 py-3">{record.emailAddress}</td>
                    <td className="px-4 py-3">{record.phoneNumber ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                          record.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {record.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(record.trainingStartDate)}</td>
                    <td className="px-4 py-3">{formatDate(record.trainingEndDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(record)}
                          className="rounded-full p-1.5 text-ink-soft transition hover:bg-sky-50 hover:text-sky-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleActive(record)}
                          className="rounded-full p-1.5 text-ink-soft transition hover:bg-amber-50 hover:text-amber-600"
                          title={record.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50 hover:text-brand-600"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(record)}
                          className="rounded-full p-1.5 text-ink-soft transition hover:bg-brand-50 hover:text-brand-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
          <div className="text-sm text-ink-soft">
            Showing {from} to {to} of {filtered.length} entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 px-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 px-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
