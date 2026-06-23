import "server-only";
import { Bot, type Context } from "grammy";
import * as inv from "@/lib/domain/inventory";
import { resolveUserByTelegram, linkTelegram } from "./link";
import { getState, setState, clearState, type WizardState } from "./state";
import { formatStock, formatReport } from "./format";
import { getWarehouseRows } from "@/lib/queries/warehouse";
import { getFinanceSummary } from "@/lib/queries/finance";
import { getAnalytics } from "@/lib/queries/analytics";

type Role = "OWNER" | "MANAGER" | "SELLER" | "INVESTOR";
type LinkedUser = { id: string; name: string | null; email: string; role: Role };

const can = {
  addLot: (r: Role) => r === "OWNER" || r === "MANAGER",
  addItem: (r: Role) => r === "OWNER" || r === "MANAGER",
  sale: (r: Role) => r === "OWNER" || r === "MANAGER" || r === "SELLER",
  report: (r: Role) => r === "OWNER" || r === "MANAGER",
};

// `||` (not `??`) so an empty env string also falls back — avoids grammY's
// "Empty token!" throw at build time when the token isn't set yet.
export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "111:PLACEHOLDER_TOKEN");

function tgIdOf(ctx: Context): string {
  return String(ctx.from?.id ?? "");
}

async function requireUser(ctx: Context): Promise<LinkedUser | null> {
  const u = await resolveUserByTelegram(tgIdOf(ctx));
  if (!u) {
    await ctx.reply(
      "Аккаунт не привязан. Откройте Настройки на сайте → Telegram, скопируйте код и отправьте: /start КОД",
    );
    return null;
  }
  return u as LinkedUser;
}

const MENU =
  "/stock — склад\n/sale — продажа\n/add_lot — новый лот\n/add_item — позиция\n/report — отчёт\n/cancel — отмена";

bot.command("start", async (ctx) => {
  const tgId = tgIdOf(ctx);
  const code = (ctx.match ?? "").toString().trim();
  if (code) {
    const res = await linkTelegram(tgId, code);
    await ctx.reply(res.message + (res.ok ? `\n\n${MENU}` : ""));
    return;
  }
  const u = await resolveUserByTelegram(tgId);
  if (u) {
    await ctx.reply(`IzzyKeep ✓ Вы вошли как ${u.name ?? u.email} (${u.role}).\n\n${MENU}`);
  } else {
    await ctx.reply(
      "Добро пожаловать в IzzyKeep!\nЧтобы привязать аккаунт: Настройки на сайте → Telegram → код → отправьте сюда: /start КОД",
    );
  }
});

bot.command("cancel", async (ctx) => {
  await clearState(tgIdOf(ctx));
  await ctx.reply("Отменено.");
});

bot.command("stock", async (ctx) => {
  const u = await requireUser(ctx);
  if (!u) return;
  await ctx.reply(formatStock(await getWarehouseRows(u.id)));
});

bot.command("report", async (ctx) => {
  const u = await requireUser(ctx);
  if (!u) return;
  if (!can.report(u.role)) return void ctx.reply("Недостаточно прав (нужна роль Owner/Manager).");
  const [fin, an] = await Promise.all([getFinanceSummary(u.id), getAnalytics(u.id)]);
  await ctx.reply(formatReport(fin, an));
});

bot.command("add_lot", async (ctx) => {
  const u = await requireUser(ctx);
  if (!u) return;
  if (!can.addLot(u.role)) return void ctx.reply("Недостаточно прав.");
  await setState(tgIdOf(ctx), { command: "add_lot", step: 0, data: {} });
  await ctx.reply("Новый лот. Введите название:");
});

bot.command("add_item", async (ctx) => {
  const u = await requireUser(ctx);
  if (!u) return;
  if (!can.addItem(u.role)) return void ctx.reply("Недостаточно прав.");
  await setState(tgIdOf(ctx), { command: "add_item", step: 0, data: {} });
  await ctx.reply("Новая позиция. Введите код лота (например LOT-XXXX):");
});

bot.command("sale", async (ctx) => {
  const u = await requireUser(ctx);
  if (!u) return;
  if (!can.sale(u.role)) return void ctx.reply("Недостаточно прав.");
  await setState(tgIdOf(ctx), { command: "sale", step: 0, data: {} });
  await ctx.reply("Продажа. Введите код позиции (например ITEM-XXXX):");
});

