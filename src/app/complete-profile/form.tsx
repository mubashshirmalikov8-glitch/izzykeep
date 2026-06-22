"use client";

import { useActionState } from "react";
import { completeProfile, type ProfileResult } from "./actions";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3.5 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none";
const labelCls = "font-data text-[11px] uppercase tracking-wider text-izzy-muted";

export function CompleteProfileForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState<ProfileResult | null, FormData>(
    completeProfile,
    null,
  );

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Имя *</span>
        <input name="name" required defaultValue={defaultName} placeholder="Иван" className={inputCls} autoFocus />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Телефон</span>
        <input name="phone" type="tel" placeholder="+998 90 123 45 67" className={inputCls} />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-izzy-brand-strong px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
      >
        {pending ? "Сохранение…" : "Продолжить"}
      </button>

      {state && !state.ok && <p className="text-xs text-red-400">{state.message}</p>}
    </form>
  );
}
