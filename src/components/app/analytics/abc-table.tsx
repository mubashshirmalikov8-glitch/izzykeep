import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AbcRow } from "@/lib/types";

const CLS: Record<AbcRow["cls"], string> = {
  A: "border-izzy-profit/30 bg-izzy-profit/10 text-izzy-profit",
  B: "border-izzy-brand/30 bg-izzy-brand/10 text-izzy-accent",
  C: "border-izzy-hairline bg-izzy-surface-2 text-izzy-muted",
};

export function AbcTable({ rows, currency }: { rows: AbcRow[]; currency: string }) {
  if (!rows.length) return <p className="py-10 text-center text-sm text-izzy-muted">Нет данных.</p>;
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li key={r.code} className="flex items-center gap-3 border-b border-izzy-hairline/60 py-2.5 last:border-0">
          <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md border font-data text-xs font-semibold", CLS[r.cls])}>
            {r.cls}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-izzy-text">{r.name}</p>
            <p className="font-data text-[11px] text-izzy-steel">{r.code}</p>
          </div>
          <span className="shrink-0 font-data text-xs text-izzy-text">{money(r.revenue, currency)}</span>
          <span className="w-10 shrink-0 text-right font-data text-xs text-izzy-muted">{r.share.toFixed(0)}%</span>
        </li>
      ))}
    </ul>
  );
}
