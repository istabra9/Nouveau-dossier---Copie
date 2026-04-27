"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChartColumnIncreasing,
  LayoutDashboard,
  Megaphone,
  Shield,
  Upload,
  UserCircle2,
} from "lucide-react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { BrandMark } from "@/frontend/components/shared/brand-mark";
import { cn } from "@/frontend/utils/cn";
import type { SessionUser } from "@/frontend/types";

const iconMap = {
  dashboard: LayoutDashboard,
  analytics: ChartColumnIncreasing,
  import: Upload,
  security: Shield,
  user: UserCircle2,
  notifications: Megaphone,
};

type SidebarMessages = ReturnType<typeof useLocale>["messages"]["sidebar"];

function getLinks(role: SessionUser["role"], t: SidebarMessages) {
  if (role === "super_admin") {
    return [
      { href: "/dashboard/super-admin/management", label: t.superAdmin.management, icon: "security" },
      { href: "/dashboard/super-admin#users", label: t.superAdmin.users, icon: "user" },
      { href: "/dashboard/super-admin", label: t.superAdmin.executive, icon: "dashboard" },
      { href: "/dashboard/super-admin#trainings", label: t.superAdmin.trainings, icon: "analytics" },
      { href: "/dashboard/import-export", label: t.superAdmin.importExport, icon: "import" },
      { href: "/dashboard/super-admin#insights", label: t.superAdmin.insights, icon: "notifications" },
      { href: "/profile", label: t.superAdmin.profile, icon: "user" },
    ] as const;
  }

  if (role === "admin") {
    return [
      { href: "/dashboard/admin/users", label: t.admin.users, icon: "user" },
      { href: "/dashboard/admin", label: t.admin.dashboard, icon: "dashboard" },
      { href: "/dashboard/import-export", label: t.admin.importExport, icon: "import" },
      { href: "/dashboard/admin#stats", label: t.admin.stats, icon: "analytics" },
      { href: "/dashboard/admin#notifications", label: t.admin.notifications, icon: "notifications" },
      { href: "/profile", label: t.admin.profile, icon: "user" },
    ] as const;
  }

  return [
    { href: "/dashboard/user", label: t.user.dashboard, icon: "analytics" },
    { href: "/profile", label: t.user.profile, icon: "user" },
    { href: "/trainings", label: t.user.browse, icon: "analytics" },
    { href: "/trainings/calendar", label: t.user.calendar, icon: "import" },
  ] as const;
}

export function DashboardSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const { messages } = useLocale();
  const t = messages.sidebar;
  const links = getLinks(user.role, t);
  const roleLabel =
    user.role === "super_admin"
      ? "SUPER ADMIN"
      : user.role === "admin"
        ? "ADMIN"
        : "USER";

  return (
    <aside className="surface-panel-strong sticky top-6 hidden h-[calc(100vh-3rem)] w-full max-w-[320px] rounded-[36px] border border-line p-6 lg:flex lg:flex-col">
      <BrandMark compact />

      <div className="mt-8 rounded-[30px] bg-[linear-gradient(160deg,#62101f_0%,#a71d35_55%,#ea3d56_100%)] p-6 text-white shadow-[0_24px_50px_rgba(80,16,24,0.24)]">
        <div className="text-xs uppercase tracking-[0.28em] text-white/72">
          {roleLabel}
        </div>
        <div className="mt-4 text-2xl font-semibold">{user.name}</div>
        <div className="mt-1 text-sm text-white/82">{user.company}</div>
      </div>

      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const Icon = iconMap[link.icon];
          const active = pathname === link.href.split("#")[0];

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium transition",
                active
                  ? "bg-brand-500 text-white shadow-[0_16px_34px_rgba(190,34,60,0.24)]"
                  : "text-ink-soft hover:bg-background hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {link.label}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
