import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Logo } from "@/components/landing/logo";
import { CompleteProfileForm } from "./form";

export const metadata: Metadata = {
  title: "Завершите профиль — IzzyKeep",
};

export default async function CompleteProfilePage() {
  const user = await getCurrentUser();
  if (user.profileDone) redirect("/app");

  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-5 py-16">
      <Atmosphere variant="auth" />

      <div className="w-full max-w-sm">
        <div className="mx-auto flex w-fit items-center gap-2">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
        </div>

        <div className="glass mt-8 rounded-2xl p-7">
          <h1 className="font-display text-2xl font-bold tracking-tight">Почти готово</h1>
          <p className="mt-2 text-sm text-izzy-muted">
            Как вас зовут? Имя увидят коллеги в общих лотах. Телефон — по желанию.
          </p>
          <CompleteProfileForm defaultName={user.name} />
        </div>

        <p className="mt-6 text-center font-data text-xs text-izzy-muted">
          Ваш ID: #{user.userCode}
        </p>
      </div>
    </main>
  );
}
