import "server-only";
import type { FinanceSummary } from "../types";
import { DB_READY } from "../db-ready";
import { getCurrentUser } from "../auth";
import { MOCK_ITEMS, MOCK_LOTS, MOCK_SALES } from "../mock-data";

type LotN = { id: string; code: string; name: string; currency: string };
type ItemN = { id: string; lotId: string; qty: number; costUsd: number };
type SaleN = { itemId: string; lotId: string; qty: number; salePrice: number; total: number; soldAt: string };

// Pure aggregation shared by mock + live paths so both produce identical numbers.
function compute(lots: LotN[], items: ItemN[], sales: SaleN[]): FinanceSummary {
  const costByItem = new Map(items.map((i) => [i.id, i.costUsd]));
  const lotById = new Map(lots.map((l) => [l.id, l]));

  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const profit = sales.reduce(
    (a, s) => a + (s.salePrice - (costByItem.get(s.itemId) ?? 0)) * s.qty,
    0,
  );
  const investments = items.reduce((a, i) => a + i.qty * i.costUsd, 0);
  const salesCount = sales.length;
  const roi = investments > 0 ? (profit / investments) * 100 : 0;
  const aov = salesCount > 0 ? revenue / salesCount : 0;

  const byDay = new Map<string, number>();
  for (const s of sales) {
    const d = s.soldAt.slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + s.total);
  }
  const revenueByDay = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, rev]) => ({ date, revenue: rev }));

  const profByLot = new Map<string, number>();
  for (const s of sales) {
    const p = (s.salePrice - (costByItem.get(s.itemId) ?? 0)) * s.qty;
    profByLot.set(s.lotId, (profByLot.get(s.lotId) ?? 0) + p);
  }
  const profitByLot = [...profByLot.entries()]
    .map(([lotId, p]) => {
      const l = lotById.get(lotId);
      return { code: l?.code ?? lotId, name: l?.name ?? "—", profit: p };
    })
    .sort((a, b) => b.profit - a.profit);

  return {
    revenue,
    profit,
    investments,
    roi,
    lotsCount: lots.length,
    productsCount: items.length,
    salesCount,
    aov,
    currency: lots[0]?.currency ?? "USD",
    revenueByDay,
    profitByLot,
  };
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  if (!DB_READY) {
    const lots = MOCK_LOTS.map((l) => ({ id: l.id, code: l.code, name: l.name, currency: l.currency }));
    const items = MOCK_ITEMS.map((i) => ({ id: i.id, lotId: i.lotId, qty: i.qty, costUsd: i.costUsd }));
    const sales = MOCK_SALES.map((s) => ({
      itemId: s.itemId,
      lotId: s.lotId,
      qty: s.qty,
      salePrice: s.salePrice,
      total: s.qty * s.salePrice,
      soldAt: s.soldAt,
    }));
    return compute(lots, items, sales);
  }

  const user = await getCurrentUser();
  const { prisma } = await import("../prisma");
  const lots = await prisma.lot.findMany({
    where: { ownerId: user.id },
    include: { items: { include: { sales: true } } },
  });

  const lotsN: LotN[] = lots.map((l) => ({ id: l.id, code: l.code, name: l.name, currency: l.currency }));
  const itemsN: ItemN[] = lots.flatMap((l) =>
    l.items.map((i) => ({ id: i.id, lotId: i.lotId, qty: i.qty, costUsd: Number(i.costUsd) })),
  );
  const salesN: SaleN[] = lots.flatMap((l) =>
    l.items.flatMap((i) =>
      i.sales.map((s) => ({
        itemId: s.itemId,
        lotId: s.lotId,
        qty: s.qty,
        salePrice: Number(s.salePrice),
        total: Number(s.total),
        soldAt: s.soldAt.toISOString(),
      })),
    ),
  );

  return compute(lotsN, itemsN, salesN);
}
