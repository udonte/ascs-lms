"use server";

import { revalidatePath } from "next/cache";

import {
  parseQuizQuestions,
  QuizService,
  type QuizQuestion,
} from "./quiz-service";

export type SaveQuizActionState = {
  error?: string;
  success?: string;
};

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateQuestions(raw: unknown): QuizQuestion[] | null {
  const questions = parseQuizQuestions(raw).filter(
    (question) => question.questionText.length > 0,
  );

  if (questions.length === 0) return null;

  for (const question of questions) {
    const filledOptions = question.options.filter((option) => option.length > 0);
    if (filledOptions.length < 4) return null;
    if (question.correctOptionIndex < 0 || question.correctOptionIndex > 3) {
      return null;
    }
    if (!question.options[question.correctOptionIndex]?.trim()) return null;
  }

  return questions;
}

export async function saveQuizAction(
  _prevState: SaveQuizActionState,
  formData: FormData,
): Promise<SaveQuizActionState> {
  const courseId = readField(formData, "courseId");
  const title = readField(formData, "title");
  const passingScoreRaw = readField(formData, "passingScore");
  const questionsRaw = readField(formData, "questionsJson");

  if (!title) return { error: "Quiz title is required." };
  if (!courseId) return { error: "Select a course." };

  const passingScore = passingScoreRaw === "" ? 70 : Number(passingScoreRaw);
  if (Number.isNaN(passingScore) || passingScore < 0 || passingScore > 100) {
    return { error: "Passing score must be between 0 and 100." };
  }

  let parsedQuestions: unknown = [];
  try {
    parsedQuestions = JSON.parse(questionsRaw || "[]");
  } catch {
    return { error: "Invalid quiz questions payload." };
  }

  const questions = validateQuestions(parsedQuestions);
  if (!questions) {
    return {
      error:
        "Add at least one question with text, four options, and a correct answer.",
    };
  }

  try {
    await QuizService.saveQuiz(courseId, title, passingScore, questions);
    revalidatePath("/admin/quizzes");
    return { success: "Quiz saved successfully." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save quiz.",
    };
  }
}
