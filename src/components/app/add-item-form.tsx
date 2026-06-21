"use client";

import { useActionState } from "react";
import { addItem, type ActionResult } from "@/app/app/actions";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none";
const labelCls = "font-data text-[11px] uppercase tracking-wider text-izzy-muted";

type LotOption = { id: string; code: string; name: string };

export function AddItemForm({ lots }: { lots: LotOption[] }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addItem, null);

  return (
    <form action={action} className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
      <h3 className="font-display text-lg font-semibold">Добавить позицию</h3>
      <p className="mt-1 text-sm text-izzy-muted">OEM, деталь, авто, количество и себестоимость.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={labelCls}>Лот</span>
          <select name="lotId" required defaultValue="" className={inputCls} disabled={lots.length === 0}>
            <option value="" disabled>
              {lots.length === 0 ? "Сначала создайте лот" : "Выберите лот"}
            </option>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.code} — {l.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Запчасть</span>
          <input name="partName" required placeholder="Колодки передние" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Авто</span>
          <input name="carName" placeholder="Camry 50" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>OEM</span>
          <input name="oem" placeholder="04465-33471" className={cn(inputCls, "font-data")} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Количество</span>
          <input name="qty" type="number" min={1} defaultValue={1} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Себестоимость</span>
          <input name="costUsd" type="number" min={0} step="0.01" defaultValue={0} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Цена продажи</span>
          <input name="salePrice" type="number" min={0} step="0.01" defaultValue={0} className={inputCls} />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || lots.length === 0}
          className="rounded-lg bg-izzy-brand-strong px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
        >
          {pending ? "Добавление…" : "Добавить позицию"}
        </button>
        {state && (
          <p className={cn("text-xs", state.ok ? "text-izzy-profit" : "text-red-400")}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
