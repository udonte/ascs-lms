import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

import { ClassroomQuizPanel } from "@/app/(dashboard)/_components/ClassroomQuizPanel";
import { LessonContentPanel } from "@/app/(dashboard)/_components/LessonContentPanel";
import { LessonSyllabusSidebar } from "@/app/(dashboard)/_components/LessonSyllabusSidebar";
import { LessonVideoPlayer } from "@/app/(dashboard)/_components/LessonVideoPlayer";
import { StudentCourseService } from "@/lib/services/student-course-service";

type ClassroomPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
  searchParams?: Promise<{ mode?: string }>;
};

export default async function ClassroomLessonPage({
  params,
  searchParams,
}: ClassroomPageProps) {
  const { courseId, lessonId } = await params;
  const mode = (await searchParams)?.mode === "quiz" ? "quiz" : "lesson";
  const context = await StudentCourseService.getClassroomContext(courseId, lessonId);

  if (!context) {
    notFound();
  }

  const quizHref = `/dashboard/courses/${courseId}/lessons/${lessonId}?mode=quiz`;
  const lessonHref = `/dashboard/courses/${courseId}/lessons/${lessonId}`;
  const showQuiz = mode === "quiz" && Boolean(context.quiz);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Link
        href={`/dashboard/courses/${courseId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
        Back to Course Overview
      </Link>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {showQuiz ? (
            <ClassroomQuizPanel
              courseId={context.courseId}
              quiz={context.quiz!}
              isUnlocked={context.isCourseFullyViewed}
              onExitHref={lessonHref}
            />
          ) : (
            <>
              <LessonVideoPlayer
                videoUrl={context.lesson.video_url}
                title={context.lesson.title}
              />
              <LessonContentPanel
                courseId={context.courseId}
                lesson={context.lesson}
                nextLessonId={context.nextLessonId}
              />
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <LessonSyllabusSidebar
            courseId={context.courseId}
            courseTitle={context.courseTitle}
            syllabus={context.syllabus}
            completedLessonIds={context.completedLessonIds}
            activeLessonId={lessonId}
            quizUnlocked={context.isCourseFullyViewed}
            quizHref={quizHref}
            activeMode={showQuiz ? "quiz" : "lesson"}
            quizAttempt={context.quizAttempt}
          />
        </div>
      </div>
    </div>
  );
}
