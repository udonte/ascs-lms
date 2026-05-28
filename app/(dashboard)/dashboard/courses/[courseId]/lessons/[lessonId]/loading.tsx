export default function ClassroomLessonLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse">
      <div className="mb-6 h-4 w-36 rounded bg-neutral-200" />

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="space-y-8 lg:col-span-3">
          <div className="aspect-video w-full rounded-2xl bg-neutral-200" />
          <div className="space-y-3">
            <div className="h-4 w-28 rounded bg-neutral-200" />
            <div className="h-8 w-3/4 rounded bg-neutral-200" />
          </div>
          <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
            <div className="h-4 w-4/6 rounded bg-neutral-200" />
          </div>
          <div className="h-14 w-64 rounded-xl bg-neutral-200" />

          {/* Quiz-mode placeholder (keeps layout stable when switching modes) */}
          <div className="hidden space-y-4 rounded-2xl border border-neutral-200 bg-white p-8 lg:block">
            <div className="h-5 w-52 rounded bg-neutral-200" />
            <div className="h-7 w-3/4 rounded bg-neutral-200" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-full rounded-xl bg-neutral-200" />
              ))}
            </div>
            <div className="flex justify-between gap-3">
              <div className="h-10 w-28 rounded-xl bg-neutral-200" />
              <div className="h-10 w-40 rounded-xl bg-neutral-200" />
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-1">
          <div className="h-6 w-40 rounded bg-neutral-200" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-full rounded-lg border border-neutral-200 bg-white"
            />
          ))}
          <div className="mt-3 h-12 w-full rounded-lg border border-neutral-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
