"use client";

import { useActionState } from "react";
import { createLot, type ActionResult } from "@/app/app/actions";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none";
const labelCls = "font-data text-[11px] uppercase tracking-wider text-izzy-muted";

export function CreateLotForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createLot, null);

  return (
    <form action={action} className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
      <h3 className="font-display text-lg font-semibold">Создать лот</h3>
      <p className="mt-1 text-sm text-izzy-muted">Партия запчастей с валютой, курсом и наценкой.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={labelCls}>Название</span>
          <input name="name" required placeholder="Toyota — партия №2" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Валюта</span>
          <select name="currency" defaultValue="USD" className={inputCls}>
            <option value="USD">USD</option>
            <option value="UZS">UZS</option>
            <option value="RUB">RUB</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Курс</span>
          <input name="rate" type="number" step="0.0001" defaultValue={1} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Наценка, %</span>
          <input name="margin" type="number" step="0.01" defaultValue={25} className={inputCls} />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-izzy-brand-strong px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
        >
          {pending ? "Создание…" : "Создать лот"}
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
