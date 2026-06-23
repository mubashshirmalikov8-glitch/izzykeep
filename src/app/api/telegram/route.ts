import { webhookCallback } from "grammy";
import { bot } from "@/lib/telegram/bot";

// Telegram posts updates here. Runs on Node (Prisma needs it); validates the
// secret header so only Telegram can call it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = webhookCallback(bot, "std/http", {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});
