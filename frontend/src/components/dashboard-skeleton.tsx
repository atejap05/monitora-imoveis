export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="h-12 w-64 animate-pulse rounded-lg bg-muted/40" />
        <div className="h-10 w-44 animate-pulse rounded-lg bg-muted/40" />
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-border/40 bg-card/30"
          />
        ))}
      </div>
      <div className="mb-6 h-10 max-w-sm animate-pulse rounded-lg bg-muted/30" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl border border-border/40 bg-card/20"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
