import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import {
  createActivityLogRecord,
  deleteTrainingBySlug,
  findTrainingBySlug,
  updateTrainingBySlug,
} from "@/backend/repositories/platform-repository";

const updateTrainingSchema = z.object({
  title: z.string().min(3).optional(),
  categorySlug: z.string().min(2).optional(),
  trainerName: z.string().min(2).optional(),
  trainerEmail: z.email().optional(),
  trainerExpertise: z.string().min(2).optional(),
  startDate: z.string().min(8).optional(),
  endDate: z.string().min(8).optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "delayed"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireApiRole(["super_admin"]);

  if (auth.response) {
    return auth.response;
  }

  const { slug } = await params;
  const targetTraining = await findTrainingBySlug(slug);

  if (!targetTraining) {
    return NextResponse.json(
      { ok: false, message: "Training not found." },
      { status: 404 },
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

  const parsed = updateTrainingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid training update." },
      { status: 400 },
    );
  }

  const updated = await updateTrainingBySlug(slug, parsed.data);

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "training-updated",
    entityType: "training",
    entityId: targetTraining.id,
    message: `Updated training ${targetTraining.title}.`,
    severity: "info",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, training: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireApiRole(["super_admin"]);

  if (auth.response) {
    return auth.response;
  }

  const { slug } = await params;
  const targetTraining = await findTrainingBySlug(slug);

  if (!targetTraining) {
    return NextResponse.json(
      { ok: false, message: "Training not found." },
      { status: 404 },
    );
  }

  const deleted = await deleteTrainingBySlug(slug);

  if (!deleted) {
    return NextResponse.json(
      { ok: false, message: "Unable to delete training." },
      { status: 400 },
    );
  }

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "training-deleted",
    entityType: "training",
    entityId: targetTraining.id,
    message: `Deleted training ${targetTraining.title}.`,
    severity: "warning",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