// Wizard input: any non-command text routes to the active flow.
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;
  const tgId = tgIdOf(ctx);
  const u = (await resolveUserByTelegram(tgId)) as LinkedUser | null;
  if (!u) return void ctx.reply("Сначала привяжите аккаунт: /start КОД");
  const st = await getState(tgId);
  if (!st) return void ctx.reply(`Команды:\n${MENU}`);

  if (st.command === "add_lot") return handleAddLot(ctx, u, st, tgId, text);
  if (st.command === "add_item") return handleAddItem(ctx, u, st, tgId, text);
  if (st.command === "sale") return handleSale(ctx, u, st, tgId, text);
});

const num = (t: string) => Number(t.replace(",", ".")) || 0;

async function handleAddLot(ctx: Context, u: LinkedUser, st: WizardState, tgId: string, text: string) {
  const d = st.data as Record<string, string | number>;
  if (st.step === 0) {
    d.name = text;
    await setState(tgId, { command: "add_lot", step: 1, data: d });
    return void ctx.reply("Валюта? (USD / UZS / RUB / EUR)");
  }
  if (st.step === 1) {
    d.currency = text.toUpperCase();
    await setState(tgId, { command: "add_lot", step: 2, data: d });
    return void ctx.reply("Наценка, %? (число, 0 если нет)");
  }
  const res = await inv.createLot({
    ownerId: u.id,
    name: String(d.name),
    currency: String(d.currency),
    margin: num(text),
  });
  await clearState(tgId);
  await ctx.reply(res.message);
}

async function handleAddItem(ctx: Context, u: LinkedUser, st: WizardState, tgId: string, text: string) {
  const d = st.data as Record<string, string | number>;
  if (st.step === 0) {
    const lot = await inv.findLot(u.id, text);
    if (!lot) return void ctx.reply("Лот не найден. Введите код лота снова или /cancel");
    d.lotId = lot.id;
    await setState(tgId, { command: "add_item", step: 1, data: d });
    return void ctx.reply(`Лот ${lot.code}. Название запчасти?`);
  }
  if (st.step === 1) {
    d.partName = text;
    await setState(tgId, { command: "add_item", step: 2, data: d });
    return void ctx.reply("Количество?");
  }
  if (st.step === 2) {
    const qty = parseInt(text, 10);
    if (!(qty > 0)) return void ctx.reply("Введите число больше 0.");
    d.qty = qty;
    await setState(tgId, { command: "add_item", step: 3, data: d });
    return void ctx.reply("Себестоимость за шт?");
  }
  if (st.step === 3) {
    d.cost = num(text);
    await setState(tgId, { command: "add_item", step: 4, data: d });
    return void ctx.reply("Цена продажи за шт?");
  }
  const res = await inv.addItem({
    ownerId: u.id,
    lotId: String(d.lotId),
    partName: String(d.partName),
    qty: Number(d.qty),
    costUsd: Number(d.cost),
    salePrice: num(text),
  });
  await clearState(tgId);
  await ctx.reply(res.message);
}

async function handleSale(ctx: Context, u: LinkedUser, st: WizardState, tgId: string, text: string) {
  const d = st.data as Record<string, string | number>;
  if (st.step === 0) {
    const item = await inv.findItem(u.id, text);
    if (!item) return void ctx.reply("Позиция не найдена. Введите код позиции снова или /cancel");
    const sold = item.sales.reduce((a, s) => a + s.qty, 0);
    d.itemId = item.id;
    d.remaining = item.qty - sold;
    d.defPrice = Number(item.salePrice);
    await setState(tgId, { command: "sale", step: 1, data: d });
    return void ctx.reply(`${item.partName}. Остаток ${d.remaining}. Сколько продать?`);
  }
  if (st.step === 1) {
    const qty = parseInt(text, 10);
    if (!(qty > 0)) return void ctx.reply("Введите число больше 0.");
    if (qty > Number(d.remaining)) return void ctx.reply(`Недостаточно. Доступно ${d.remaining}.`);
    d.qty = qty;
    await setState(tgId, { command: "sale", step: 2, data: d });
    return void ctx.reply(`Цена за шт? (отправьте «-», чтобы использовать ${d.defPrice})`);
  }
  const price = text === "-" ? 0 : num(text);
  const res = await inv.recordSale({
    ownerId: u.id,
    itemId: String(d.itemId),
    qty: Number(d.qty),
    salePrice: price,
    seller: u.name,
  });
  await clearState(tgId);
  await ctx.reply(res.message);
}
