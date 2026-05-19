export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-white/10" />
      <div className="h-10 w-3/4 rounded bg-white/10" />
      <div className="h-4 w-full rounded bg-white/5" />
      <div className="h-4 w-5/6 rounded bg-white/5" />
      <div className="h-48 rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
}
