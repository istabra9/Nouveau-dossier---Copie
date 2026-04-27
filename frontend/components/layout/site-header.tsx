import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";

import { logoutAction } from "@/backend/auth/actions";
import { dashboardHomeByRole } from "@/backend/auth/constants";
import { LanguageSwitcher } from "@/frontend/components/layout/language-switcher";
import { ThemeSwitcher } from "@/frontend/components/layout/theme-switcher";
import { BrandMark } from "@/frontend/components/shared/brand-mark";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";
import type { SessionUser } from "@/frontend/types";

type SiteHeaderProps = {
  user: SessionUser | null;
};

export async function SiteHeader({ user }: SiteHeaderProps) {
  const locale = await getCurrentLocale();
  const copy = getMessages(locale);

  const profileLabel = locale === "fr" ? "Mon profil" : locale === "ar" ? "حسابي" : "My profile";
  const logoutLabel =
    locale === "fr" ? "Se déconnecter" : locale === "ar" ? "تسجيل الخروج" : "Log out";
  const categoriesLabel = locale === "fr" ? "Catégories" : locale === "ar" ? "الفئات" : "Categories";
  const trainingsLabel = locale === "fr" ? "Formations" : locale === "ar" ? "الدورات" : "Trainings";
  const calendarLabel = locale === "fr" ? "Calendrier" : locale === "ar" ? "التقويم" : "Calendar";
  const searchPlaceholder = copy.home.searchPlaceholder;

  return (
    <header className="marketing-nav-shell sticky top-0 z-50 border-b border-line shadow-[0_10px_30px_rgba(190,34,60,0.05)] backdrop-blur-xl">
      <div className="section-wrap py-3">
        <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
          <BrandMark compact className="shrink-0" />

          <Link
            href="/#categories"
            className="hidden items-center gap-2 text-sm font-medium text-foreground lg:inline-flex"
          >
            {categoriesLabel}
            <ChevronDown className="h-4 w-4" />
          </Link>

          <form
            action="/trainings"
            className="order-3 flex w-full items-center gap-3 rounded-full border border-brand-100 bg-surface-strong px-5 py-2.5 shadow-[0_14px_32px_rgba(190,34,60,0.08)] lg:order-none lg:mx-2 lg:max-w-[680px] lg:flex-1"
          >
            <Search className="h-5 w-5 text-brand-500" />
            <Input
              name="q"
              placeholder={searchPlaceholder}
              className="h-auto border-0 bg-transparent px-0 py-0 text-base shadow-none ring-0 focus:ring-0"
            />
          </form>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="/trainings" className="text-sm font-medium text-foreground hover:text-brand-700">
              {trainingsLabel}
            </Link>
            <Link href="/trainings/calendar" className="text-sm font-medium text-foreground hover:text-brand-700">
              {calendarLabel}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher className="shrink-0" />
            <LanguageSwitcher className="shrink-0" />
            {user ? (
              <>
                <Link href={user.role === "user" ? "/profile" : dashboardHomeByRole[user.role]}>
                  <Button variant="secondary" className="h-12 px-6">
                    {user.role === "user" ? profileLabel : copy.header.openDashboard}
                  </Button>
                </Link>
                <form action={logoutAction}>
                  <button className="h-12 rounded-full border border-brand-300 px-6 text-sm font-semibold text-foreground hover:bg-brand-50">
                    {logoutLabel}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="secondary" className="h-12 border-brand-300 px-6">
                    {copy.header.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-12 px-6 shadow-[0_12px_24px_rgba(255,111,0,0.18)]">
                    {copy.header.getStarted}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
