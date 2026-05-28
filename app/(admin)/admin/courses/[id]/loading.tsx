export default function CourseEditorLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse">
      <div className="mb-6 hidden h-8 w-48 rounded-lg bg-neutral-200 md:block" />
      <div className="mb-6 h-4 w-40 rounded bg-neutral-200" />
      <div className="mb-8 flex gap-3">
        <div className="h-7 w-56 rounded bg-neutral-200" />
        <div className="h-6 w-20 rounded-full bg-neutral-200" />
        <div className="h-6 w-16 rounded-full bg-neutral-200" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="h-6 w-36 rounded bg-neutral-200" />
          <div className="h-4 w-full max-w-sm rounded bg-neutral-200" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 rounded bg-neutral-200" />
              <div className="h-10 w-full rounded-lg bg-neutral-200" />
            </div>
          ))}
          <div className="h-10 w-full rounded-lg bg-neutral-200" />
        </div>

        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="flex justify-between">
            <div className="h-6 w-24 rounded bg-neutral-200" />
            <div className="h-10 w-28 rounded-lg bg-neutral-200" />
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-xl border border-neutral-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
