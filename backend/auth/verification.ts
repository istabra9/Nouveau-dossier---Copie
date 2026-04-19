import { createHash, randomBytes } from "node:crypto";

export const VERIFICATION_TOKEN_TTL_HOURS = 24;

export function generateVerificationToken() {
  const token = randomBytes(32).toString("hex");
  const hash = hashVerificationToken(token);
  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString();

  return { token, hash, expiresAt };
}

export function hashVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function buildVerificationUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/auth/verify?token=${encodeURIComponent(token)}`;
}
