import { Reveal } from "@/components/landing/reveal";

const LOTS = [
  { id: "LOT-7F3A21", value: "$4 120", w: "92%" },
  { id: "LOT-3B81C0", value: "$3 060", w: "68%" },
  { id: "LOT-9D44E7", value: "$2 740", w: "61%" },
  { id: "LOT-1A20F5", value: "$2 560", w: "57%" },
];

export function ProfitClarity() {
  return (
    <section className="border-t border-izzy-hairline/60">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <p className="font-data text-xs uppercase tracking-wider text-izzy-steel">
            Прибыль
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Не «кажется заработали».
            <br />
            Видно, сколько.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-izzy-muted">
            IzzyKeep сводит продажи, себестоимость и наценку в одну цифру по
            каждому лоту. Прибыль за месяц — на главном экране.
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="whitespace-nowrap font-data text-4xl font-bold tabular-nums text-izzy-profit sm:text-5xl">
              $12 480
            </span>
            <span className="text-sm text-izzy-muted">прибыль за месяц</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-izzy-text">Прибыль по лотам</span>
              <span className="font-data text-xs text-izzy-muted">июнь</span>
            </div>
            <div className="mt-6 flex flex-col gap-5">
              {LOTS.map((l) => (
                <div key={l.id}>
                  <div className="flex items-center justify-between">
                    <span className="font-data text-xs text-izzy-steel">{l.id}</span>
                    <span className="font-data text-xs font-semibold text-izzy-text">
                      {l.value}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-izzy-surface-2">
                    <div
                      className="h-full rounded-full bg-izzy-profit"
                      style={{ width: l.w }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
