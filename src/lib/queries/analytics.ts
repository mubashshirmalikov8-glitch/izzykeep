import "server-only";
import type { AnalyticsData } from "../types";
import { money } from "../format";
import { DB_READY } from "../db-ready";
import { getCurrentUser } from "../auth";
import { MOCK_ITEMS, MOCK_LOTS, MOCK_SALES } from "../mock-data";

type ItemN = { id: string; code: string; partName: string; lotId: string; lotCode: string; qty: number; cost: number };
type SaleN = { itemId: string; lotId: string; qty: number; price: number; total: number; soldAt: string };
type LotN = { id: string; code: string; name: string };

const DAY = 86_400_000;

function compute(items: ItemN[], sales: SaleN[], lots: LotN[], currency: string): AnalyticsData {
  const itemById = new Map(items.map((i) => [i.id, i]));
  const lotById = new Map(lots.map((l) => [l.id, l]));

  const now = Date.now();
  const times = sales.map((s) => Date.parse(s.soldAt)).filter((n) => !Number.isNaN(n));
  const windowDays = Math.max(1, (now - (times.length ? Math.min(...times) : now)) / DAY);

  // per-item aggregates
  const agg = new Map<string, { sold: number; revenue: number; profit: number }>();
  for (const s of sales) {
    const cost = itemById.get(s.itemId)?.cost ?? 0;
    const a = agg.get(s.itemId) ?? { sold: 0, revenue: 0, profit: 0 };
    a.sold += s.qty;
    a.revenue += s.total;
    a.profit += (s.price - cost) * s.qty;
    agg.set(s.itemId, a);
  }

  const rows = items.map((it) => {
    const a = agg.get(it.id) ?? { sold: 0, revenue: 0, profit: 0 };
    const remaining = it.qty - a.sold;
    const perDay = a.sold / windowDays;
    const daysOfCover = perDay > 0 ? remaining / perDay : null;
    const sellThrough = it.qty > 0 ? (a.sold / it.qty) * 100 : 0;
    return { ...it, ...a, remaining, perDay, daysOfCover, sellThrough };
  });

  // sales by day (units + revenue)
  const byDay = new Map<string, { units: number; revenue: number }>();
  for (const s of sales) {
    const d = s.soldAt.slice(0, 10);
    const e = byDay.get(d) ?? { units: 0, revenue: 0 };
    e.units += s.qty;
    e.revenue += s.total;
    byDay.set(d, e);
  }
  const salesByDay = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, units: v.units, revenue: v.revenue }));

  const topSelling = rows
    .filter((r) => r.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6)
    .map((r) => ({ label: r.partName, value: r.sold, display: `${r.sold} шт` }));

  const profitByProduct = rows
    .filter((r) => r.profit !== 0)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 6)
    .map((r) => ({ label: r.partName, value: r.profit, display: money(r.profit, currency) }));

  const lotAgg = new Map<string, number>();
  for (const r of rows) lotAgg.set(r.lotId, (lotAgg.get(r.lotId) ?? 0) + r.profit);
  const profitByLot = [...lotAgg.entries()]
    .map(([lotId, profit]) => ({ label: lotById.get(lotId)?.code ?? lotId, value: profit, display: money(profit, currency) }))
    .sort((a, b) => b.value - a.value);

  // ABC by revenue contribution
  const totalRev = rows.reduce((a, r) => a + r.revenue, 0);
  const sortedByRev = [...rows].sort((a, b) => b.revenue - a.revenue);
  let cum = 0;
  const abc = sortedByRev.map((r) => {
    const share = totalRev > 0 ? (r.revenue / totalRev) * 100 : 0;
    cum += share;
    const cls = cum <= 80 ? "A" : cum <= 95 ? "B" : "C";
    return { code: r.code, name: r.partName, revenue: r.revenue, share, cumulative: cum, cls: cls as "A" | "B" | "C" };
  });

  const forecast = rows
    .filter((r) => r.remaining > 0)
    .sort((a, b) => (a.daysOfCover ?? Infinity) - (b.daysOfCover ?? Infinity))
    .slice(0, 10)
    .map((r) => ({
      code: r.code,
      name: r.partName,
      remaining: r.remaining,
      perDay: r.perDay,
      daysOfCover: r.daysOfCover,
      eta: r.daysOfCover != null ? new Date(now + r.daysOfCover * DAY).toISOString() : null,
    }));

  const lowStock = rows
    .filter((r) => r.remaining <= 3 || (r.daysOfCover != null && r.daysOfCover < 7))
    .sort((a, b) => a.remaining - b.remaining)
    .map((r) => ({
      code: r.code,
      name: r.partName,
      remaining: r.remaining,
      daysOfCover: r.daysOfCover,
      reason:
        r.remaining <= 3
          ? `осталось ${r.remaining}`
          : `~${Math.round(r.daysOfCover ?? 0)} дн. до конца`,
    }));

  const slowMoving = rows
    .filter((r) => r.remaining > 0)
    .sort((a, b) => a.sellThrough - b.sellThrough)
    .slice(0, 6)
    .map((r) => ({ code: r.code, name: r.partName, sold: r.sold, remaining: r.remaining, sellThrough: r.sellThrough }));

  return { currency, salesByDay, topSelling, profitByProduct, profitByLot, abc, forecast, lowStock, slowMoving };
}

export async function getAnalytics(ownerId?: string): Promise<AnalyticsData> {
  if (!DB_READY) {
    const lotByIdMock = new Map(MOCK_LOTS.map((l) => [l.id, l]));
    const items: ItemN[] = MOCK_ITEMS.map((i) => ({
      id: i.id,
      code: i.code,
      partName: i.partName,
      lotId: i.lotId,
      lotCode: lotByIdMock.get(i.lotId)?.code ?? i.lotId,
      qty: i.qty,
      cost: i.costUsd,
    }));
    const sales: SaleN[] = MOCK_SALES.map((s) => ({
      itemId: s.itemId,
      lotId: s.lotId,
      qty: s.qty,
      price: s.salePrice,
      total: s.qty * s.salePrice,
      soldAt: s.soldAt,
    }));
    const lots: LotN[] = MOCK_LOTS.map((l) => ({ id: l.id, code: l.code, name: l.name }));
    return compute(items, sales, lots, MOCK_LOTS[0]?.currency ?? "USD");
  }

  const owner = ownerId ?? (await getCurrentUser()).id;
  const { prisma } = await import("../prisma");
  const lots = await prisma.lot.findMany({
    where: { ownerId: owner },
    include: { items: { include: { sales: true } } },
  });

  const itemsN: ItemN[] = lots.flatMap((l) =>
    l.items.map((i) => ({
      id: i.id,
      code: i.code,
      partName: i.partName,
      lotId: i.lotId,
      lotCode: l.code,
      qty: i.qty,
      cost: Number(i.costUsd),
    })),
  );
  const salesN: SaleN[] = lots.flatMap((l) =>
    l.items.flatMap((i) =>
      i.sales.map((s) => ({
        itemId: s.itemId,
        lotId: s.lotId,
        qty: s.qty,
        price: Number(s.salePrice),
        total: Number(s.total),
        soldAt: s.soldAt.toISOString(),
      })),
    ),
  );
  const lotsN: LotN[] = lots.map((l) => ({ id: l.id, code: l.code, name: l.name }));
  return compute(itemsN, salesN, lotsN, lots[0]?.currency ?? "USD");
}
