import { NextResponse } from "next/server";

import type { Role, SessionUser } from "@/frontend/types";

import { getCurrentUser } from "./session";

type ApiAuthResult =
  | { user: SessionUser; response?: never }
  | { user?: never; response: NextResponse };

export async function requireApiRole(roles: Role[]): Promise<ApiAuthResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: NextResponse.json(
        { ok: false, message: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  if (!roles.includes(user.role)) {
    return {
      response: NextResponse.json(
        { ok: false, message: "You do not have access to this action." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
