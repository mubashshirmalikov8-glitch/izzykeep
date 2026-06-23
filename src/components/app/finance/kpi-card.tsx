import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent?: "profit" | "danger";
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-izzy-hairline bg-izzy-surface p-5">
      <p className="font-data text-[11px] uppercase tracking-wider text-izzy-muted">{label}</p>
      <p
        className={cn(
          "mt-2 font-data text-2xl font-bold tabular-nums",
          accent === "profit" ? "text-izzy-profit" : accent === "danger" ? "text-red-400" : "text-izzy-text",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-izzy-muted">{hint}</p>}
    </div>
  );
}
