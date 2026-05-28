"use client";

import { useTransition } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

import { completeLessonAction } from "@/lib/services/student-course-actions";

type CompleteLessonButtonProps = {
  courseId: string;
  lessonId: string;
  hasNextLesson: boolean;
};

export function CompleteLessonButton({
  courseId,
  lessonId,
  hasNextLesson,
}: CompleteLessonButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await completeLessonAction(courseId, lessonId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-customer-teal px-6 py-4 text-base font-semibold text-customer-cream shadow-md transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <HiOutlineCheckCircle className="h-5 w-5" aria-hidden />
      {pending
        ? "Saving progress…"
        : hasNextLesson
          ? "Mark as Complete & Next"
          : "Mark as Complete"}
    </button>
  );
}
