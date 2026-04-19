import { redirect } from "next/navigation";

import { dashboardHomeByRole } from "@/backend/auth/constants";
import { requireAuthenticatedUser } from "@/backend/auth/guards";

export default async function DashboardRedirectPage() {
  const user = await requireAuthenticatedUser();
  redirect(dashboardHomeByRole[user.role]);
}
