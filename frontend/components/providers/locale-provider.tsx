"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import type { AppLocale } from "@/frontend/types";

import { defaultLocale, localeCookieName, localeMeta } from "@/frontend/i18n/config";
import { getMessages } from "@/frontend/i18n/messages";

type LocaleContextValue = {
  locale: AppLocale;
  direction: "ltr" | "rtl";
  messages: ReturnType<typeof getMessages>;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: Readonly<{
  initialLocale: AppLocale;
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].direction;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: localeMeta[locale].direction,
      messages: getMessages(locale),
      setLocale(nextLocale) {
        if (nextLocale === locale) {
          return;
        }

        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        setLocaleState(nextLocale);
        startTransition(() => {
          router.refresh();
        });
      },
    }),
    [locale, router],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    return {
      locale: defaultLocale,
      direction: localeMeta[defaultLocale].direction,
      messages: getMessages(defaultLocale),
      setLocale: () => undefined,
    } satisfies LocaleContextValue;
  }

  return context;
}
