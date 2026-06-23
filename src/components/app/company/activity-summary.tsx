import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/types";

const DOT: Record<ActivityItem["kind"], string> = {
  sale: "bg-izzy-profit",
  lot: "bg-izzy-brand",
  item: "bg-izzy-steel",
};

export function ActivitySummary({ items }: { items: ActivityItem[] }) {
  if (!items.length) return <p className="py-10 text-center text-sm text-izzy-muted">Активности пока нет.</p>;
  return (
    <ul className="flex flex-col">
      {items.map((a, i) => (
        <li key={i} className="flex items-center gap-3 border-b border-izzy-hairline/60 py-2.5 last:border-0">
          <span className={cn("size-2 shrink-0 rounded-full", DOT[a.kind])} />
          <span className="min-w-0 flex-1 truncate text-sm text-izzy-text">{a.text}</span>
          {a.amount && <span className="shrink-0 font-data text-xs font-semibold text-izzy-profit">{a.amount}</span>}
          <span className="shrink-0 font-data text-[11px] text-izzy-muted">{shortDate(a.at)}</span>
        </li>
      ))}
    </ul>
  );
}
