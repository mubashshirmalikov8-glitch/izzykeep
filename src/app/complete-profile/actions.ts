"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ProfileResult = { ok: boolean; message: string };

export async function completeProfile(
  _prev: ProfileResult | null,
  fd: FormData,
): Promise<ProfileResult> {
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Введите имя." };
  const phone = String(fd.get("phone") ?? "").trim() || null;

  const user = await getCurrentUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone, profileDone: true },
  });

  redirect("/app");
}
