"use client";

import { useActionState } from "react";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  updateCourseAction,
  type EditorActionState,
} from "@/lib/services/admin/courses/admin-course-editor-actions";
import type { AdminCourseDetail } from "@/lib/services/admin/courses/admin-course-service";
import { ThumbnailUploadField } from "./ThumbnailUploadField";
import { adminFieldClassName } from "./admin-form-styles";

const initialState: EditorActionState = {};

type CourseSettingsFormProps = {
  course: AdminCourseDetail;
};

function parsePriceForInput(price: AdminCourseDetail["price"]): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

export function CourseSettingsForm({ course }: CourseSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateCourseAction,
    initialState,
  );
  useActionStateToast(state);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-customer-teal">Course settings</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Update metadata and publish when lessons are ready.
      </p>

      <form action={formAction} className="mt-6 space-y-4 text-left">
        <input type="hidden" name="courseId" value={course.id} />

        {/* Title */}
        <div>
          <label
            htmlFor="edit-title"
            className="text-sm font-medium text-customer-charcoal"
          >
            Course title
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            required
            defaultValue={course.title}
            className={adminFieldClassName}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="edit-description"
            className="text-sm font-medium text-customer-charcoal"
          >
            Description
          </label>
          <textarea
            id="edit-description"
            name="description"
            rows={4}
            defaultValue={course.description ?? ""}
            className={adminFieldClassName}
          />
        </div>

        {/* Price — USD */}
        <div>
          <label
            htmlFor="edit-price"
            className="text-sm font-medium text-customer-charcoal"
          >
            Price (USD)
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
              $
            </span>
            <input
              id="edit-price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={parsePriceForInput(course.price)}
              className={`${adminFieldClassName} pl-8`}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Set to 0 for free courses.
          </p>
        </div>

        {/* Thumbnail — file upload */}
        <ThumbnailUploadField
          currentUrl={course.thumbnail_url}
          courseId={course.id}
        />

        {/* Publish toggle */}
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={course.is_published}
            className="h-4 w-4 rounded border-neutral-300 text-customer-teal focus:ring-customer-gold"
          />
          <span className="text-sm font-medium text-customer-charcoal">
            Published — visible to students in the catalog
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-customer-teal px-4 py-2.5 text-sm font-semibold text-customer-cream transition hover:bg-customer-teal/90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save course settings"}
        </button>
      </form>
    </section>
  );
}
