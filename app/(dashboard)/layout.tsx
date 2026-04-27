import { DashboardHeader } from "@/frontend/components/layout/dashboard-header";
import { DashboardSidebar } from "@/frontend/components/layout/dashboard-sidebar";
import { ChatbotDock } from "@/frontend/components/shared/chatbot-dock";
import { requireAuthenticatedUser } from "@/backend/auth/guards";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuthenticatedUser();
  const assistant = user.role === "user" ? "alexa" : "alex";

  return (
    <main className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar user={user} />
        <div className="min-w-0 space-y-6">
          <DashboardHeader user={user} />
          {children}
        </div>
      </div>
      <ChatbotDock
        assistant={assistant}
        userName={user.name}
        userAvatar={user.avatar}
      />
    </main>
  );
}
