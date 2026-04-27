import { MarketingBackdrop } from "@/frontend/components/layout/marketing-backdrop";
import { SiteFooter } from "@/frontend/components/layout/site-footer";
import { SiteHeader } from "@/frontend/components/layout/site-header";
import { ChatbotDock } from "@/frontend/components/shared/chatbot-dock";
import { getCurrentUser } from "@/backend/auth/session";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const assistant = user?.role === "user" || !user ? "alexa" : "alex";

  return (
    <div className="relative isolate">
      <MarketingBackdrop />
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ChatbotDock
        assistant={assistant}
        userName={user?.name}
        userAvatar={user?.avatar}
      />
    </div>
  );
}
