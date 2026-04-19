import type { Role } from "@/frontend/types";

export const SESSION_COOKIE = "advancia_session";

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export const dashboardHomeByRole: Record<Role, string> = {
  super_admin: "/dashboard/super-admin",
  admin: "/dashboard/admin",
  user: "/dashboard/user",
};
