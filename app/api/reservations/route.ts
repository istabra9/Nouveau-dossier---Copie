import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  createEnrollmentRequest,
  findPendingRequestForUserAndTraining,
  listEnrollmentRequests,
} from "@/backend/repositories/enrollment-request-repository";
import { findTrainingBySlug } from "@/backend/repositories/platform-repository";

const schema = z.object({
  trainingSlug: z.string().min(1),
  scheduleId: z.string().optional(),
  reason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Please log in to request enrollment." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid reservation payload." },
      { status: 400 },
    );
  }

  const training = await findTrainingBySlug(parsed.data.trainingSlug);
  if (!training) {
    return NextResponse.json(
      { ok: false, message: "Training not found." },
      { status: 404 },
    );
  }

  const existing = await findPendingRequestForUserAndTraining(
    user.id,
    parsed.data.trainingSlug,
  );
  if (existing) {
    return NextResponse.json(
      { ok: true, duplicate: true, record: existing },
      { status: 200 },
    );
  }

  const record = await createEnrollmentRequest({
    userId: user.id,
    trainingSlug: parsed.data.trainingSlug,
    scheduleId: parsed.data.scheduleId,
    reason: parsed.data.reason,
  });

  return NextResponse.json({ ok: true, record }, { status: 201 });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const all = await listEnrollmentRequests();
  const mine = all.filter((req) => req.userId === user.id);
  return NextResponse.json({ ok: true, records: mine });
}
