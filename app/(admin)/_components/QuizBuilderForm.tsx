"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { MdOutlineQuiz } from "react-icons/md";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  saveQuizAction,
  type SaveQuizActionState,
} from "@/lib/services/admin/quizzes/quiz-actions";
import type {
  AdminQuizRow,
  QuizQuestion,
} from "@/lib/services/admin/quizzes/quiz-service";
import { adminFieldClassName } from "./admin-form-styles";

export type QuizCourseOption = { id: string; title: string };

type QuizBuilderFormProps = {
  courses: QuizCourseOption[];
  quiz?: AdminQuizRow | null;
};

const initialState: SaveQuizActionState = {};

const OPTION_LABELS = ["A", "B", "C", "D"];

function createEmptyQuestion(): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

function cloneQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((q) => ({ ...q, options: [...q.options] }));
}

export function QuizBuilderForm({ courses, quiz }: QuizBuilderFormProps) {
  const router = useRouter();
  const isEditing = Boolean(quiz);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const [title, setTitle] = useState(quiz?.title ?? "");
  const [courseId, setCourseId] = useState(
    quiz?.course_id ?? courses[0]?.id ?? "",
  );
  const [passingScore, setPassingScore] = useState(quiz?.passing_score ?? 70);
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz?.questions && quiz.questions.length > 0
      ? cloneQuestions(quiz.questions)
      : [createEmptyQuestion()],
  );

  const [state, formAction, pending] = useActionState(
    saveQuizAction,
    initialState,
  );

  useActionStateToast(state);

  useEffect(() => {
    if (state.success) router.push("/admin/quizzes");
  }, [state.success, router]);

  const questionsJson = useMemo(() => JSON.stringify(questions), [questions]);

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );

  const updateOption = (id: string, idx: number, value: string) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const options = [...q.options];
        options[idx] = value;
        return { ...q, options };
      }),
    );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
    // Scroll to the add button after React re-renders
    setTimeout(() => {
      addButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const removeQuestion = (id: string) =>
    setQuestions((prev) =>
      prev.length === 1 ? prev : prev.filter((q) => q.id !== id),
    );

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center shadow-sm">
        <MdOutlineQuiz className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Create at least one course before building a quiz.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-4xl space-y-6">
      <input type="hidden" name="questionsJson" value={questionsJson} />

      {/* ── Meta card ───────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Quiz Details
          </h2>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label
              htmlFor="quiz-title"
              className="mb-1.5 block text-sm font-semibold text-customer-charcoal"
            >
              Quiz title
            </label>
            <input
              id="quiz-title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Success Foundations Assessment"
              className={adminFieldClassName}
            />
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="quiz-course"
              className="mb-1.5 block text-sm font-semibold text-customer-charcoal"
            >
              Linked course
            </label>
            <select
              id="quiz-course"
              name="courseId"
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={isEditing}
              className={adminFieldClassName}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {isEditing && (
              <p className="mt-1.5 text-xs text-neutral-400">
                Course is locked after creation (one quiz per course).
              </p>
            )}
          </div>

          {/* Passing score */}
          <div>
            <label
              htmlFor="quiz-passing-score"
              className="mb-1.5 block text-sm font-semibold text-customer-charcoal"
            >
              Passing score (%)
            </label>
            <input
              id="quiz-passing-score"
              name="passingScore"
              type="number"
              min={0}
              max={100}
              required
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className={adminFieldClassName}
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Students must score at least {passingScore}% to pass.
            </p>
          </div>
        </div>
      </section>

      {/* ── Questions card ──────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Section header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Questions
            </h2>
            <p className="mt-0.5 text-xs text-neutral-400">
              {questions.length} question{questions.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {questions.map((question, index) => (
            <div key={question.id} className="p-6">
              {/* Question header */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-customer-teal text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-customer-charcoal">
                    Question {index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Remove question ${index + 1}`}
                >
                  <HiOutlineTrash className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>

              {/* Question text */}
              <div className="mb-5">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={question.questionText}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      questionText: e.target.value,
                    })
                  }
                  placeholder="e.g. What is the primary goal of Customer Success?"
                  className={adminFieldClassName}
                />
              </div>

              {/* Options */}
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Answer options — click the radio to mark the correct one
                </p>
                <div className="space-y-2.5">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect =
                      question.correctOptionIndex === optionIndex;
                    return (
                      <label
                        key={`${question.id}-option-${optionIndex}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                          isCorrect
                            ? "border-customer-teal/40 bg-customer-teal/5 ring-1 ring-customer-teal/20"
                            : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={isCorrect}
                          onChange={() =>
                            updateQuestion(question.id, {
                              correctOptionIndex: optionIndex,
                            })
                          }
                          className="h-4 w-4 accent-customer-teal"
                          aria-label={`Mark option ${OPTION_LABELS[optionIndex]} as correct`}
                        />
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            isCorrect
                              ? "bg-customer-teal text-white"
                              : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          {OPTION_LABELS[optionIndex]}
                        </span>
                        <input
                          type="text"
                          required
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              question.id,
                              optionIndex,
                              e.target.value,
                            )
                          }
                          placeholder={`Option ${OPTION_LABELS[optionIndex]}`}
                          className="min-w-0 flex-1 bg-transparent text-sm text-customer-charcoal placeholder-neutral-400 outline-none"
                        />
                        {isCorrect && (
                          <span className="shrink-0 rounded-full bg-customer-teal/15 px-2 py-0.5 text-xs font-semibold text-customer-teal">
                            Correct
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* ── Add question button — always right after the last question ── */}
          <div className="flex justify-center px-6 py-5">
            <button
              ref={addButtonRef}
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-customer-teal/40 px-6 py-3 text-sm font-semibold text-customer-teal transition hover:border-customer-teal hover:bg-customer-teal/5 active:scale-95 cursor-pointer"
            >
              <HiOutlinePlus className="h-4 w-4" aria-hidden />
              Add question
            </button>
          </div>
        </div>
      </section>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={pending}
          className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-customer-teal px-7 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:opacity-60 cursor-pointer"
        >
          {pending ? "Saving…" : isEditing ? "Save changes" : "Create quiz"}
        </button>
      </div>
    </form>
  );
}
