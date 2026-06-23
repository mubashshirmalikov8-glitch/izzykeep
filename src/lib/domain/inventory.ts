import "server-only";
import { prisma } from "@/lib/prisma";

// Owner-scoped inventory mutations + lookups. Shared by the web server actions
// (session user) and the Telegram bot (linked user). Single source of truth.

export type DomainResult = { ok: boolean; message: string };

function genCode(prefix: string): string {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

export async function createLot(input: {
  ownerId: string;
  name: string;
  currency?: string;
  rate?: number;
  margin?: number;
}): Promise<DomainResult & { lotId?: string; lotCode?: string }> {
  const name = input.name.trim();
  if (!name) return { ok: false, message: "Введите название лота." };
  const lot = await prisma.lot.create({
    data: {
      code: genCode("LOT"),
      name,
      currency: input.currency || "USD",
      rate: input.rate ?? 1,
      margin: input.margin ?? 0,
      creatorId: input.ownerId,
      ownerId: input.ownerId,
    },
  });
  return { ok: true, message: `Лот «${name}» создан (${lot.code}).`, lotId: lot.id, lotCode: lot.code };
}

export async function findLot(ownerId: string, ref: string) {
  const r = ref.trim();
  if (!r) return null;
  return prisma.lot.findFirst({
    where: { ownerId, OR: [{ id: r }, { code: { equals: r, mode: "insensitive" } }] },
  });
}

export async function addItem(input: {
  ownerId: string;
  lotId: string;
  partName: string;
  carName?: string | null;
  oem?: string | null;
  qty: number;
  costUsd?: number;
  salePrice?: number;
}): Promise<DomainResult & { itemId?: string; itemCode?: string }> {
  const partName = input.partName.trim();
  if (!partName) return { ok: false, message: "Введите название запчасти." };
  if (!(input.qty > 0)) return { ok: false, message: "Количество должно быть больше 0." };
  const lot = await prisma.lot.findFirst({ where: { id: input.lotId, ownerId: input.ownerId } });
  if (!lot) return { ok: false, message: "Лот не найден." };
  const item = await prisma.warehouseItem.create({
    data: {
      code: genCode("ITEM"),
      lotId: lot.id,
      partName,
      carName: input.carName || null,
      oem: input.oem || null,
      qty: input.qty,
      costUsd: input.costUsd ?? 0,
      salePrice: input.salePrice ?? 0,
      margin: lot.margin,
    },
  });
  return { ok: true, message: `Позиция «${partName}» добавлена (${item.code}).`, itemId: item.id, itemCode: item.code };
}

export async function findItem(ownerId: string, ref: string) {
  const r = ref.trim();
  if (!r) return null;
  return prisma.warehouseItem.findFirst({
    where: { lot: { ownerId }, OR: [{ id: r }, { code: { equals: r, mode: "insensitive" } }] },
    include: { sales: true },
  });
}

export async function recordSale(input: {
  ownerId: string;
  itemId: string;
  qty: number;
  salePrice?: number;
  seller?: string | null;
}): Promise<DomainResult> {
  if (!(input.qty > 0)) return { ok: false, message: "Количество должно быть больше 0." };
  const item = await prisma.warehouseItem.findFirst({
    where: { id: input.itemId, lot: { ownerId: input.ownerId } },
    include: { sales: true },
  });
  if (!item) return { ok: false, message: "Позиция не найдена." };
  const sold = item.sales.reduce((a, s) => a + s.qty, 0);
  const remaining = item.qty - sold;
  if (input.qty > remaining) return { ok: false, message: `Недостаточно остатка. Доступно: ${remaining}.` };
  const price = input.salePrice && input.salePrice > 0 ? input.salePrice : Number(item.salePrice);
  await prisma.sale.create({
    data: {
      itemId: item.id,
      lotId: item.lotId,
      ownerId: input.ownerId,
      qty: input.qty,
      salePrice: price,
      total: price * input.qty,
      seller: input.seller ?? null,
    },
  });
  return { ok: true, message: `Продажа записана: ${item.partName} ×${input.qty}.` };
}
