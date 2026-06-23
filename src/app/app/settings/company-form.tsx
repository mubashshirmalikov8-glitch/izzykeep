"use client";

import { useActionState } from "react";
import { updateCompany, type SaveResult } from "./actions";
import { RoleBadge } from "@/components/app/role-badge";
import { cn } from "@/lib/utils";
import type { Role, Plan } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-izzy-hairline bg-izzy-bg px-3.5 py-2.5 text-sm text-izzy-text placeholder:text-izzy-muted focus:border-izzy-brand focus:outline-none";
const labelCls = "font-data text-[11px] uppercase tracking-wider text-izzy-muted";
const PLAN: Record<string, string> = { FREE: "Бесплатный", PRO: "Pro", BUSINESS: "Business" };

export function CompanyForm({
  defaultCompanyName,
  role,
  plan,
}: {
  defaultCompanyName: string;
  role: Role;
  plan: Plan;
}) {
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(updateCompany, null);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className={labelCls}>Название компании</span>
        <input name="companyName" defaultValue={defaultCompanyName} placeholder="Моя компания" className={inputCls} />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>Роль</span>
        <div className="py-1">
          <RoleBadge role={role} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>Тариф</span>
        <div className="rounded-lg border border-izzy-hairline bg-izzy-surface-2 px-3.5 py-2.5 text-sm text-izzy-muted">
          {PLAN[plan] ?? plan}
        </div>
      </div>
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
