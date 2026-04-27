import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import {
  createActivityLogRecord,
  deleteUserById,
  findUserById,
  updateUserById,
} from "@/backend/repositories/platform-repository";

const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z
    .string()
    .trim()
    .min(8, "Phone number is required.")
    .max(24, "Phone number is too long.")
    .regex(/^[+()0-9\s-]+$/, "Use a valid phone number.")
    .optional(),
  company: z.string().min(2).optional(),
  department: z.string().min(2).optional(),
  status: z.enum(["active", "pending"]).optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiRole(["admin", "super_admin"]);

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const targetUser = await findUserById(id);

  if (!targetUser) {
    return NextResponse.json(
      { ok: false, message: "User not found." },
      { status: 404 },
    );
  }

  if (auth.user.role === "admin" && targetUser.role !== "user") {
    return NextResponse.json(
      { ok: false, message: "Admins can only manage learner accounts." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid user update." },
      { status: 400 },
    );
  }

  const input = { ...parsed.data };

  if (auth.user.role !== "super_admin") {
    delete input.role;
  }

  const updated = await updateUserById(id, {
    ...input,
    name:
      input.firstName || input.lastName
        ? `${input.firstName ?? targetUser.firstName} ${input.lastName ?? targetUser.lastName}`.trim()
        : undefined,
  });

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "user-updated",
    entityType: "user",
    entityId: id,
    message: `Updated ${targetUser.name}.`,
    severity: "info",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiRole(["admin", "super_admin"]);

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const targetUser = await findUserById(id);

  if (!targetUser) {
    return NextResponse.json(
      { ok: false, message: "User not found." },
      { status: 404 },
    );
  }

  if (targetUser.id === auth.user.id) {
    return NextResponse.json(
      { ok: false, message: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  if (auth.user.role === "admin" && targetUser.role !== "user") {
    return NextResponse.json(
      { ok: false, message: "Admins can only delete learner accounts." },
      { status: 403 },
    );
  }

  const deleted = await deleteUserById(id);

  if (!deleted) {
    return NextResponse.json(
      { ok: false, message: "Unable to delete user." },
      { status: 400 },
    );
  }

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "user-deleted",
    entityType: "user",
    entityId: id,
    message: `Deleted ${targetUser.name}.`,
    severity: "warning",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
