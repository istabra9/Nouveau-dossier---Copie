"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/frontend/components/ui/button";

export function FormSubmitButton({
  label,
  pendingLabel,
  variant = "primary",
}: {
  label: string;
  pendingLabel: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} className="w-full">
      {pending ? pendingLabel : label}
    </Button>
  );
}
