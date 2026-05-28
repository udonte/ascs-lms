export default function CheckoutLoading() {
  return (
    <div className="mx-auto w-full max-w-lg animate-pulse">
      <div className="mb-6 h-4 w-32 rounded bg-neutral-200" />
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="mt-3 h-8 w-4/5 rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-full rounded bg-neutral-200" />
        <div className="mt-6 flex justify-between rounded-xl bg-neutral-100 px-4 py-3">
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-6 w-24 rounded-full bg-neutral-200" />
        </div>
        <div className="mt-6 h-24 rounded-xl bg-neutral-100" />
        <div className="mt-4 h-12 w-full rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}
