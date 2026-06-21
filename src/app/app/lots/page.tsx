import { PageHeader } from "@/components/app/page-header";
import { DemoNotice } from "@/components/app/demo-notice";
import { CreateLotForm } from "@/components/app/create-lot-form";
import { AddItemForm } from "@/components/app/add-item-form";
import { getLots } from "@/lib/queries/warehouse";
import { DB_READY } from "@/lib/db-ready";
import { money } from "@/lib/format";

export default async function LotsPage() {
  const lots = await getLots();
  const lotOptions = lots.map((l) => ({ id: l.id, code: l.code, name: l.name }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Лот" subtitle={`${lots.length} лотов`} />
      {!DB_READY && <DemoNotice />}

      <div className="grid gap-5 lg:grid-cols-2">
        <CreateLotForm />
        <AddItemForm lots={lotOptions} />
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-izzy-steel">
          Лоты
        </h2>
        {lots.length === 0 ? (
          <p className="rounded-2xl border border-izzy-hairline bg-izzy-surface px-4 py-12 text-center text-sm text-izzy-muted">
            Лотов пока нет. Создайте первый выше.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lots.map((lot) => (
              <article
                key={lot.id}
                className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-semibold">{lot.name}</h3>
                    <p className="font-data text-xs text-izzy-steel">{lot.code}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-izzy-surface-2 px-2 py-1 font-data text-xs text-izzy-muted">
                    {lot.margin}%
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-izzy-hairline pt-4">
                  <Stat label="позиций" value={String(lot.itemCount)} />
                  <Stat label="остаток" value={String(lot.remainingUnits)} />
                  <Stat label="прибыль" value={money(lot.profit, lot.currency)} accent />
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">{label}</dt>
      <dd
        className={`mt-1 font-data text-sm font-semibold tabular-nums ${
          accent ? "text-izzy-profit" : "text-izzy-text"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
