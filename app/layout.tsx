import type { Metadata } from "next";
import { Cairo, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { LocaleProvider } from "@/frontend/components/providers/locale-provider";
import { ThemeProvider } from "@/frontend/components/providers/theme-provider";
import { getCurrentLocale, getLocaleDirection } from "@/frontend/i18n/server";

import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const arabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Advancia Trainings",
    template: "%s | Advancia Trainings",
  },
  description:
    "Cheerful training platform for discovery, enrollments, guided learning journeys, analytics, and operational reporting.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      data-theme="light"
      suppressHydrationWarning
      style={{ colorScheme: "light" }}
      className={`${display.variable} ${body.variable} ${mono.variable} ${arabic.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('advancia-theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <LocaleProvider initialLocale={locale}>
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">{children}</div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
