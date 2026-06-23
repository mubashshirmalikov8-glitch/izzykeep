// Shown during navigation to any /app/* route (data is dynamic + DB-backed).
export default function AppLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6 motion-reduce:animate-none">
      <div className="h-8 w-44 rounded-lg bg-izzy-surface-2" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-izzy-hairline bg-izzy-surface" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-izzy-hairline bg-izzy-surface" />
    </div>
  );
}
