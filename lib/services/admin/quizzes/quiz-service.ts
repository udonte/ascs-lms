import { createClient } from "@/lib/supabase/server";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

type QuizCourseJoin = { title: string };

export type AdminQuizRow = {
  id: string;
  course_id: string;
  title: string;
  passing_score: number;
  questions: QuizQuestion[];
  courseTitle: string;
  questionCount: number;
};

function embedOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function parseQuizQuestions(raw: unknown): QuizQuestion[] {
  if (!raw) return [];

  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const options = Array.isArray(row.options)
        ? row.options.map((option) => String(option ?? "").trim())
        : [];

      while (options.length < 4) options.push("");

      const correctOptionIndex =
        typeof row.correctOptionIndex === "number"
          ? row.correctOptionIndex
          : Number(row.correctOptionIndex ?? 0);

      return {
        id:
          typeof row.id === "string" && row.id
            ? row.id
            : `question-${index + 1}`,
        questionText: String(row.questionText ?? "").trim(),
        options: options.slice(0, 4),
        correctOptionIndex: Number.isFinite(correctOptionIndex)
          ? Math.min(Math.max(correctOptionIndex, 0), 3)
          : 0,
      } satisfies QuizQuestion;
    })
    .filter((item): item is QuizQuestion => item !== null);
}

function normalizeQuizRow(row: {
  id: string;
  course_id: string;
  title: string | null;
  passing_score: number | null;
  questions: unknown;
  course: QuizCourseJoin | QuizCourseJoin[] | null;
}): AdminQuizRow {
  const course = embedOne(row.course);
  const questions = parseQuizQuestions(row.questions);

  return {
    id: row.id,
    course_id: row.course_id,
    title: row.title?.trim() || "Untitled quiz",
    passing_score: row.passing_score ?? 70,
    questions,
    courseTitle: course?.title?.trim() || "Unknown course",
    questionCount: questions.length,
  };
}

async function assertStaff(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const role = await getProfileRole(supabase, user.id);
  if (!canAccessAdminRoute(role)) {
    throw new Error("Only admins and instructors can manage quizzes.");
  }

  return user;
}

export const QuizService = {
  /**
   * Fetches all quizzes alongside their parent course title.
   */
  async getAllQuizzesForAdmin(): Promise<AdminQuizRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        course_id,
        title,
        passing_score,
        questions,
        course:courses(title)
      `,
      )
      .order("title", { ascending: true });

    if (error) {
      console.error("Error fetching quizzes:", error.message);
      return [];
    }

    return (data ?? []).map(normalizeQuizRow);
  },

  /**
   * Creates or updates a quiz for a specific course (one quiz per course).
   */
  async saveQuiz(
    courseId: string,
    title: string,
    passingScore: number,
    questions: QuizQuestion[],
  ) {
    const supabase = await createClient();
    await assertStaff(supabase);

    const { data, error } = await supabase
      .from("quizzes")
      .upsert(
        {
          course_id: courseId,
          title,
          passing_score: passingScore,
          questions,
        },
        { onConflict: "course_id" },
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  /**
   * Returns true if at least one quiz row exists for the given course.
   */
  async courseHasQuiz(courseId: string): Promise<boolean> {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId);

    if (error) {
      console.error("Error checking quiz existence:", error.message);
      return false;
    }

    return (count ?? 0) > 0;
  },
};
