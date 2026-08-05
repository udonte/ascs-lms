import { notFound } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

import Header from "@/app/_components/Header";
import { QuizBuilderForm } from "@/app/(admin)/_components/QuizBuilderForm";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";
import { QuizService } from "@/lib/services/admin/quizzes/quiz-service";

type QuizBuilderPageProps = {
  params: Promise<{ quizId: string }>;
};

export default async function QuizBuilderPage({ params }: QuizBuilderPageProps) {
  const { quizId } = await params;
  const isNew = quizId === "new";

  const courses = await AdminCourseService.getAdminCourses();
  const courseOptions = courses.map((c) => ({ id: c.id, title: c.title }));

  let quiz = null;
  if (!isNew) {
    quiz = await QuizService.getQuizById(quizId);
    if (!quiz) notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4">
        <Link
          href="/admin/quizzes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-customer-teal"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to quizzes
        </Link>
      </div>

      <Header
        title={isNew ? "Build New Quiz" : `Edit Quiz — ${quiz?.courseTitle}`}
        description={
          isNew
            ? "Link an assessment to a course and define multiple-choice questions."
            : "Update the questions, options, and passing score for this assessment."
        }
      />

      <QuizBuilderForm courses={courseOptions} quiz={quiz} />
    </div>
  );
}
