"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
} from "react-icons/hi";

import { ConfirmDialog } from "@/app/_components/ConfirmDialog";
import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  deleteLessonAction,
  reorderLessonFormAction,
  updateLessonAction,
  type EditorActionState,
} from "@/lib/services/admin/courses/admin-course-editor-actions";
import type { AdminLesson } from "@/lib/services/admin/courses/admin-course-service";
import { adminFieldClassName } from "./admin-form-styles";

const initialState: EditorActionState = {};

type LessonEditorRowProps = {
  lesson: AdminLesson;
  courseId: string;
  index: number;
  total: number;
};

export function LessonEditorRow({
  lesson,
  courseId,
  index,
  total,
}: LessonEditorRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    updateLessonAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteLessonAction,
    initialState,
  );

  useActionStateToast(updateState);
  useActionStateToast(deleteState);

  useEffect(() => {
    if (deleteState.success) setDeleteOpen(false);
  }, [deleteState.success]);

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.set("courseId", courseId);
    formData.set("lessonId", lesson.id);
    startTransition(() => {
      deleteAction(formData);
    });
  };

  return (
    <li className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-customer-purple/10 text-sm font-bold text-customer-purple">
          {index + 1}
        </span>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="font-semibold text-customer-charcoal">{lesson.title}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {lesson.video_url ? "Video linked" : "No video yet"}
            {lesson.content_body ? " · Has content" : ""}
          </p>
        </button>

        <div className="flex items-center gap-1">
          <form action={reorderLessonFormAction}>
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={index === 0}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
              aria-label="Move lesson up"
            >
              <HiOutlineChevronUp className="h-5 w-5" />
            </button>
          </form>
          <form action={reorderLessonFormAction}>
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={index === total - 1}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
              aria-label="Move lesson down"
            >
              <HiOutlineChevronDown className="h-5 w-5" />
            </button>
          </form>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50 cursor-pointer ml-2"
            aria-label="Delete lesson"
          >
            <HiOutlineTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete lesson?"
        description={`"${lesson.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete lesson"
        cancelLabel="Cancel"
        pending={deletePending}
        variant="danger"
      />

      {expanded ? (
        <form
          action={updateAction}
          className="space-y-4 border-t border-neutral-100 px-4 py-4 text-left"
        >
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lesson.id} />

          <div>
            <label className="text-sm font-medium text-customer-charcoal">
              Lesson title
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={lesson.title}
              className={adminFieldClassName}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-customer-charcoal">
              Video URL
            </label>
            <input
              name="video_url"
              type="url"
              defaultValue={lesson.video_url ?? ""}
              className={adminFieldClassName}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-customer-charcoal">
              Lesson content
            </label>
            <textarea
              name="content_body"
              rows={4}
              defaultValue={lesson.content_body ?? ""}
              className={adminFieldClassName}
            />
          </div>

          <button
            type="submit"
            disabled={updatePending}
            className="rounded-lg bg-customer-teal px-4 py-2 text-sm font-semibold text-customer-cream hover:bg-customer-teal/90 disabled:opacity-60 cursor-pointer"
          >
            {updatePending ? "Saving…" : "Save lesson"}
          </button>
        </form>
      ) : null}
    </li>
  );
}
