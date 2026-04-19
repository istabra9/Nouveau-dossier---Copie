import { getCalendarPageData } from "@/backend/services/platform";
import { TrainingCalendar } from "@/frontend/components/catalogue/training-calendar";
import { getCurrentLocale } from "@/frontend/i18n/server";

export default async function CalendarPage() {
  const locale = await getCurrentLocale();
  const calendar = await getCalendarPageData();

  return (
    <div className="section-wrap py-12">
      <TrainingCalendar
        schedules={calendar.schedules}
        categories={calendar.categories}
        locale={locale}
      />
    </div>
  );
}
