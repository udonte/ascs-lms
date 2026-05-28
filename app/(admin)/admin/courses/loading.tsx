export default function ContentManagerLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse">
      <div className="mb-6 hidden items-center justify-between gap-6 md:flex">
        <div className="h-8 w-48 rounded-lg bg-neutral-200" />
        <div className="flex gap-4">
          <div className="h-10 w-44 rounded-lg bg-neutral-200" />
          <div className="h-14 w-36 rounded-lg bg-neutral-200" />
        </div>
      </div>

      <div className="mb-4 flex justify-end md:hidden">
        <div className="h-10 w-44 rounded-lg bg-neutral-200" />
      </div>

      <div className="mb-6 h-4 w-full max-w-lg rounded bg-neutral-200" />

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="h-5 w-48 rounded bg-neutral-200" />
                <div className="h-5 w-16 rounded-full bg-neutral-200" />
              </div>
              <div className="h-4 w-full max-w-md rounded bg-neutral-200" />
              <div className="h-3 w-20 rounded bg-neutral-200" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-20 rounded-full bg-neutral-200" />
              <div className="h-10 w-32 rounded-lg bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
