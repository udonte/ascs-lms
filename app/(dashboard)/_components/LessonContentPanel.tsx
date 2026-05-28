import type { LessonDetail } from "@/lib/services/student-course-service";
import { CompleteLessonButton } from "./CompleteLessonButton";

type LessonContentPanelProps = {
  courseId: string;
  lesson: LessonDetail;
  nextLessonId: string | null;
};

export function LessonContentPanel({
  courseId,
  lesson,
  nextLessonId,
}: LessonContentPanelProps) {
  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
          Current lesson
        </p>
        <h1 className="mt-2 text-2xl font-bold text-customer-teal md:text-3xl">
          {lesson.title}
        </h1>
      </div>

      {lesson.content_body?.trim() ? (
        <article className="prose prose-neutral max-w-none rounded-xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed text-neutral-700 shadow-sm">
          {lesson.content_body.split("\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : undefined}>
              {paragraph}
            </p>
          ))}
        </article>
      ) : (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-6 text-sm text-neutral-500">
          No written notes for this lesson yet. Watch the video and mark complete
          when you are ready to move on.
        </p>
      )}

      <CompleteLessonButton
        courseId={courseId}
        lessonId={lesson.id}
        hasNextLesson={Boolean(nextLessonId)}
      />
    </div>
  );
}
