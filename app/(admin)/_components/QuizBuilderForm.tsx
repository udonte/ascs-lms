"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

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
  quiz?: AdminQuizRow | null; // null / undefined = create mode
};

const initialState: SaveQuizActionState = {};

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

  // Redirect back to quiz list on success
  useEffect(() => {
    if (state.success) {
      router.push("/admin/quizzes");
    }
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

  const addQuestion = () =>
    setQuestions((prev) => [...prev, createEmptyQuestion()]);

  const removeQuestion = (id: string) =>
    setQuestions((prev) =>
      prev.length === 1 ? prev : prev.filter((q) => q.id !== id),
    );

  if (courses.length === 0) {
    return (
      <p className="rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center text-sm text-neutral-600 shadow-sm">
        Create at least one course before building a quiz.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <form action={formAction} className="space-y-6 p-6">
        <input type="hidden" name="questionsJson" value={questionsJson} />

        {/* Meta fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="quiz-title"
              className="mb-1 block text-sm font-medium text-customer-charcoal"
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

          <div>
            <label
              htmlFor="quiz-course"
              className="mb-1 block text-sm font-medium text-customer-charcoal"
            >
              Course
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
              <p className="mt-1 text-xs text-neutral-500">
                Course link is fixed after creation (one quiz per course).
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quiz-passing-score"
              className="mb-1 block text-sm font-medium text-customer-charcoal"
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
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-customer-teal">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 rounded-lg border border-customer-teal px-3 py-1.5 text-xs font-semibold text-customer-teal hover:bg-customer-teal hover:text-customer-cream"
            >
              <HiOutlinePlus className="h-4 w-4" aria-hidden />
              Add question
            </button>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-customer-charcoal">
                  Question {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  disabled={questions.length === 1}
                  className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-30"
                  aria-label={`Remove question ${index + 1}`}
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>

              <label className="mb-1 block text-sm font-medium text-customer-charcoal">
                Question text
              </label>
              <input
                type="text"
                required
                value={question.questionText}
                onChange={(e) =>
                  updateQuestion(question.id, { questionText: e.target.value })
                }
                placeholder="What is the primary goal of Customer Success?"
                className={adminFieldClassName}
              />

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-customer-charcoal">
                  Answer options
                </p>
                {question.options.map((option, optionIndex) => (
                  <div
                    key={`${question.id}-option-${optionIndex}`}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctOptionIndex === optionIndex}
                      onChange={() =>
                        updateQuestion(question.id, {
                          correctOptionIndex: optionIndex,
                        })
                      }
                      className="h-4 w-4 text-customer-teal focus:ring-customer-gold"
                      aria-label={`Mark option ${optionIndex + 1} as correct`}
                    />
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) =>
                        updateOption(question.id, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className={adminFieldClassName}
                    />
                  </div>
                ))}
                <p className="text-xs text-neutral-500">
                  Select the radio button next to the correct answer.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={pending}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-customer-teal px-6 py-2 text-sm font-semibold text-customer-cream hover:bg-customer-teal/90 disabled:opacity-60"
          >
            {pending ? "Saving…" : isEditing ? "Save changes" : "Create quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
