"use server";

import { getCurrentUser } from "@/lib/auth";
import { generateLinkCode } from "@/lib/telegram/link";

export async function createTelegramCode(): Promise<{ code: string }> {
  const user = await getCurrentUser();
  const code = await generateLinkCode(user.id);
  return { code };
}
