type LedgerStatusBadgeProps = {
  status: string;
};

export function LedgerStatusBadge({ status }: LedgerStatusBadgeProps) {
  const normalized = status.toLowerCase();

  if (normalized === "paid") {
    return (
      <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
        Paid
      </span>
    );
  }

  if (normalized === "pending") {
    return (
      <span className="inline-flex rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-neutral-200 px-2.5 py-1 text-xs font-semibold capitalize text-neutral-700">
      {status}
    </span>
  );
}
