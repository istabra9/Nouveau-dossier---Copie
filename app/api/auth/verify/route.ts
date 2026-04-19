import { NextResponse } from "next/server";

import { hashVerificationToken } from "@/backend/auth/verification";
import {
  findUserByVerificationHash,
  markUserEmailVerified,
} from "@/backend/repositories/platform-repository";

function buildRedirect(request: Request, status: "ok" | "invalid" | "expired") {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const search = status === "ok" ? "verified=1" : `verified=0&reason=${status}`;
  return NextResponse.redirect(`${base.replace(/\/$/, "")}/login?${search}`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return buildRedirect(request, "invalid");
  }

  const hash = hashVerificationToken(token);
  const user = await findUserByVerificationHash(hash);

  if (!user) {
    return buildRedirect(request, "invalid");
  }

  const expiresAt = user.verificationTokenExpiresAt;
  if (!expiresAt || Date.parse(expiresAt) < Date.now()) {
    return buildRedirect(request, "expired");
  }

  await markUserEmailVerified(user.id);
  return buildRedirect(request, "ok");
}
