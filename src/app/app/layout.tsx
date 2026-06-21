import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export const metadata: Metadata = {
  title: "IzzyKeep — приложение",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const light = cookieStore.get("izzy-theme")?.value === "light";
  const user = await getCurrentUser();

  return (
    <div
      id="app-root"
      className={`${light ? "theme-light " : ""}flex min-h-screen bg-izzy-bg text-izzy-text`}
    >
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
