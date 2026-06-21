import Link from "next/link";
import { LedgerDemo } from "@/components/landing/ledger-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient: blueprint grid + violet glow, hero only */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blueprint-grid absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-12rem] size-[40rem] -translate-x-1/2 rounded-full bg-izzy-brand/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-32 lg:pt-24">
        {/* thesis */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-izzy-hairline bg-izzy-surface px-3 py-1 font-data text-xs text-izzy-steel">
            <span className="size-1.5 rounded-full bg-izzy-profit" />
            Складской учёт автозапчастей
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Запчасти под контролем.
            <br />
            <span className="text-izzy-profit">Прибыль</span> — на виду.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-izzy-muted">
            IzzyKeep ведёт склад, лоты и продажи автозапчастей и сам считает
            остатки и прибыль. Без таблиц и путаницы.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-izzy-brand-strong px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep"
            >
              Начать бесплатно
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-lg border border-izzy-hairline px-5 py-3 text-sm font-medium text-izzy-text transition-colors hover:bg-izzy-surface"
            >
              Как это работает
            </a>
          </div>

          <p className="mt-5 font-data text-xs text-izzy-muted">
            Бесплатный тариф · без карты · запуск за 2 минуты
          </p>
        </div>

        {/* signature */}
        <div className="lg:pl-4">
          <LedgerDemo />
        </div>
      </div>
    </section>
  );
}
