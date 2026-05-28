export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse">
      <div className="mb-10 space-y-3">
        <div className="h-9 w-72 max-w-full rounded-lg bg-neutral-200" />
        <div className="h-4 w-full max-w-xl rounded bg-neutral-200" />
      </div>

      <div className="mb-6 h-6 w-32 rounded bg-neutral-200" />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <div className="aspect-16/10 bg-neutral-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-4/5 rounded bg-neutral-200" />
              <div className="h-4 w-full rounded bg-neutral-200" />
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
              <div className="mt-4 h-11 w-full rounded-lg bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
