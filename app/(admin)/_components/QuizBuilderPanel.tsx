"use client";

import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";

import type { AdminQuizRow } from "@/lib/services/admin/quizzes/quiz-service";
import { QuizFormDialog, type QuizCourseOption } from "./QuizFormDialog";
import { QuizListTable } from "./QuizListTable";

type QuizBuilderPanelProps = {
  quizzes: AdminQuizRow[];
  courses: QuizCourseOption[];
};

export function QuizBuilderPanel({ quizzes, courses }: QuizBuilderPanelProps) {
  const [open, setOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<AdminQuizRow | null>(null);
  const [page, setPage] = useState(1);

  const openCreate = () => {
    setEditingQuiz(null);
    setOpen(true);
  };

  const openEdit = (quiz: AdminQuizRow) => {
    setEditingQuiz(quiz);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingQuiz(null);
  };

  return (
    <>
      <div className="mb-8 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          disabled={courses.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-customer-gold px-4 py-2.5 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HiOutlinePlus className="h-4 w-4" aria-hidden />
          Build New Quiz
        </button>
      </div>

      <QuizListTable quizzes={quizzes} onEdit={openEdit} page={page} onPageChange={setPage} />

      <QuizFormDialog
        open={open}
        onClose={closeDialog}
        courses={courses}
        quiz={editingQuiz}
      />
    </>
  );
}
