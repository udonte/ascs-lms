"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

import { Modal } from "@/app/_components/Modal";
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

const initialState: SaveQuizActionState = {};

export type QuizCourseOption = {
  id: string;
  title: string;
};

type QuizFormDialogProps = {
  open: boolean;
  onClose: () => void;
  courses: QuizCourseOption[];
  quiz?: AdminQuizRow | null;
};

function createEmptyQuestion(): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

function cloneQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: [...question.options],
  }));
}

export function QuizFormDialog({
  open,
  onClose,
  courses,
  quiz,
}: QuizFormDialogProps) {
  const router = useRouter();
  const isEditing = Boolean(quiz);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    createEmptyQuestion(),
  ]);
  const [state, formAction, pending] = useActionState(
    saveQuizAction,
    initialState,
  );

  useActionStateToast(state);

  useEffect(() => {
    if (!open) return;

    if (quiz) {
      setTitle(quiz.title);
      setCourseId(quiz.course_id);
      setPassingScore(quiz.passing_score);
      setQuestions(
        quiz.questions.length > 0
          ? cloneQuestions(quiz.questions)
          : [createEmptyQuestion()],
      );
      return;
    }

    setTitle("");
    setCourseId(courses[0]?.id ?? "");
    setPassingScore(70);
    setQuestions([createEmptyQuestion()]);
  }, [open, quiz, courses]);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  const questionsJson = useMemo(() => JSON.stringify(questions), [questions]);

  const updateQuestion = (questionId: string, patch: Partial<QuizQuestion>) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createEmptyQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((current) =>
      current.length === 1
        ? current
        : current.filter((question) => question.id !== questionId),
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit quiz" : "Build new quiz"}
      description="Link an assessment to a course and define multiple-choice questions."
      size="xl"
    >
      {courses.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Create at least one course before building a quiz.
        </p>
      ) : (
        <form action={formAction} className="space-y-6 text-left">
          <input type="hidden" name="questionsJson" value={questionsJson} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="quiz-title"
                className="text-sm font-medium text-customer-charcoal"
              >
                Quiz title
              </label>
              <input
                id="quiz-title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Customer Success Foundations Assessment"
                className={adminFieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="quiz-course"
                className="text-sm font-medium text-customer-charcoal"
              >
                Course
              </label>
              <select
                id="quiz-course"
                name="courseId"
                required
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                disabled={isEditing}
                className={adminFieldClassName}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {isEditing ? (
                <p className="mt-1 text-xs text-neutral-500">
                  Course link is fixed after creation (one quiz per course).
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="quiz-passing-score"
                className="text-sm font-medium text-customer-charcoal"
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
                onChange={(event) =>
                  setPassingScore(Number(event.target.value))
                }
                className={adminFieldClassName}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-customer-teal">
                Questions
              </h3>
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

                <label className="text-sm font-medium text-customer-charcoal">
                  Question text
                </label>
                <input
                  type="text"
                  required
                  value={question.questionText}
                  onChange={(event) =>
                    updateQuestion(question.id, {
                      questionText: event.target.value,
                    })
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
                        onChange={(event) =>
                          updateOption(
                            question.id,
                            optionIndex,
                            event.target.value,
                          )
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

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
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
              {pending ? "Saving…" : isEditing ? "Save changes" : "Create quiz"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
