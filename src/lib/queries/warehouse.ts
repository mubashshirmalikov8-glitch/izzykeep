import "server-only";
import type { LotRow, SaleRow, WarehouseRow } from "../types";
import { DB_READY } from "../db-ready";
import { getCurrentUser } from "../auth";
import { MOCK_ITEMS, MOCK_LOTS, MOCK_SALES } from "../mock-data";

// Each function has two paths: mock (no DB yet) and live Prisma (DATABASE_URL set).
// The core invariant — remaining = qty − Σ(sales.qty) — is identical in both.

export async function getWarehouseRows(ownerId?: string): Promise<WarehouseRow[]> {
  if (!DB_READY) {
    return MOCK_ITEMS.map((it) => {
      const lot = MOCK_LOTS.find((l) => l.id === it.lotId)!;
      const sold = MOCK_SALES.filter((s) => s.itemId === it.id).reduce((a, s) => a + s.qty, 0);
      return {
        id: it.id,
        code: it.code,
        partName: it.partName,
        carName: it.carName,
        oem: it.oem,
        unit: it.unit,
        qty: it.qty,
        sold,
        remaining: it.qty - sold,
        costUsd: it.costUsd,
        salePrice: it.salePrice,
        currency: lot.currency,
        lotCode: lot.code,
      };
    });
  }

  const owner = ownerId ?? (await getCurrentUser()).id;
  const { prisma } = await import("../prisma");
  const items = await prisma.warehouseItem.findMany({
    where: { lot: { ownerId: owner } },
    include: { lot: true, sales: true },
    orderBy: { createdAt: "desc" },
  });
  return items.map((it) => {
    const sold = it.sales.reduce((a, s) => a + s.qty, 0);
    return {
      id: it.id,
      code: it.code,
      partName: it.partName,
      carName: it.carName,
      oem: it.oem,
      unit: it.unit,
      qty: it.qty,
      sold,
      remaining: it.qty - sold,
      costUsd: Number(it.costUsd),
      salePrice: Number(it.salePrice),
      currency: it.lot.currency,
      lotCode: it.lot.code,
    };
  });
}

export async function getSoldRows(): Promise<SaleRow[]> {
  if (!DB_READY) {
    return MOCK_SALES.map((s) => {
      const item = MOCK_ITEMS.find((i) => i.id === s.itemId)!;
      const lot = MOCK_LOTS.find((l) => l.id === s.lotId)!;
      return {
        id: s.id,
        soldAt: s.soldAt,
        itemCode: item.code,
        partName: item.partName,
        lotCode: lot.code,
        qty: s.qty,
        salePrice: s.salePrice,
        total: s.qty * s.salePrice,
        currency: lot.currency,
        seller: s.seller,
      };
    }).sort((a, b) => b.soldAt.localeCompare(a.soldAt));
  }

  const user = await getCurrentUser();
  const { prisma } = await import("../prisma");
  const sales = await prisma.sale.findMany({
    where: { ownerId: user.id },
    include: { item: true, lot: true },
    orderBy: { soldAt: "desc" },
  });
  return sales.map((s) => ({
    id: s.id,
    soldAt: s.soldAt.toISOString(),
    itemCode: s.item.code,
    partName: s.item.partName,
    lotCode: s.lot.code,
    qty: s.qty,
    salePrice: Number(s.salePrice),
    total: Number(s.total),
    currency: s.lot.currency,
    seller: s.seller,
  }));
}

export async function getLots(): Promise<LotRow[]> {
  if (!DB_READY) {
    return MOCK_LOTS.map((lot) => {
      const items = MOCK_ITEMS.filter((i) => i.lotId === lot.id);
      const sales = MOCK_SALES.filter((s) => s.lotId === lot.id);
      const soldUnits = sales.reduce((a, s) => a + s.qty, 0);
      const remainingUnits = items.reduce((a, i) => a + i.qty, 0) - soldUnits;
      const profit = sales.reduce((a, s) => {
        const item = items.find((i) => i.id === s.itemId);
        const cost = item ? item.costUsd : 0;
        return a + (s.salePrice - cost) * s.qty;
      }, 0);
      return {
        id: lot.id,
        code: lot.code,
        name: lot.name,
        currency: lot.currency,
        margin: lot.margin,
        itemCount: items.length,
        remainingUnits,
        soldUnits,
        profit,
      };
    });
  }

  const user = await getCurrentUser();
  const { prisma } = await import("../prisma");
  const lots = await prisma.lot.findMany({
    where: { ownerId: user.id },
    include: { items: { include: { sales: true } }, sales: true },
    orderBy: { createdAt: "desc" },
  });
  return lots.map((lot) => {
    const soldUnits = lot.sales.reduce((a, s) => a + s.qty, 0);
    const totalQty = lot.items.reduce((a, i) => a + i.qty, 0);
    const profit = lot.items.reduce(
      (a, it) => a + it.sales.reduce((b, s) => b + (Number(s.salePrice) - Number(it.costUsd)) * s.qty, 0),
      0,
    );
    return {
      id: lot.id,
      code: lot.code,
      name: lot.name,
      currency: lot.currency,
      margin: Number(lot.margin),
      itemCount: lot.items.length,
      remainingUnits: totalQty - soldUnits,
      soldUnits,
      profit,
    };
  });
}
