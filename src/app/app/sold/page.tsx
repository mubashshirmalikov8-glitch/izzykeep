import { PageHeader } from "@/components/app/page-header";
import { WarehouseTabs } from "@/components/app/warehouse-tabs";
import { DemoNotice } from "@/components/app/demo-notice";
import { getSoldRows } from "@/lib/queries/warehouse";
import { DB_READY } from "@/lib/db-ready";
import { money, shortDate } from "@/lib/format";

export default async function SoldPage() {
  const sales = await getSoldRows();
  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const currency = sales[0]?.currency ?? "USD";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Проданно"
        subtitle={`${sales.length} продаж · оборот ${money(revenue, currency)}`}
      />
      {!DB_READY && <DemoNotice />}
      <WarehouseTabs />

      <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface">
        {sales.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-izzy-muted">Продаж пока нет.</p>
        ) : (
          <ul>
            {sales.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-4 border-b border-izzy-hairline/60 px-4 py-3 last:border-0"
              >
                <span className="w-24 shrink-0 font-data text-xs text-izzy-muted">
                  {shortDate(s.soldAt)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-izzy-text">{s.partName}</div>
                  <div className="font-data text-xs text-izzy-muted">
                    {s.itemCode} · {s.lotCode}
                  </div>
                </div>
                <span className="hidden w-24 truncate text-right text-xs text-izzy-muted sm:block">
                  {s.seller ?? "—"}
                </span>
                <span className="w-20 text-right font-data text-sm tabular-nums text-izzy-text">
                  {s.qty} × {money(s.salePrice, s.currency)}
                </span>
                <span className="w-24 text-right font-data text-sm font-semibold tabular-nums text-izzy-profit">
                  {money(s.total, s.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
