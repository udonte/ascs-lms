"use client";

import { useState, useTransition } from "react";
import { HiOutlineTrash, HiOutlineExclamation } from "react-icons/hi";

import { Modal } from "@/app/_components/Modal";
import { deleteCourseAction } from "@/lib/services/admin/courses/admin-course-editor-actions";

type DeleteCourseButtonProps = {
  courseId: string;
  courseTitle: string;
};

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: DeleteCourseButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteCourseAction(courseId);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
      >
        <HiOutlineTrash className="h-4 w-4" aria-hidden />
        Delete course
      </button>

      <Modal
        open={open}
        onClose={() => !isPending && setOpen(false)}
        title="Delete course"
        description="This action is permanent and cannot be undone."
      >
        <div className="space-y-5">
          {/* Warning icon + message */}
          <div className="flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <HiOutlineExclamation className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">
                You are about to delete &ldquo;{courseTitle}&rdquo;
              </p>
              <p className="mt-1 text-sm text-red-700">
                This will permanently remove:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-red-600">
                <li>• All lessons and their content</li>
                <li>• All student enrollments</li>
                <li>• All quiz attempts and quiz data</li>
                <li>• All issued certificates for this course</li>
                <li>• All student progress records</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center w-full gap-3 border-t border-neutral-100 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 w-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 w-full"
            >
              <HiOutlineTrash className="h-4 w-4" aria-hidden />
              {isPending ? "Deleting…" : "Yes, delete course"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
