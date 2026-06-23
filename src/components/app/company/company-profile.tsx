import { money, shortDate } from "@/lib/format";
import type { CompanyData } from "@/lib/types";

const PLAN: Record<string, string> = { FREE: "Бесплатный", PRO: "Pro", BUSINESS: "Business" };

export function CompanyProfile({ data }: { data: CompanyData }) {
  const initial = data.companyName.trim()[0]?.toUpperCase() ?? "К";
  return (
    <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-izzy-brand-strong font-display text-xl font-bold text-white">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold tracking-tight">{data.companyName}</h2>
          <p className="mt-0.5 truncate text-sm text-izzy-muted">
            Владелец: {data.ownerName} · <span className="font-data">#{data.userCode}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-izzy-brand/30 bg-izzy-brand/10 px-2.5 py-1 font-data text-xs text-izzy-accent">
          {PLAN[data.plan] ?? data.plan}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-izzy-hairline bg-izzy-hairline sm:grid-cols-4">
        <Stat label="Участников" value={String(data.members.length)} />
        <Stat label="Лотов" value={String(data.lotsCount)} />
        <Stat label="Позиций" value={String(data.productsCount)} />
        <Stat label="Выручка" value={money(data.revenue, data.currency)} accent />
      </dl>

      <p className="mt-4 font-data text-xs text-izzy-muted">В IzzyKeep с {shortDate(data.joinedAt)}</p>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-izzy-surface p-4">
      <dt className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">{label}</dt>
      <dd className={`mt-1 font-data text-lg font-bold tabular-nums ${accent ? "text-izzy-profit" : "text-izzy-text"}`}>
        {value}
      </dd>
    </div>
  );
}
