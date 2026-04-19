import type { Role } from "@/frontend/types";

import { dashboardHomeByRole } from "./constants";

export function canAccessDashboardPath(role: Role, pathname: string) {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/user")) {
    return true;
  }

  if (
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/dashboard/import-export")
  ) {
    return role === "admin" || role === "super_admin";
  }

  if (pathname.startsWith("/dashboard/super-admin")) {
    return role === "super_admin";
  }

  return role in dashboardHomeByRole;
}
