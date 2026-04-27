import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import type { SessionUser, UserRecord } from "@/frontend/types";
import { findUserById } from "@/backend/repositories/platform-repository";

import { SESSION_COOKIE } from "./constants";

const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(
    process.env.AUTH_SECRET ?? "advancia-local-secret-change-me",
  );
}

export function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    department: user.department,
    avatar: user.avatar,
    focusTracks: user.focusTracks,
    emailVerified: user.emailVerified ?? false,
  };
}

function isHttps() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "").startsWith("https://");
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isHttps(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function createSessionToken(user: SessionUser) {
  const payload: JWTPayload = { ...user };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify(token, getSecret());
    return verified.payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const sessionUser = await verifySessionToken(token);

  if (!sessionUser) {
    return null;
  }

  const freshUser = await findUserById(sessionUser.id);
  if (!freshUser) {
    return sessionUser;
  }

  const normalized =
    freshUser.role === "super_admin" && freshUser.name !== "Ramzy Sassi"
      ? { ...freshUser, name: "Ramzy Sassi", firstName: "Ramzy", lastName: "Sassi" }
      : freshUser;

  return toSessionUser(normalized);
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, getSessionCookieOptions());
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
