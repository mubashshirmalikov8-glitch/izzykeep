// Shown while running on mock data (no DATABASE_URL yet).
export function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-izzy-brand/30 bg-izzy-brand/10 px-4 py-3">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-izzy-accent" />
      <p className="text-sm text-izzy-text">
        Демо-данные. Подключите базу данных (<span className="font-data text-xs">DATABASE_URL</span>)
        и примените миграцию, чтобы вести реальный склад — изменения пока не сохраняются.
      </p>
    </div>
  );
}
