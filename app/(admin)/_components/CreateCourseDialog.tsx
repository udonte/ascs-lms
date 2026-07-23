"use client";

import { useActionState, useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";

import { Modal } from "@/app/_components/Modal";
import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  createCourseAction,
  type CreateCourseActionState,
} from "@/lib/services/admin/courses/admin-course-actions";

const initialState: CreateCourseActionState = {};

const fieldClassName =
  "mt-1 w-full text-left rounded-lg border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-customer-gold focus:outline-none focus:ring-1 focus:ring-customer-gold";

type CreateCourseDialogProps = {
  triggerLabel?: string;
  triggerVariant?: "header" | "empty";
};

export function CreateCourseDialog({
  triggerLabel = "Create New Course",
  triggerVariant = "header",
}: CreateCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createCourseAction,
    initialState,
  );

  useActionStateToast(state);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  const triggerClassName =
    triggerVariant === "empty"
      ? "inline-flex items-center gap-2 rounded-lg cursor-pointer bg-customer-gold px-6 py-3 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90"
      : "inline-flex items-center gap-2 rounded-lg cursor-pointer bg-customer-gold px-4 py-2.5 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90 focus:outline-none focus:ring-2 focus:ring-customer-gold focus:ring-offset-2";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        <HiOutlinePlus className="h-4 w-4" aria-hidden />
        {triggerLabel}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create New Course"
        description="Add a draft mastercourse. You can publish and add lessons after saving."
      >
        <form action={formAction} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="course-title"
              className="text-sm font-medium text-customer-charcoal"
            >
              Course Title
            </label>
            <input
              id="course-title"
              name="title"
              type="text"
              required
              placeholder="e.g. Foundations of Customer Success"
              className={fieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="course-description"
              className="text-sm font-medium text-customer-charcoal"
            >
              Description
            </label>
            <textarea
              id="course-description"
              name="description"
              rows={4}
              placeholder="What will learners achieve in this course?"
              className={fieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="course-price"
              className="text-sm font-medium text-neutral-800"
            >
              Price ($ / USD)
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                $
              </span>
              <input
                id="course-price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={0}
                placeholder="35000"
                className={`${fieldClassName} pl-8`}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Enter 0 for a free course.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-customer-teal px-4 py-2 text-sm font-semibold text-customer-cream transition hover:bg-customer-teal/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
