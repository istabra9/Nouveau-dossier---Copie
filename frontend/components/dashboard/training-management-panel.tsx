"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import type { Category, Training } from "@/frontend/types";

const pageSize = 6;

type CreateTrainingState = {
  title: string;
  code: string;
  categorySlug: string;
  trainerName: string;
  trainerEmail: string;
  trainerExpertise: string;
  startDate: string;
  endDate: string;
  status: Training["status"];
};

export function TrainingManagementPanel({
  initialTrainings,
  categories,
}: {
  initialTrainings: Training[];
  categories: Category[];
}) {
  const router = useRouter();
  const [trainings, setTrainings] = useState(initialTrainings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Training["status"]>("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [createState, setCreateState] = useState<CreateTrainingState>({
    title: "",
    code: "",
    categorySlug: categories[0]?.slug ?? "cyber-security",
    trainerName: "",
    trainerEmail: "",
    trainerExpertise: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

  const filteredTrainings = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return trainings.filter((training) => {
      if (statusFilter !== "all" && training.status !== statusFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return `${training.title} ${training.code} ${training.categorySlug} ${training.trainerName}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [search, statusFilter, trainings]);

  const totalPages = Math.max(1, Math.ceil(filteredTrainings.length / pageSize));
  const paginatedTrainings = filteredTrainings.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  async function refreshView() {
    router.refresh();
  }

  async function handleCreateTraining(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/admin/trainings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createState),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      training?: Training;
    };

    if (!response.ok || !payload.training) {
      setMessage(payload.message ?? "Unable to create training.");
      return;
    }

    setTrainings((current) => [payload.training!, ...current]);
    setCreateState({
      title: "",
      code: "",
      categorySlug: categories[0]?.slug ?? "cyber-security",
      trainerName: "",
      trainerEmail: "",
      trainerExpertise: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
    });
    setMessage("Training created.");
    await refreshView();
  }

  async function handleStatusChange(slug: string, status: Training["status"]) {
    const response = await fetch(`/api/admin/trainings/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const payload = (await response.json()) as {
      ok?: boolean;
      message?: string;
      training?: Training;
    };

    if (!response.ok || !payload.training) {
      setMessage(payload.message ?? "Unable to update training.");
      return;
    }

    setTrainings((current) =>
      current.map((training) =>
        training.slug === slug ? payload.training! : training,
      ),
    );
    setMessage("Training updated.");
    await refreshView();
  }

  async function handleDeleteTraining(slug: string) {
    const response = await fetch(`/api/admin/trainings/${slug}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { ok?: boolean; message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Unable to delete training.");
      return;
    }

    setTrainings((current) => current.filter((training) => training.slug !== slug));
    setMessage("Training deleted.");
    await refreshView();
  }

  return (
    <div className="space-y-5">
      <div className="surface-panel p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Training management</h3>
          <p className="text-sm text-ink-soft">
            Create, monitor, and update the live catalogue.
          </p>
        </div>

        <form onSubmit={handleCreateTraining} className="mt-5 grid gap-3 lg:grid-cols-3">
          <Input
            value={createState.title}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Training title"
          />
          <Input
            value={createState.code}
            onChange={(event) =>
              setCreateState((current) => ({ ...current, code: event.target.value }))
            }
            placeholder="Code"
          />
          <Select
            value={createState.categorySlug}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                categorySlug: event.target.value,
              }))
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            value={createState.trainerName}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                trainerName: event.target.value,
              }))
            }
            placeholder="Trainer name"
          />
          <Input
            value={createState.trainerEmail}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                trainerEmail: event.target.value,
              }))
            }
            placeholder="Trainer email"
          />
          <Input
            value={createState.trainerExpertise}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                trainerExpertise: event.target.value,
              }))
            }
            placeholder="Trainer expertise"
          />
          <Input
            type="date"
            value={createState.startDate}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
          />
          <Input
            type="date"
            value={createState.endDate}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
          />
          <Select
            value={createState.status}
            onChange={(event) =>
              setCreateState((current) => ({
                ...current,
                status: event.target.value as Training["status"],
              }))
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </Select>
          <div className="lg:col-span-3">
            <Button type="submit" className="w-full">
              Add training
            </Button>
          </div>
        </form>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search trainings"
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
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
                <th className="pb-3 font-medium">Training</th>
                <th className="pb-3 font-medium">Trainer</th>
                <th className="pb-3 font-medium">Dates</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Users</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrainings.map((training) => (
                <tr key={training.id} className="border-t border-line align-top">
                  <td className="py-4">
                    <div className="font-medium">{training.title}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                      {training.code}
                    </div>
                  </td>
                  <td className="py-4 text-ink-soft">{training.trainerName}</td>
                  <td className="py-4 text-ink-soft">
                    {training.startDate} → {training.endDate}
                  </td>
                  <td className="py-4">
                    <Select
                      value={training.status}
                      onChange={(event) =>
                        handleStatusChange(
                          training.slug,
                          event.target.value as Training["status"],
                        )
                      }
                      className="h-10 min-w-[140px]"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                    </Select>
                  </td>
                  <td className="py-4">{training.enrolledUsersCount}</td>
                  <td className="py-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleDeleteTraining(training.slug)}
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
            {filteredTrainings.length} results
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
