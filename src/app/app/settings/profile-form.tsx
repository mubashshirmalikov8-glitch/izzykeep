"use client";

import { useActionState } from "react";
import { updateProfile, type SaveResult } from "./actions";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3.5 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none";
const labelCls = "font-data text-[11px] uppercase tracking-wider text-izzy-muted";

export function ProfileForm({
  defaultName,
  defaultPhone,
  email,
  userCode,
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
  userCode: string;
}) {
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(updateProfile, null);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Имя *</span>
        <input name="name" required defaultValue={defaultName} className={inputCls} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Телефон</span>
        <input name="phone" type="tel" defaultValue={defaultPhone} placeholder="+998 …" className={inputCls} />
      </label>
      <ReadOnly label="Email" value={email} />
      <ReadOnly label="ID" value={`#${userCode}`} />
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-izzy-brand-strong px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-izzy-brand-deep disabled:opacity-50"
        >
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
        {state && <p className={cn("text-xs", state.ok ? "text-izzy-profit" : "text-red-400")}>{state.message}</p>}
      </div>
    </form>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      <div className="truncate rounded-lg border border-izzy-hairline bg-izzy-surface-2 px-3.5 py-2.5 text-sm text-izzy-muted">
        {value}
      </div>
    </div>
  );
}
