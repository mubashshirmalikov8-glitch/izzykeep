import { Reveal } from "@/components/landing/reveal";

const TRUTHS = [
  {
    tag: "склад",
    text: "Остатки — в голове и в трёх таблицах сразу. Что реально есть на полке, никто не знает.",
  },
  {
    tag: "прибыль",
    text: "Сколько заработали с лота — непонятно. Себестоимость, курс и наценка считаются вручную.",
  },
  {
    tag: "команда",
    text: "Один продавец отгрузил, второй не в курсе. Двойные продажи и спор о цифрах.",
  },
];

export function Problem() {
  return (
    <section className="border-t border-izzy-hairline/60">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-wider text-izzy-steel">
            Знакомо?
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Запчасти продаются. Учёт — нет.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-izzy-hairline bg-izzy-hairline sm:grid-cols-3">
          {TRUTHS.map((t, i) => (
            <Reveal key={t.tag} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col gap-4 bg-izzy-surface p-7">
                <span className="font-data text-xs uppercase tracking-wider text-izzy-muted">
                  {t.tag}
                </span>
                <p className="text-[15px] leading-relaxed text-izzy-text">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
