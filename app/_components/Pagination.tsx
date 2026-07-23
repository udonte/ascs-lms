import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Base URL path — pagination appends ?page=N */
  basePath: string;
};

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page - 1;
  const next = page + 1;

  return (
    <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 sm:px-6">
      <p className="text-sm text-neutral-500">
        Page <span className="font-semibold text-neutral-700">{page}</span> of{" "}
        <span className="font-semibold text-neutral-700">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={`${basePath}?page=${prev}`}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-customer-purple"
          >
            <HiChevronLeft className="h-4 w-4" />
            Prev
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-300">
            <HiChevronLeft className="h-4 w-4" />
            Prev
          </span>
        )}

        {page < totalPages ? (
          <Link
            href={`${basePath}?page=${next}`}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-customer-purple"
          >
            Next
            <HiChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-300">
            Next
            <HiChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
