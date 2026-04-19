import { MarketingBackdrop } from "@/frontend/components/layout/marketing-backdrop";
import { SiteFooter } from "@/frontend/components/layout/site-footer";
import { SiteHeader } from "@/frontend/components/layout/site-header";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative isolate">
      <MarketingBackdrop />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
