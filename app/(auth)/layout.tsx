import { BrandMark } from "@/frontend/components/shared/brand-mark";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();
  const t = getMessages(locale).auth;

  return (
    <main className="section-wrap flex min-h-screen items-center py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="hidden space-y-6 lg:block">
          <BrandMark />
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-balance">
              {t.layoutTitle}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-ink-soft">
              {t.layoutBody}
            </p>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">{children}</div>
      </div>
    </main>
  );
}
