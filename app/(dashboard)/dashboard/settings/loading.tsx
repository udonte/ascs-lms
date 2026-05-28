export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-56 rounded bg-neutral-200" />
        <div className="h-4 w-136 max-w-full rounded bg-neutral-200" />
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-40 rounded bg-neutral-200" />
          <div className="h-4 w-80 max-w-full rounded bg-neutral-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-neutral-200" />
            <div className="h-11 w-full rounded-xl bg-neutral-200" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-neutral-200" />
            <div className="h-11 w-full rounded-xl bg-neutral-200" />
            <div className="h-3 w-80 max-w-full rounded bg-neutral-200" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="h-11 w-48 rounded-xl bg-neutral-200" />
        </div>
      </section>
    </div>
  );
}
