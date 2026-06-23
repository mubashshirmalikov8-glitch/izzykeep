import { shortDate } from "@/lib/format";
import type { ForecastRow } from "@/lib/types";

export function ForecastTable({ rows }: { rows: ForecastRow[] }) {
  if (!rows.length) return <p className="py-10 text-center text-sm text-izzy-muted">Нет позиций в остатке.</p>;
  return (
    <div>
      <div className="grid grid-cols-[1fr_3.5rem_4rem_5rem] gap-2 border-b border-izzy-hairline pb-2 font-data text-[11px] uppercase tracking-wider text-izzy-muted">
        <span>Позиция</span>
        <span className="text-right">Ост.</span>
        <span className="text-right">/день</span>
        <span className="text-right">Хватит до</span>
      </div>
      <ul>
        {rows.map((r) => (
          <li key={r.code} className="grid grid-cols-[1fr_3.5rem_4rem_5rem] items-center gap-2 border-b border-izzy-hairline/60 py-2.5 last:border-0">
            <span className="truncate text-sm text-izzy-text">{r.name}</span>
            <span className="text-right font-data text-sm tabular-nums text-izzy-text">{r.remaining}</span>
            <span className="text-right font-data text-xs tabular-nums text-izzy-muted">{r.perDay.toFixed(2)}</span>
            <span className="text-right font-data text-xs tabular-nums text-izzy-text">
              {r.eta ? shortDate(r.eta) : "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
