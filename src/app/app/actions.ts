"use server";

import { revalidatePath } from "next/cache";
import { DB_READY } from "@/lib/db-ready";
import { getCurrentUser } from "@/lib/auth";

export type ActionResult = { ok: boolean; message: string };

const NO_DB: ActionResult = {
  ok: false,
  message:
    "База данных не подключена. Добавьте DATABASE_URL и примените миграцию, чтобы сохранять данные.",
};

function genCode(prefix: string): string {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

export async function createLot(
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;

  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Введите название лота." };
  const currency = String(fd.get("currency") ?? "USD");
  const rate = Number(fd.get("rate") ?? 1) || 1;
  const margin = Number(fd.get("margin") ?? 0) || 0;

  const user = await getCurrentUser();
  const { prisma } = await import("@/lib/prisma");
  await prisma.lot.create({
    data: { code: genCode("LOT"), name, currency, rate, margin, creatorId: user.id, ownerId: user.id },
  });

  revalidatePath("/app/lots");
  revalidatePath("/app");
  return { ok: true, message: `Лот «${name}» создан.` };
}

export async function addItem(
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;

  const lotId = String(fd.get("lotId") ?? "");
  const partName = String(fd.get("partName") ?? "").trim();
  if (!lotId) return { ok: false, message: "Выберите лот." };
  if (!partName) return { ok: false, message: "Введите название запчасти." };
  const qty = parseInt(String(fd.get("qty") ?? "0"), 10);
  if (!(qty > 0)) return { ok: false, message: "Количество должно быть больше 0." };
  const costUsd = Number(fd.get("costUsd") ?? 0) || 0;
  const salePrice = Number(fd.get("salePrice") ?? 0) || 0;
  const carName = String(fd.get("carName") ?? "").trim() || null;
  const oem = String(fd.get("oem") ?? "").trim() || null;

  const user = await getCurrentUser();
  const { prisma } = await import("@/lib/prisma");
  const lot = await prisma.lot.findFirst({ where: { id: lotId, ownerId: user.id } });
  if (!lot) return { ok: false, message: "Лот не найден." };

  await prisma.warehouseItem.create({
    data: { code: genCode("ITEM"), lotId, partName, carName, oem, qty, costUsd, salePrice, margin: lot.margin },
  });

  revalidatePath("/app");
  revalidatePath("/app/lots");
  return { ok: true, message: `Позиция «${partName}» добавлена.` };
}

export async function recordSale(
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;

  const itemId = String(fd.get("itemId") ?? "");
  const qty = parseInt(String(fd.get("qty") ?? "0"), 10);
  const inputPrice = Number(fd.get("salePrice") ?? 0) || 0;
  if (!itemId) return { ok: false, message: "Позиция не выбрана." };
  if (!(qty > 0)) return { ok: false, message: "Количество должно быть больше 0." };

  const user = await getCurrentUser();
  const { prisma } = await import("@/lib/prisma");
  const item = await prisma.warehouseItem.findFirst({
    where: { id: itemId, lot: { ownerId: user.id } },
    include: { sales: true },
  });
  if (!item) return { ok: false, message: "Позиция не найдена." };

  const sold = item.sales.reduce((a, s) => a + s.qty, 0);
  const remaining = item.qty - sold;
  if (qty > remaining) return { ok: false, message: `Недостаточно остатка. Доступно: ${remaining}.` };

  const price = inputPrice > 0 ? inputPrice : Number(item.salePrice);
  await prisma.sale.create({
    data: {
      itemId,
      lotId: item.lotId,
      ownerId: user.id,
      qty,
      salePrice: price,
      total: price * qty,
      seller: user.name,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/sold");
  return { ok: true, message: "Продажа записана." };
}
