import Link from "next/link";
import { Reveal } from "@/components/landing/reveal";

const PLANS = [
  {
    name: "Старт",
    price: "0",
    note: "навсегда",
    features: ["1 лот", "Базовый склад", "1 пользователь"],
    cta: "Начать бесплатно",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    note: "в месяц",
    features: ["Безлимит лотов", "Команда продавцов", "Прибыль и аналитика", "История продаж"],
    cta: "Выбрать Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "$29",
    note: "в месяц",
    features: ["Несколько складов", "Роли и права", "Приоритетная поддержка"],
    cta: "Связаться",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-izzy-hairline/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-wider text-izzy-steel">
            Тарифы
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Начните бесплатно. Платите, когда вырастете.
          </h2>
        </Reveal>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium ${
                  p.featured
                    ? "border-izzy-brand bg-izzy-surface ring-1 ring-izzy-brand/40"
                    : "border-izzy-hairline bg-izzy-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">{p.name}</span>
                  {p.featured && (
                    <span className="rounded-full bg-izzy-brand/15 px-2.5 py-1 font-data text-[11px] uppercase tracking-wider text-izzy-accent">
                      популярный
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-data text-4xl font-bold tabular-nums">{p.price}</span>
                  <span className="text-sm text-izzy-muted">{p.note}</span>
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-izzy-text">
                      <span className="font-data text-izzy-profit">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    p.featured
                      ? "bg-izzy-brand-strong text-white hover:bg-izzy-brand-deep"
                      : "border border-izzy-hairline text-izzy-text hover:bg-izzy-surface-2"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
