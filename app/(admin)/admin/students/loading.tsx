export default function StudentLedgerLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse">
      <div className="mb-6 hidden h-8 w-48 rounded-lg bg-neutral-200 md:block" />

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="h-4 w-full max-w-2xl rounded bg-neutral-200" />
        <div className="h-10 w-44 rounded-lg bg-neutral-200" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="grid grid-cols-5 gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-neutral-200" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-4 border-b border-neutral-100 px-6 py-4 last:border-b-0"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-neutral-200" />
              <div className="h-3 w-40 rounded bg-neutral-200" />
            </div>
            <div className="h-4 w-36 rounded bg-neutral-200" />
            <div className="h-4 w-28 rounded bg-neutral-200" />
            <div className="h-6 w-16 rounded-full bg-neutral-200" />
            <div className="h-4 w-20 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
