import { PageHeader } from "./page-header";

// Stub for pages not built in this phase (Компания, Финансы, Аналитика, …).
export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={title} />
      <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-izzy-hairline bg-izzy-surface/50 p-10 text-center">
        <span className="rounded-full border border-izzy-hairline bg-izzy-surface px-3 py-1 font-data text-xs uppercase tracking-wider text-izzy-steel">
          В разработке
        </span>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-izzy-muted">
          {note ?? "Этот раздел появится в одном из следующих обновлений."}
        </p>
      </div>
    </div>
  );
}
