import type { Metadata } from "next";
import Link from "next/link";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Logo } from "@/components/landing/logo";

export const metadata: Metadata = {
  title: "Вход — IzzyKeep",
  description: "Войдите в IzzyKeep через Google, чтобы вести склад и продажи.",
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

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

          <button
            type="button"
            className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-white/90"
          >
            <GoogleMark />
            Продолжить с Google
          </button>

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
