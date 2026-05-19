export function PageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8 animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-32 rounded-sm bg-wood/30" />
        <div className="h-4 w-72 max-w-full rounded-sm bg-wood/15" />
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-10 flex-1 rounded-sm bg-wood/20" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-40 rounded-sm wood-frame opacity-50" />
        ))}
      </div>
    </div>
  );
}
