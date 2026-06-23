import "server-only";
import { prisma } from "@/lib/prisma";

// Generate a short, time-limited code on the website (Settings). The user sends
// it to the bot via `/start <code>` to bind their Telegram account.
export async function generateLinkCode(userId: string): Promise<string> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  await prisma.user.update({
    where: { id: userId },
    data: { telegramLinkCode: code, telegramLinkExpires: new Date(Date.now() + 15 * 60_000) },
  });
  return code;
}

export async function linkTelegram(
  telegramId: string,
  code: string,
): Promise<{ ok: boolean; message: string }> {
  const c = code.trim().toUpperCase();
  if (!c) return { ok: false, message: "Укажите код: /start КОД" };

  const user = await prisma.user.findFirst({
    where: { telegramLinkCode: c, telegramLinkExpires: { gt: new Date() } },
  });
  if (!user) {
    return { ok: false, message: "Код неверный или истёк. Сгенерируйте новый в настройках сайта." };
  }

  // Move the telegramId off any previous owner, then bind it here.
  await prisma.user.updateMany({ where: { telegramId }, data: { telegramId: null } });
  await prisma.user.update({
    where: { id: user.id },
    data: { telegramId, telegramLinkCode: null, telegramLinkExpires: null },
  });
  return { ok: true, message: `Привязано к аккаунту ${user.name ?? user.email}. Роль: ${user.role}.` };
}

export async function resolveUserByTelegram(telegramId: string) {
  return prisma.user.findUnique({ where: { telegramId } });
}
