"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { HiOutlineArrowLeft, HiOutlineLockClosed } from "react-icons/hi";

import type { CourseQuiz } from "@/lib/services/student-course-service";
import { submitQuizScoreAction } from "@/lib/services/student-course-actions";
import { notifyError, notifySuccess } from "@/lib/toast";

type ClassroomQuizPanelProps = {
  courseId: string;
  quiz: CourseQuiz;
  isUnlocked: boolean;
  onExitHref: string;
};

export function ClassroomQuizPanel({
  courseId,
  quiz,
  isUnlocked,
  onExitHref,
}: ClassroomQuizPanelProps) {
  const [pending, startTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    passingScore: number;
  } | null>(null);

  const total = quiz.questions.length;
  const current = quiz.questions[index];

  const selectedIndex = current ? answers[current.id] : undefined;
  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  if (!isUnlocked) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-neutral-700">
          <HiOutlineLockClosed className="h-6 w-6 text-neutral-400" aria-hidden />
          <div>
            <h2 className="text-lg font-bold text-customer-charcoal">
              Final Assessment Locked
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Complete all curriculum course videos to unlock final assessment
              exam.
            </p>
          </div>
        </div>
        <Link
          href={onExitHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to lessons
        </Link>
      </section>
    );
  }

  if (result) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-customer-purple/10 via-transparent to-customer-gold/15" />
        <div className="relative">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                result.passed ? "bg-customer-gold/20 text-customer-gold" : "bg-amber-100 text-amber-700"
              }`}
            >
              <FaStar className="h-7 w-7" aria-hidden />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-customer-purple">
              {result.passed ? "Congratulations, You Passed!" : "Assessment Result"}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Your score is{" "}
              <span className="font-semibold text-neutral-900">{result.score}%</span>
              . Passing score is {result.passingScore}%.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              {result.passed ? (
                <Link
                  href="/dashboard/certificates"
                  className="inline-flex items-center justify-center rounded-xl bg-customer-teal px-6 py-3 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90"
                >
                  Go to Certificates
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setIndex(0);
                    setAnswers({});
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600/90"
                >
                  Retake Assessment
                </button>
              )}

              <Link
                href={onExitHref}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Back to lessons
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
            Final Assessment
          </p>
          <h2 className="mt-2 text-xl font-bold text-customer-charcoal">
            {quiz.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Question {index + 1} of {total} • Answered {answeredCount}/{total}
          </p>
        </div>
        <Link
          href={onExitHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-customer-teal transition hover:text-customer-purple"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Exit quiz
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-lg font-semibold text-neutral-900">
          {current.questionText}
        </p>

        <div className="mt-6 space-y-3">
          {current.options.map((option, optionIndex) => {
            const checked = selectedIndex === optionIndex;
            return (
              <label
                key={optionIndex}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  checked
                    ? "border-customer-teal bg-customer-teal/5 ring-4 ring-customer-teal/10"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${current.id}`}
                  checked={checked}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }))
                  }
                  className="mt-1 h-4 w-4 accent-customer-teal"
                />
                <span className="flex-1 text-neutral-800">{option}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0 || pending}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>

          {index < total - 1 ? (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(i + 1, total - 1))}
              disabled={pending || selectedIndex == null}
              className="inline-flex items-center justify-center rounded-xl bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || Object.keys(answers).length !== total}
              onClick={() => {
                startTransition(async () => {
                  try {
                    const res = await submitQuizScoreAction(courseId, answers);
                    setResult(res);
                    notifySuccess(
                      res.passed
                        ? "You passed! Your certificate is now unlocked."
                        : "Quiz submitted. Review your score and try again.",
                    );
                  } catch (error) {
                    notifyError(
                      error instanceof Error
                        ? error.message
                        : "Failed to submit quiz.",
                    );
                  }
                });
              }}
              className="inline-flex items-center justify-center rounded-xl bg-customer-gold px-5 py-2.5 text-sm font-semibold text-customer-charcoal shadow-sm transition hover:bg-customer-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Submit Assessment"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

