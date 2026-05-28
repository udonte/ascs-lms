import type { AdminLesson } from "@/lib/services/admin/courses/admin-course-service";
import { AddLessonDialog } from "./AddLessonDialog";
import { LessonEditorRow } from "./LessonEditorRow";

type CourseLessonsPanelProps = {
  courseId: string;
  lessons: AdminLesson[];
};

export function CourseLessonsPanel({
  courseId,
  lessons,
}: CourseLessonsPanelProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-[#F9FAFB] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-customer-teal">Lessons</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Build your curriculum in order. Students progress lesson by lesson.
          </p>
        </div>
        <AddLessonDialog courseId={courseId} />
      </div>

      {lessons.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-customer-charcoal">
            No lessons yet
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Add your first lesson to start building this mastercourse.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {lessons.map((lesson, index) => (
            <LessonEditorRow
              key={lesson.id}
              lesson={lesson}
              courseId={courseId}
              index={index}
              total={lessons.length}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
