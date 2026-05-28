export default function CertificatesLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-80 rounded bg-neutral-200" />
        <div className="h-4 w-lg max-w-full rounded bg-neutral-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <div className="absolute left-0 top-0 h-full w-1.5 bg-neutral-200" />
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="h-6 w-44 rounded-full bg-neutral-200" />
                <div className="h-4 w-28 rounded bg-neutral-200" />
              </div>
              <div className="h-6 w-4/5 rounded bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-neutral-200" />
                <div className="h-4 w-5/6 rounded bg-neutral-200" />
              </div>
              <div className="h-10 w-full rounded-xl bg-neutral-200 sm:w-56" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
