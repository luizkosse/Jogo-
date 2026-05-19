export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 animate-pulse">
      <div className="flex gap-6 h-[calc(100dvh-8rem)]">
        <div className="hidden md:block w-72 space-y-3">
          <div className="h-7 w-32 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-3/4 rounded bg-white/5" />
        </div>
        <div className="flex-1 rounded-xl border border-white/10 bg-bg-twilight" />
      </div>
    </div>
  );
}
