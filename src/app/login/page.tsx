import type { Metadata } from "next";
import Link from "next/link";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Logo } from "@/components/landing/logo";
import { LoginButton } from "./login-button";

export const metadata: Metadata = {
  title: "Вход — IzzyKeep",
  description: "Войдите в IzzyKeep через Google, чтобы вести склад и продажи.",
};

export default function LoginPage() {
  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-5 py-16">
      <Atmosphere variant="auth" />

      <div className="w-full max-w-sm">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2" aria-label="IzzyKeep — на главную">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight">IzzyKeep</span>
        </Link>

        <div className="glass mt-8 rounded-2xl p-7">
          <h1 className="text-center font-display text-2xl font-bold tracking-tight">
            Вход в IzzyKeep
          </h1>
          <p className="mt-2 text-center text-sm text-izzy-muted">
            Войдите через Google, чтобы продолжить.
          </p>

          <LoginButton />

          <p className="mt-5 text-center text-xs leading-relaxed text-izzy-muted">
            Продолжая, вы соглашаетесь с{" "}
            <Link href="#" className="text-izzy-steel underline-offset-2 hover:underline">
              офертой
            </Link>{" "}
            и{" "}
            <Link href="#" className="text-izzy-steel underline-offset-2 hover:underline">
              политикой конфиденциальности
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-izzy-muted">
          Нет аккаунта? Он создастся автоматически при первом входе.
        </p>
      </div>
    </main>
  );
}
