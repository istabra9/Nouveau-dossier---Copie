import { redirect } from "next/navigation";

import type { Role } from "@/frontend/types";

import { dashboardHomeByRole } from "./constants";
import { getCurrentUser } from "./session";

export async function requireAuthenticatedUser(pathname = "/dashboard") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return user;
}

export async function requireRole(roles: Role[], pathname: string) {
  const user = await requireAuthenticatedUser(pathname);

  if (!roles.includes(user.role)) {
    redirect(dashboardHomeByRole[user.role]);
  }

  return user;
}
