import "server-only";
import type { AccountSettings, Role, Plan } from "../types";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";

export async function getAccount(): Promise<AccountSettings> {
  const me = await getCurrentUser();
  const u = await prisma.user.findUniqueOrThrow({ where: { id: me.id } });
  return {
    name: u.name ?? "",
    companyName: u.companyName ?? "",
    email: u.email,
    phone: u.phone ?? "",
    userCode: u.userCode,
    role: u.role as Role,
    plan: u.plan as Plan,
    telegramLinked: Boolean(u.telegramId),
    telegramId: u.telegramId,
    joinedAt: u.createdAt.toISOString(),
  };
}
