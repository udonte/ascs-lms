"use client";

import { useActionState, useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";

import { Modal } from "@/app/_components/Modal";
import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  createLessonAction,
  type EditorActionState,
} from "@/lib/services/admin/courses/admin-course-editor-actions";
import { adminFieldClassName } from "./admin-form-styles";

const initialState: EditorActionState = {};

type AddLessonDialogProps = {
  courseId: string;
};

export function AddLessonDialog({ courseId }: AddLessonDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createLessonAction,
    initialState,
  );

  useActionStateToast(state);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-customer-gold px-4 py-2 text-sm font-semibold text-customer-charcoal shadow-sm transition hover:bg-customer-gold/90 cursor-pointer"
      >
        <HiOutlinePlus className="h-4 w-4" aria-hidden />
        Add lesson
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add lesson"
        description="Lessons appear in the order you add them. Reorder anytime."
      >
        <form action={formAction} className="space-y-4 text-left">
          <input type="hidden" name="courseId" value={courseId} />

          <div>
            <label
              htmlFor="lesson-title"
              className="text-sm font-medium text-customer-charcoal"
            >
              Lesson title
            </label>
            <input
              id="lesson-title"
              name="title"
              type="text"
              required
              placeholder="e.g. Introduction to Customer Success"
              className={adminFieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="lesson-video"
              className="text-sm font-medium text-customer-charcoal"
            >
              Video URL (YouTube / Vimeo)
            </label>
            <input
              id="lesson-video"
              name="video_url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className={adminFieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="lesson-content"
              className="text-sm font-medium text-customer-charcoal"
            >
              Lesson content
            </label>
            <textarea
              id="lesson-content"
              name="content_body"
              rows={5}
              placeholder="Notes, resources, or transcript for this lesson…"
              className={adminFieldClassName}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-customer-teal px-4 py-2 text-sm font-semibold text-customer-cream hover:bg-customer-teal/90 disabled:opacity-60"
            >
              {pending ? "Adding…" : "Add lesson"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
