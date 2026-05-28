"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { HiOutlineUserAdd } from "react-icons/hi";

import { Modal } from "@/app/_components/Modal";
import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  grantManualAccessAction,
  type GrantManualAccessActionState,
} from "@/lib/services/admin/students/ledger-actions";
import { adminFieldClassName } from "./admin-form-styles";

const initialState: GrantManualAccessActionState = {};

export type LedgerCourseOption = {
  id: string;
  title: string;
  price: number;
};

type GrantManualAccessDialogProps = {
  courses: LedgerCourseOption[];
};

export function GrantManualAccessDialog({
  courses,
}: GrantManualAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses[0]?.id ?? "",
  );
  const [state, formAction, pending] = useActionState(
    grantManualAccessAction,
    initialState,
  );

  useActionStateToast(state);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const defaultAmount = selectedCourse?.price ?? 0;

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={courses.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-customer-gold px-4 py-2.5 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <HiOutlineUserAdd className="h-4 w-4" aria-hidden />
        Grant Manual Access
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Grant Manual Access"
        description="Enroll a student immediately for offline payments or bank transfers."
        size="lg"
      >
        {courses.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Create at least one course before granting manual access.
          </p>
        ) : (
          <form action={formAction} className="space-y-4 text-left">
            <div>
              <label
                htmlFor="student-email"
                className="text-sm font-medium text-customer-charcoal"
              >
                Student email
              </label>
              <input
                id="student-email"
                name="studentEmail"
                type="email"
                required
                placeholder="student@example.com"
                className={adminFieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="course-id"
                className="text-sm font-medium text-customer-charcoal"
              >
                Course
              </label>
              <select
                id="course-id"
                name="courseId"
                required
                value={selectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
                className={adminFieldClassName}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount-paid"
                className="text-sm font-medium text-customer-charcoal"
              >
                Amount received (₦)
              </label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                  ₦
                </span>
                <input
                  id="amount-paid"
                  name="amountPaid"
                  type="number"
                  min={0}
                  step={1}
                  key={selectedCourseId}
                  defaultValue={defaultAmount}
                  className={`${adminFieldClassName} pl-8`}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Defaults to the course price. Enter 0 for complimentary access.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-customer-teal px-4 py-2 text-sm font-semibold text-customer-cream hover:bg-customer-teal/90 disabled:opacity-60"
              >
                {pending ? "Granting…" : "Grant access"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
