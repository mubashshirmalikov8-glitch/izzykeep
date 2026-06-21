import { PageHeader } from "@/components/app/page-header";
import { WarehouseTabs } from "@/components/app/warehouse-tabs";
import { WarehouseTable } from "@/components/app/warehouse-table";
import { DemoNotice } from "@/components/app/demo-notice";
import { getWarehouseRows } from "@/lib/queries/warehouse";
import { DB_READY } from "@/lib/db-ready";

export default async function WarehousePage() {
  const rows = await getWarehouseRows();
  const totalRemaining = rows.reduce((a, r) => a + r.remaining, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Склад"
        subtitle={`${rows.length} позиций · ${totalRemaining} в остатке`}
      />
      {!DB_READY && <DemoNotice />}
      <WarehouseTabs />
      <WarehouseTable rows={rows} />
    </div>
  );
}
