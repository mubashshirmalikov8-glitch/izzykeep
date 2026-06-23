"use server";

import { revalidatePath } from "next/cache";
import { DB_READY } from "@/lib/db-ready";
import { getCurrentUser } from "@/lib/auth";
import * as inventory from "@/lib/domain/inventory";

export type ActionResult = { ok: boolean; message: string };

const NO_DB: ActionResult = {
  ok: false,
  message:
    "База данных не подключена. Добавьте DATABASE_URL и примените миграцию, чтобы сохранять данные.",
};

export async function createLot(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;
  const user = await getCurrentUser();
  const res = await inventory.createLot({
    ownerId: user.id,
    name: String(fd.get("name") ?? ""),
    currency: String(fd.get("currency") ?? "USD"),
    rate: Number(fd.get("rate") ?? 1) || 1,
    margin: Number(fd.get("margin") ?? 0) || 0,
  });
  if (res.ok) {
    revalidatePath("/app/lots");
    revalidatePath("/app");
  }
  return { ok: res.ok, message: res.message };
}

export async function addItem(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;
  const user = await getCurrentUser();
  const lotId = String(fd.get("lotId") ?? "");
  if (!lotId) return { ok: false, message: "Выберите лот." };
  const res = await inventory.addItem({
    ownerId: user.id,
    lotId,
    partName: String(fd.get("partName") ?? ""),
    carName: String(fd.get("carName") ?? "").trim() || null,
    oem: String(fd.get("oem") ?? "").trim() || null,
    qty: parseInt(String(fd.get("qty") ?? "0"), 10),
    costUsd: Number(fd.get("costUsd") ?? 0) || 0,
    salePrice: Number(fd.get("salePrice") ?? 0) || 0,
  });
  if (res.ok) {
    revalidatePath("/app");
    revalidatePath("/app/lots");
  }
  return { ok: res.ok, message: res.message };
}

export async function recordSale(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!DB_READY) return NO_DB;
  const user = await getCurrentUser();
  const itemId = String(fd.get("itemId") ?? "");
  if (!itemId) return { ok: false, message: "Позиция не выбрана." };
  const res = await inventory.recordSale({
    ownerId: user.id,
    itemId,
    qty: parseInt(String(fd.get("qty") ?? "0"), 10),
    salePrice: Number(fd.get("salePrice") ?? 0) || 0,
    seller: user.name,
  });
  if (res.ok) {
    revalidatePath("/app");
    revalidatePath("/app/sold");
  }
  return { ok: res.ok, message: res.message };
}
