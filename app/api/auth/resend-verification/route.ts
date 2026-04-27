import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  buildVerificationUrl,
  generateVerificationToken,
} from "@/backend/auth/verification";
import {
  findUserByEmail,
  setUserVerificationToken,
} from "@/backend/repositories/platform-repository";
import {
  getEmailService,
  renderConfirmationEmail,
} from "@/backend/services/email";

const bodySchema = z.object({
  email: z.email().optional(),
});

export async function POST(request: Request) {
  let payload: unknown = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }

  const session = await getCurrentUser();
  const targetEmail = (parsed.data.email ?? session?.email ?? "")
    .trim()
    .toLowerCase();

  if (!targetEmail) {
    return NextResponse.json(
      { message: "No email address provided." },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(targetEmail);

  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  const verification = generateVerificationToken();
  await setUserVerificationToken(
    user.id,
    verification.hash,
    verification.expiresAt,
  );

  const verifyUrl = buildVerificationUrl(verification.token);
  const confirmation = renderConfirmationEmail({
    to: user.email,
    userName: user.firstName,
    verifyUrl,
  });

  try {
    await getEmailService().send({
      to: user.email,
      subject: confirmation.subject,
      body: confirmation.body,
      html: confirmation.html,
      template: "signup-confirmation",
      meta: { userId: user.id, resent: "true" },
    });
  } catch (error) {
    console.error(
      `[auth:resend] failed to send confirmation email to ${user.email}:`,
      error,
    );
    return NextResponse.json(
      { message: "We could not send the email right now. Try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
