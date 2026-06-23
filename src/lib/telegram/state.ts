import "server-only";
import { prisma } from "@/lib/prisma";

// Per-Telegram-user wizard state, persisted so multi-step flows survive
// serverless invocations.
export type WizardState = { command: string; step: number; data: Record<string, unknown> };

export async function getState(telegramId: string): Promise<WizardState | null> {
  const s = await prisma.botState.findUnique({ where: { telegramId } });
  if (!s) return null;
  return { command: s.command, step: s.step, data: (s.data as Record<string, unknown>) ?? {} };
}

export async function setState(telegramId: string, state: WizardState): Promise<void> {
  const data = JSON.parse(JSON.stringify(state.data));
  await prisma.botState.upsert({
    where: { telegramId },
    update: { command: state.command, step: state.step, data },
    create: { telegramId, command: state.command, step: state.step, data },
  });
}

export async function clearState(telegramId: string): Promise<void> {
  await prisma.botState.deleteMany({ where: { telegramId } });
}
