import {
  ManagementView,
  adminConfig,
} from "@/frontend/components/superadmin/management-view";
import { requireRole } from "@/backend/auth/guards";

export default async function AdminUsersPage() {
  await requireRole(["admin", "super_admin"], "/dashboard/admin/users");

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          Admin
        </div>
        <h1 className="text-2xl font-semibold">👥 Users management</h1>
        <p className="text-sm text-ink-soft">
          Create, edit, activate, deactivate, delete and export learner accounts.
        </p>
      </div>
      <ManagementView config={adminConfig} />
    </div>
  );
}
