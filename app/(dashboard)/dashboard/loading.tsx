export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-neutral-200" />
      <div className="h-4 w-full max-w-md rounded bg-neutral-200" />
      <div className="h-4 w-full max-w-sm rounded bg-neutral-200" />
    </div>
  );
}
