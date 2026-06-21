"use client";

import { useActionState, useMemo, useState } from "react";
import { recordSale, type ActionResult } from "@/app/app/actions";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WarehouseRow } from "@/lib/types";

export function WarehouseTable({ rows }: { rows: WarehouseRow[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.partName, r.oem, r.carName, r.lotCode, r.code]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  return (
    <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface">
      <div className="border-b border-izzy-hairline p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: запчасть, OEM, авто, лот…"
          className="w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3.5 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-izzy-muted">
          {rows.length === 0 ? "На складе пока нет позиций. Добавьте их на странице «Лот»." : "Ничего не найдено."}
        </p>
      ) : (
        <ul>
          {filtered.map((r) => (
            <li key={r.id} className="border-b border-izzy-hairline/60 last:border-0">
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-data text-xs text-izzy-steel">{r.oem ?? "—"}</span>
                    <span className="truncate text-sm text-izzy-text">{r.partName}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 font-data text-xs text-izzy-muted">
                    {r.carName && <span>{r.carName}</span>}
                    {r.carName && <span aria-hidden>·</span>}
                    <span>{r.lotCode}</span>
                  </div>
                </div>

                <div className="hidden w-12 flex-col items-end sm:flex">
                  <span className="text-[11px] text-izzy-muted">продано</span>
                  <span className="font-data text-sm tabular-nums text-izzy-text">{r.sold}</span>
                </div>

                <div className="flex w-14 flex-col items-end">
                  <span className="text-[11px] text-izzy-muted">остаток</span>
                  <span
                    className={cn(
                      "font-data text-sm font-semibold tabular-nums",
                      r.remaining === 0 ? "text-izzy-muted" : "text-izzy-text",
                    )}
                  >
                    {r.remaining}
                  </span>
                </div>

                <div className="hidden w-20 text-right font-data text-sm tabular-nums text-izzy-text sm:block">
                  {money(r.salePrice, r.currency)}
                </div>

                <button
                  type="button"
                  disabled={r.remaining === 0}
                  onClick={() => setOpenId((id) => (id === r.id ? null : r.id))}
                  className="shrink-0 rounded-lg border border-izzy-hairline px-3 py-1.5 text-xs font-medium text-izzy-text transition-colors hover:bg-izzy-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {openId === r.id ? "Отмена" : "Продать"}
                </button>
              </div>

              {openId === r.id && <SellForm row={r} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SellForm({ row }: { row: WarehouseRow }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    recordSale,
    null,
  );

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 border-t border-izzy-hairline bg-izzy-surface-2 px-4 py-4"
    >
      <input type="hidden" name="itemId" value={row.id} />
      <Field label="Кол-во">
        <input
          name="qty"
          type="number"
          min={1}
          max={row.remaining}
          defaultValue={1}
          className="w-24 rounded-lg border border-izzy-hairline bg-izzy-bg px-3 py-2 font-data text-sm text-izzy-text focus:border-izzy-brand focus:outline-none"
        />
      </Field>
      <Field label="Цена">
        <input
          name="salePrice"
          type="number"
          min={0}
          step="0.01"
          defaultValue={row.salePrice}
          className="w-28 rounded-lg border border-izzy-hairline bg-izzy-bg px-3 py-2 font-data text-sm text-izzy-text focus:border-izzy-brand focus:outline-none"
        />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-izzy-brand-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
      >
        {pending ? "Сохранение…" : "Записать продажу"}
      </button>
      {state && (
        <p className={cn("w-full text-xs", state.ok ? "text-izzy-profit" : "text-red-400")}>
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">{label}</span>
      {children}
    </label>
  );
}
