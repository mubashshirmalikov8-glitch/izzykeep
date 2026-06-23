import type { SlowRow } from "@/lib/types";

export function SlowMoving({ rows }: { rows: SlowRow[] }) {
  if (!rows.length) return <p className="py-10 text-center text-sm text-izzy-muted">Нет данных.</p>;
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li key={r.code} className="flex items-center justify-between gap-3 border-b border-izzy-hairline/60 py-2.5 last:border-0">
          <div className="min-w-0">
            <p className="truncate text-sm text-izzy-text">{r.name}</p>
            <p className="font-data text-[11px] text-izzy-muted">
              продано {r.sold} · остаток {r.remaining}
            </p>
          </div>
          <span className="shrink-0 font-data text-xs text-izzy-steel">{r.sellThrough.toFixed(0)}%</span>
        </li>
      ))}
    </ul>
  );
}
