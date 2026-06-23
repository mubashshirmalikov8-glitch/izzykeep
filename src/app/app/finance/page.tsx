import { PageHeader } from "@/components/app/page-header";
import { DemoNotice } from "@/components/app/demo-notice";
import { KpiCard } from "@/components/app/finance/kpi-card";
import { RevenueChart } from "@/components/app/finance/revenue-chart";
import { ProfitByLot } from "@/components/app/finance/profit-by-lot";
import { getFinanceSummary } from "@/lib/queries/finance";
import { DB_READY } from "@/lib/db-ready";
import { money } from "@/lib/format";

export default async function FinancePage() {
  const f = await getFinanceSummary();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Финансы"
        subtitle={`Выручка ${money(f.revenue, f.currency)} · прибыль ${money(f.profit, f.currency)}`}
      />
      {!DB_READY && <DemoNotice />}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Выручка" value={money(f.revenue, f.currency)} />
        <KpiCard label="Прибыль" value={money(f.profit, f.currency)} accent="profit" />
        <KpiCard
          label="ROI"
          value={`${f.roi.toFixed(1)}%`}
          accent={f.roi >= 0 ? "profit" : "danger"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Инвестиции" value={money(f.investments, f.currency)} />
        <KpiCard label="Средний чек" value={money(f.aov, f.currency)} />
        <KpiCard label="Лотов" value={String(f.lotsCount)} />
        <KpiCard label="Позиций" value={String(f.productsCount)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-izzy-steel">
            Выручка по дням
          </h2>
          <div className="mt-4">
            <RevenueChart points={f.revenueByDay} currency={f.currency} />
          </div>
        </section>

        <section className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-izzy-steel">
            Прибыль по лотам
          </h2>
          <div className="mt-5">
            <ProfitByLot lots={f.profitByLot} currency={f.currency} />
          </div>
        </section>
      </div>
    </div>
  );
}
