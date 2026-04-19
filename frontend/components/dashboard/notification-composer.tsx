"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";

export function NotificationComposer() {
  const router = useRouter();
  const [state, setState] = useState({
    title: "",
    message: "",
    audience: "all",
    type: "system",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const response = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const payload = (await response.json()) as { ok?: boolean; message?: string };

    if (!response.ok) {
      setFeedback(payload.message ?? "Unable to send notification.");
      return;
    }

    setState({
      title: "",
      message: "",
      audience: "all",
      type: "system",
    });
    setFeedback("Notification sent.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel space-y-4 p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Send notification</h3>
        <p className="text-sm text-ink-soft">Broadcast updates or targeted alerts.</p>
      </div>

      <Input
        value={state.title}
        onChange={(event) =>
          setState((current) => ({ ...current, title: event.target.value }))
        }
        placeholder="Title"
      />
      <Input
        value={state.message}
        onChange={(event) =>
          setState((current) => ({ ...current, message: event.target.value }))
        }
        placeholder="Message"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={state.audience}
          onChange={(event) =>
            setState((current) => ({ ...current, audience: event.target.value }))
          }
        >
          <option value="all">All</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super admin</option>
        </Select>
        <Select
          value={state.type}
          onChange={(event) =>
            setState((current) => ({ ...current, type: event.target.value }))
          }
        >
          <option value="system">System</option>
          <option value="training">Training</option>
          <option value="security">Security</option>
          <option value="payment">Payment</option>
          <option value="enrollment">Enrollment</option>
        </Select>
      </div>

      {feedback ? (
        <div className="rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {feedback}
        </div>
      ) : null}

      <Button type="submit">Send</Button>
    </form>
  );
}
