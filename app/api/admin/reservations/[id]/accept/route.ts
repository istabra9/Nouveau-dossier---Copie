import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/session";
import {
  findEnrollmentRequestById,
  updateEnrollmentRequest,
} from "@/backend/repositories/enrollment-request-repository";
import {
  findTrainingBySlug,
  findUserById,
} from "@/backend/repositories/platform-repository";
import {
  getEmailService,
  renderAcceptanceEmail,
} from "@/backend/services/email";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json(
      { ok: false, message: "Only a super administrator can accept requests." },
      { status: 403 },
    );
  }

  const { id } = await params;
  const record = await findEnrollmentRequestById(id);
  if (!record) {
    return NextResponse.json(
      { ok: false, message: "Request not found." },
      { status: 404 },
    );
  }

  if (record.status !== "pending") {
    return NextResponse.json(
      { ok: false, message: `Request already ${record.status}.` },
      { status: 409 },
    );
  }

  const [requester, training] = await Promise.all([
    findUserById(record.userId),
    findTrainingBySlug(record.trainingSlug),
  ]);

  if (!requester || !training) {
    return NextResponse.json(
      { ok: false, message: "Cannot resolve user or training for this request." },
      { status: 404 },
    );
  }

  const updated = await updateEnrollmentRequest(id, {
    status: "accepted",
    decidedAt: new Date().toISOString(),
    decidedBy: user.id,
  });

  const rendered = renderAcceptanceEmail({
    to: requester.email,
    userName: requester.firstName || requester.name,
    trainingTitle: training.title,
    startDate: training.startDate,
    endDate: training.endDate,
    location: training.format,
    trainerName: training.trainerName,
    trainerEmail: training.trainerEmail,
    description: training.summary,
    appUrl: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/user`
      : undefined,
  });

  let emailResult: "sent" | "failed" = "sent";
  let emailError: string | undefined;
  try {
    await getEmailService().send({
      to: requester.email,
      subject: rendered.subject,
      body: rendered.body,
      html: rendered.html,
      template: "enrollment-accepted",
      meta: {
        requestId: id,
        trainingSlug: training.slug,
        userId: requester.id,
      },
    });
  } catch (error) {
    emailResult = "failed";
    emailError = (error as Error).message;
  }

  return NextResponse.json({
    ok: true,
    record: updated,
    email: emailResult,
    emailError,
  });
}
