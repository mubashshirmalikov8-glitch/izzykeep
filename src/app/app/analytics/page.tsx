import { PageHeader } from "@/components/app/page-header";
import { DemoNotice } from "@/components/app/demo-notice";
import { BarList } from "@/components/app/analytics/bar-list";
import { SalesTrend } from "@/components/app/analytics/sales-trend";
import { AbcTable } from "@/components/app/analytics/abc-table";
import { ForecastTable } from "@/components/app/analytics/forecast-table";
import { LowStock } from "@/components/app/analytics/low-stock";
import { SlowMoving } from "@/components/app/analytics/slow-moving";
import { getAnalytics } from "@/lib/queries/analytics";
import { DB_READY } from "@/lib/db-ready";

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-izzy-hairline bg-izzy-surface p-6 ${className ?? ""}`}>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-izzy-steel">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function AnalyticsPage() {
  const a = await getAnalytics();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader title="Аналитика" subtitle="Продажи, прибыль, запасы и прогноз" />
      {!DB_READY && <DemoNotice />}

      <Card title="Продажи по дням">
        <SalesTrend points={a.salesByDay} currency={a.currency} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Топ продаж">
          <BarList items={a.topSelling} color="bg-izzy-brand" />
        </Card>
        <Card title="Прибыль по товарам">
          <BarList items={a.profitByProduct} color="bg-izzy-profit" />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Прибыль по лотам">
          <BarList items={a.profitByLot} color="bg-izzy-profit" />
        </Card>
        <Card title="ABC-анализ">
          <AbcTable rows={a.abc} currency={a.currency} />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Прогноз запасов">
          <ForecastTable rows={a.forecast} />
        </Card>
        <Card title="Низкий остаток">
          <LowStock rows={a.lowStock} />
        </Card>
      </div>

      <Card title="Залежавшиеся товары">
        <SlowMoving rows={a.slowMoving} />
      </Card>
    </div>
  );
}
