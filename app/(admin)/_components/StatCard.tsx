import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  accentClass?: string;
};

export default function StatCard({
  label,
  value,
  icon,
  accentClass = "bg-customer-purple/10 text-customer-gold",
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-customer-charcoal">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-customer-charcoal">
            {value}
          </p>
        </div>
        <div
          className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${accentClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
