import { Reveal } from "@/components/landing/reveal";

const FEATURES = [
  {
    code: "remaining = qty − sales",
    title: "Остаток без ручного счёта",
    text: "Количество в лоте не меняется. Остаток всегда точный — система вычитает продажи сама.",
  },
  {
    code: "shared lots",
    title: "Общие лоты для команды",
    text: "Несколько продавцов — один склад и общие данные. Каждый видит актуальный остаток.",
  },
  {
    code: "margin · profit",
    title: "Прибыль и маржа",
    text: "Курс, себестоимость и наценка считаются за вас. Видно, сколько заработал каждый лот.",
  },
  {
    code: "sold history",
    title: "История продаж",
    text: "Кто, что и когда продал — на вкладке «Продано». Спор о цифрах закрыт.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-izzy-hairline/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-wider text-izzy-steel">
            Возможности
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Всё, что нужно для учёта запчастей.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.08}>
              <div className="group h-full rounded-2xl border border-izzy-hairline bg-izzy-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-izzy-brand/40 hover:shadow-premium">
                <span className="inline-block rounded-md bg-izzy-surface-2 px-2.5 py-1 font-data text-xs text-izzy-steel">
                  {f.code}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-izzy-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
