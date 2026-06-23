"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { generateLinkCode } from "@/lib/telegram/link";
import { prisma } from "@/lib/prisma";

export type SaveResult = { ok: boolean; message: string };

export async function createTelegramCode(): Promise<{ code: string }> {
  const user = await getCurrentUser();
  const code = await generateLinkCode(user.id);
  return { code };
}

export async function updateProfile(_prev: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Введите имя." };
  const phone = String(fd.get("phone") ?? "").trim() || null;
  const user = await getCurrentUser();
  await prisma.user.update({ where: { id: user.id }, data: { name, phone } });
  revalidatePath("/app/settings");
  return { ok: true, message: "Профиль сохранён." };
}

export async function updateCompany(_prev: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const companyName = String(fd.get("companyName") ?? "").trim() || null;
  const user = await getCurrentUser();
  await prisma.user.update({ where: { id: user.id }, data: { companyName } });
  revalidatePath("/app/settings");
  revalidatePath("/app/company");
  return { ok: true, message: "Данные компании сохранены." };
}

export async function unlinkTelegram(): Promise<SaveResult> {
  const user = await getCurrentUser();
  await prisma.user.update({ where: { id: user.id }, data: { telegramId: null } });
  revalidatePath("/app/settings");
  return { ok: true, message: "Telegram отвязан." };
}
