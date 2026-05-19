export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8 animate-pulse space-y-4">
      <div className="h-4 w-32 rounded bg-wood/20" />
      <div className="h-10 w-64 rounded bg-wood/20" />
      <div className="h-4 w-full rounded bg-wood/15" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-sm wood-frame opacity-50" />
      ))}
    </div>
  );
}
