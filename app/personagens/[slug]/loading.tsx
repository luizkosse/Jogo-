export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8 animate-pulse space-y-4">
      <div className="h-4 w-32 rounded bg-wood/20" />
      <div className="wood-frame rounded-sm p-4">
        <div className="flex gap-4">
          <div className="h-32 w-32 rounded-sm bg-wood/30 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-48 rounded bg-wood/20" />
            <div className="h-4 w-32 rounded bg-wood/15" />
            <div className="h-4 w-64 rounded bg-wood/15" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded-sm wood-frame opacity-50" />
      ))}
    </div>
  );
}
