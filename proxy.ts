import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, dashboardHomeByRole } from "@/backend/auth/constants";
import { canAccessDashboardPath } from "@/backend/auth/permissions";
import { verifySessionToken } from "@/backend/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(`${pathname}${search}`)}`, request.url),
    );
  }

  const user = await verifySessionToken(token);

  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(`${pathname}${search}`)}`, request.url),
    );
  }

  if (!canAccessDashboardPath(user.role, pathname)) {
    return NextResponse.redirect(new URL(dashboardHomeByRole[user.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
