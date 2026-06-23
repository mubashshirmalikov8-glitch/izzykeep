import type { LowStockRow } from "@/lib/types";

export function LowStock({ rows }: { rows: LowStockRow[] }) {
  if (!rows.length) {
    return (
      <p className="rounded-xl border border-izzy-hairline bg-izzy-surface-2 px-4 py-6 text-center text-sm text-izzy-muted">
        Всё в порядке — низких остатков нет.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <li
          key={r.code}
          className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-izzy-text">{r.name}</p>
            <p className="font-data text-[11px] text-amber-500">{r.reason}</p>
          </div>
          <span className="shrink-0 font-data text-sm font-semibold tabular-nums text-amber-400">
            {r.remaining}
          </span>
        </li>
      ))}
    </ul>
  );
}
