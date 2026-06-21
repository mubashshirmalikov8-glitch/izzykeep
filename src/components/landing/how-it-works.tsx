import { Reveal } from "@/components/landing/reveal";

// A real sequence — numbering carries order the reader needs.
const STEPS = [
  {
    n: "01",
    title: "Создайте лот",
    text: "Заведите партию запчастей с валютой, курсом и наценкой.",
  },
  {
    n: "02",
    title: "Добавьте позиции",
    text: "OEM, деталь, авто, количество и себестоимость — по каждой запчасти.",
  },
  {
    n: "03",
    title: "Отмечайте продажи",
    text: "Остаток считается сам: количество минус продажи. Никаких пересчётов.",
  },
  {
    n: "04",
    title: "Видите прибыль",
    text: "Маржа и прибыль по каждому лоту — в реальном времени.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-izzy-hairline/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-wider text-izzy-steel">
            Как это работает
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            От партии до прибыли — четыре шага.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <li className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-data text-sm font-semibold text-izzy-accent">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-izzy-hairline" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-izzy-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
