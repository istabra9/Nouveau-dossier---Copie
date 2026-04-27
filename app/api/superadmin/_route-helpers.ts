import { NextResponse } from "next/server";

import { requireApiRole } from "@/backend/auth/api";
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/backend/services/superadmin-actions";
import {
  type AccountTarget,
  accountCreateSchema,
  accountUpdateSchema,
  listAccounts,
  toAccountDTO,
} from "@/backend/services/superadmin";
import { findUserById } from "@/backend/repositories/platform-repository";
import type { Role } from "@/frontend/types";

const SUPER_ADMIN_ONLY: Role[] = ["super_admin"];

export async function handleList(
  target: AccountTarget,
  allowedRoles: Role[] = SUPER_ADMIN_ONLY,
) {
  const auth = await requireApiRole(allowedRoles);
  if (auth.response) return auth.response;
  const records = await listAccounts(target);
  return NextResponse.json({ ok: true, records });
}

export async function handleCreate(
  request: Request,
  target: AccountTarget,
  allowedRoles: Role[] = SUPER_ADMIN_ONLY,
) {
  const auth = await requireApiRole(allowedRoles);
  if (auth.response) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const parsed = accountCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid payload.",
      },
      { status: 400 },
    );
  }

  try {
    const record = await createAccount(auth.user, target, parsed.data);
    return NextResponse.json({ ok: true, record });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function handleGetOne(
  id: string,
  target: AccountTarget,
  allowedRoles: Role[] = SUPER_ADMIN_ONLY,
) {
  const auth = await requireApiRole(allowedRoles);
  if (auth.response) return auth.response;

  const existing = await findUserById(id);
  const expectedRole = target === "admin" ? "admin" : "user";
  if (!existing || existing.role !== expectedRole) {
    return NextResponse.json(
      { ok: false, message: "Account not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, record: toAccountDTO(existing) });
}

export async function handleUpdate(
  request: Request,
  id: string,
  target: AccountTarget,
  allowedRoles: Role[] = SUPER_ADMIN_ONLY,
) {
  const auth = await requireApiRole(allowedRoles);
  if (auth.response) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const parsed = accountUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid payload.",
      },
      { status: 400 },
    );
  }

  try {
    const record = await updateAccount(auth.user, target, id, parsed.data);
    return NextResponse.json({ ok: true, record });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function handleDelete(
  id: string,
  target: AccountTarget,
  allowedRoles: Role[] = SUPER_ADMIN_ONLY,
) {
  const auth = await requireApiRole(allowedRoles);
  if (auth.response) return auth.response;

  try {
    await deleteAccount(auth.user, target, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: (error as Error).message },
      { status: 400 },
    );
  }
}
