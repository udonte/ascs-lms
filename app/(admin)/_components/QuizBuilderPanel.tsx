"use client";

import Link from "next/link";
import { HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";

import type { AdminQuizRow } from "@/lib/services/admin/quizzes/quiz-service";
import { QuizListTable } from "./QuizListTable";

type QuizBuilderPanelProps = {
  quizzes: AdminQuizRow[];
  courses: { id: string; title: string }[];
};

export function QuizBuilderPanel({ quizzes, courses }: QuizBuilderPanelProps) {
  const [page, setPage] = useState(1);

  return (
    <>
      <div className="mb-8 flex justify-end">
        <Link
          href="/admin/quizzes/new"
          aria-disabled={courses.length === 0}
          className={`inline-flex items-center gap-2 rounded-lg bg-customer-gold px-4 py-2.5 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90 ${
            courses.length === 0
              ? "pointer-events-none cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          <HiOutlinePlus className="h-4 w-4" aria-hidden />
          Build New Quiz
        </Link>
      </div>

      <QuizListTable
        quizzes={quizzes}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
}
