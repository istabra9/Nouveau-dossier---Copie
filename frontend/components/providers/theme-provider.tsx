"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { ThemePreference } from "@/frontend/types";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const storageKey = "advancia-theme";
const defaultTheme: ThemePreference = "light";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemePreference) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function subscribe() {
  return () => {};
}

function getDomTheme(): ThemePreference {
  const attr = document.documentElement.dataset.theme;
  return attr === "dark" || attr === "light" ? attr : defaultTheme;
}

function getServerTheme(): ThemePreference {
  return defaultTheme;
}

export function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const domTheme = useSyncExternalStore(subscribe, getDomTheme, getServerTheme);
  const [override, setOverride] = useState<ThemePreference | null>(null);
  const theme = override ?? domTheme;

  useEffect(() => {
    if (override === null) {
      return;
    }
    applyTheme(override);
    try {
      window.localStorage.setItem(storageKey, override);
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [override]);

  const setTheme = useCallback((next: ThemePreference) => {
    setOverride(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return (
    useContext(ThemeContext) ?? {
      theme: defaultTheme,
      setTheme: () => undefined,
    }
  );
}
