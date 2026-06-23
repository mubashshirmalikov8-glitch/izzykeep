import { money } from "@/lib/format";
import type { FinanceSummary, AnalyticsData, WarehouseRow } from "@/lib/types";

export function formatStock(rows: WarehouseRow[]): string {
  if (!rows.length) return "Склад пуст. Добавьте позиции: /add_item";
  const lines = rows.slice(0, 20).map((r) => `• ${r.code} — ${r.partName}: остаток ${r.remaining}`);
  const more = rows.length > 20 ? `\n…и ещё ${rows.length - 20}` : "";
  return `📦 Склад (${rows.length})\n${lines.join("\n")}${more}`;
}

export function formatReport(fin: FinanceSummary, an: AnalyticsData): string {
  const top =
    an.topSelling
      .slice(0, 5)
      .map((t, i) => `${i + 1}. ${t.label} — ${t.display}`)
      .join("\n") || "—";
  const low =
    an.lowStock
      .slice(0, 8)
      .map((l) => `• ${l.name}: ${l.reason}`)
      .join("\n") || "нет";
  return [
    "📊 Отчёт",
    `Выручка: ${money(fin.revenue, fin.currency)}`,
    `Прибыль: ${money(fin.profit, fin.currency)}`,
    "",
    "🔥 Топ товаров:",
    top,
    "",
    "⚠️ Низкий остаток:",
    low,
  ].join("\n");
}
