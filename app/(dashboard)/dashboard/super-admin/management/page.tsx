import { ManagementView } from "@/frontend/components/superadmin/management-view";
import { requireRole } from "@/backend/auth/guards";

export default async function SuperAdminManagementPage() {
  await requireRole(["super_admin"], "/dashboard/super-admin/management");

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-[0.24em] text-brand-600">
          Super admin
        </div>
        <h1 className="text-2xl font-semibold">🛡️ Users & admins management</h1>
        <p className="text-sm text-ink-soft">
          Full control over accounts. Create, edit, activate, deactivate, delete,
          and export every user or admin on the platform.
        </p>
      </div>
      <ManagementView />
    </div>
  );
}
