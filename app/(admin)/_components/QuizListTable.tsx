"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { AdminQuizRow } from "@/lib/services/admin/quizzes/quiz-service";

const PAGE_SIZE = 15;

type QuizListTableProps = {
  quizzes: AdminQuizRow[];
  onEdit: (quiz: AdminQuizRow) => void;
  page: number;
  onPageChange: (page: number) => void;
};

export function QuizListTable({
  quizzes,
  onEdit,
  page,
  onPageChange,
}: QuizListTableProps) {
  if (quizzes.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
        <h2 className="text-lg font-bold text-customer-teal">No quizzes yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
          Build your first assessment to validate course completion and unlock
          certificates for students.
        </p>
      </section>
    );
  }

  const totalPages = Math.ceil(quizzes.length / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageRows = quizzes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Quiz
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Course
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Passing score
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Questions
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {pageRows.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-neutral-50/80">
                <td className="px-4 py-4 font-semibold text-customer-charcoal sm:px-6">
                  {quiz.title}
                </td>
                <td className="px-4 py-4 text-customer-charcoal sm:px-6">
                  {quiz.courseTitle}
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <span className="inline-flex rounded-full bg-customer-purple/10 px-3 py-1 text-xs font-semibold text-customer-purple">
                    {quiz.passing_score}% to Pass
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-600 sm:px-6">
                  {quiz.questionCount === 1
                    ? "1 question"
                    : `${quiz.questionCount} questions`}
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => onEdit(quiz)}
                    className="rounded-lg border border-customer-teal px-3 py-1.5 text-xs font-semibold text-customer-teal transition hover:bg-customer-teal hover:text-customer-cream"
                  >
                    Edit quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 sm:px-6">
          <p className="text-sm text-neutral-500">
            Page{" "}
            <span className="font-semibold text-neutral-700">{safePage}</span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(safePage - 1)}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-customer-purple disabled:cursor-not-allowed disabled:border-neutral-100 disabled:bg-neutral-50 disabled:text-neutral-300"
            >
              <HiChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => onPageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-customer-purple disabled:cursor-not-allowed disabled:border-neutral-100 disabled:bg-neutral-50 disabled:text-neutral-300"
            >
              Next
              <HiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
