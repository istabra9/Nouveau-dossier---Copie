"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import type { Role, UserRecord } from "@/frontend/types";

const pageSize = 6;

type CreateUserState = {
  name: string;
  email: string;
  company: string;
  department: string;
  password: string;
  role: "user" | "admin";
};

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
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [createState, setCreateState] = useState<CreateUserState>({
    name: "",
    email: "",
    company: "",
    department: "",
    password: "",
    role: "user",
  });

  const filteredUsers = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) {
        return false;
      }

      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return `${user.name} ${user.email} ${user.company} ${user.department}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [roleFilter, search, statusFilter, users]);

  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  async function refreshView() {
    router.refresh();
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createState),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      user?: UserRecord;
    };

    if (!response.ok || !payload.user) {
      setMessage(payload.message ?? "Unable to create user.");
      return;
    }

    setUsers((current) => [payload.user!, ...current]);
    setCreateState({
      name: "",
      email: "",
      company: "",
      department: "",
      password: "",
      role: "user",
    });
    setMessage("User created.");
    await refreshView();
  }

  async function handleUpdateUser(
    userId: string,
    updates: Partial<Pick<UserRecord, "status" | "role">>,
  ) {
    setMessage(null);

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      user?: UserRecord;
    };

    if (!response.ok || !payload.user) {
      setMessage(payload.message ?? "Unable to update user.");
      return;
    }

    setUsers((current) =>
      current.map((user) => (user.id === userId ? payload.user! : user)),
    );
    setMessage("User updated.");
    await refreshView();
  }

  async function handleDeleteUser(userId: string) {
    setMessage(null);

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { ok?: boolean; message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Unable to delete user.");
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== userId));
    setMessage("User deleted.");
    await refreshView();
  }

  return (
    <div className="space-y-5">
      <div className="surface-panel p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-ink-soft">
            Search, filter, create, activate, and remove accounts.
          </p>
        </div>

        <form onSubmit={handleCreateUser} className="mt-5 grid gap-3 lg:grid-cols-6">
          <Input
            value={createState.name}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Full name"
            className="lg:col-span-2"
          />
          <Input
            value={createState.email}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email"
            className="lg:col-span-2"
          />
          <Input
            value={createState.company}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, company: event.target.value }))
            }
            placeholder="Company"
          />
          <Input
            value={createState.department}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, department: event.target.value }))
            }
            placeholder="Department"
          />
          <Input
            type="password"
            value={createState.password}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Password"
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
              Add user
            </Button>
          </div>
        </form>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search users"
            className="lg:col-span-2"
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
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
          >
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {canManageRoles ? <option value="super_admin">Super admin</option> : null}
          </Select>
        </div>

        {message ? (
          <div className="mt-4 rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {message}
          </div>
        ) : null}
      </div>

      <div className="surface-panel overflow-hidden p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-ink-soft">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t border-line align-top">
                  <td className="py-4 font-medium">{user.name}</td>
                  <td className="py-4 text-ink-soft">{user.email}</td>
                  <td className="py-4">
                    {canManageRoles && user.role !== "super_admin" ? (
                      <Select
                        value={user.role}
                        onChange={(event) =>
                          handleUpdateUser(user.id, {
                            role: event.target.value as UserRecord["role"],
                          })
                        }
                        className="h-10 min-w-[120px]"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Select>
                    ) : (
                      <span className="capitalize">{user.role.replace("_", " ")}</span>
                    )}
                  </td>
                  <td className="py-4">
                    <Select
                      value={user.status}
                      onChange={(event) =>
                        handleUpdateUser(user.id, {
                          status: event.target.value as UserRecord["status"],
                        })
                      }
                      className="h-10 min-w-[120px]"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </Select>
                  </td>
                  <td className="py-4 text-ink-soft">{user.company}</td>
                  <td className="py-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === "super_admin"}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-sm text-ink-soft">
            {filteredUsers.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
