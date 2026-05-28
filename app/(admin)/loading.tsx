export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-10 w-40 animate-pulse rounded-3xl bg-neutral-200" />
      </div>

      <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="h-5 w-32 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-6 h-14 w-full animate-pulse rounded-2xl bg-neutral-200" />
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <div className="h-5 w-48 animate-pulse rounded-full bg-neutral-200" />
        </div>
        <div className="space-y-4 p-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200 col-span-2" />
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200 col-span-1" />
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200 col-span-1" />
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200 col-span-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
