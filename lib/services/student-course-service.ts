import { createClient } from "@/lib/supabase/server";

export type SyllabusLesson = {
  id: string;
  title: string;
  order_index: number;
};

export type LessonDetail = {
  id: string;
  course_id: string;
  title: string;
  video_url: string | null;
  content_body: string | null;
  order_index: number;
};

export type LessonContext = {
  courseId: string;
  courseTitle: string;
  lesson: LessonDetail;
  syllabus: SyllabusLesson[];
  completedLessonIds: string[];
  nextLessonId: string | null;
};

export type CourseDetails = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
};

export type CourseResumeContext = {
  course: CourseDetails;
  syllabus: SyllabusLesson[];
  completedLessonIds: string[]; // only lessons in this course
  resumeLessonId: string;
  progressPercent: number; // 0..100
  isCourseFullyViewed: boolean;
  quiz: CourseQuiz | null;
  quizAttempt: QuizAttempt | null;
};

export type CourseQuizQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
};

export type CourseQuiz = {
  courseId: string;
  title: string;
  passingScore: number;
  questions: CourseQuizQuestion[];
};

export type QuizAttempt = {
  score: number;
  passed: boolean;
  created_at: string;
};

export type ClassroomMode = "lesson" | "quiz";

export type ClassroomContext = {
  courseId: string;
  courseTitle: string;
  lesson: LessonDetail;
  syllabus: SyllabusLesson[];
  completedLessonIds: string[];
  isCourseFullyViewed: boolean;
  quiz: CourseQuiz | null;
  quizAttempt: QuizAttempt | null;
  nextLessonId: string | null;
};

/**
 * Parses common YouTube URL formats into an embed-safe iframe src.
 */
export function getYouTubeEmbedUrl(videoUrl: string | null): string | null {
  if (!videoUrl?.trim()) return null;

  const url = videoUrl.trim();

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const watchId = parsed.searchParams.get("v");
      if (watchId) return `https://www.youtube.com/embed/${watchId}`;

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }
    }
  } catch {
    const fallbackMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    );
    if (fallbackMatch?.[1]) {
      return `https://www.youtube.com/embed/${fallbackMatch[1]}`;
    }
  }

  return null;
}

function getNextLessonId(
  syllabus: SyllabusLesson[],
  currentLessonId: string,
): string | null {
  const index = syllabus.findIndex((item) => item.id === currentLessonId);
  if (index === -1 || index >= syllabus.length - 1) return null;
  return syllabus[index + 1]?.id ?? null;
}

async function assertPaidEnrollment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  courseId: string,
) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", "paid")
    .maybeSingle();

  if (error || !data) {
    throw new Error("You do not have access to this course.");
  }
}

export const StudentCourseService = {
  async getFirstLessonId(courseId: string): Promise<string | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle();

    return data?.id ?? null;
  },

  async getLessonContext(
    courseId: string,
    lessonId: string,
  ): Promise<LessonContext | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data: course } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", courseId)
      .maybeSingle();

    if (!course) return null;

    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id, course_id, title, video_url, content_body, order_index")
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (lessonError || !lesson) return null;

    const { data: siblingLessons } = await supabase
      .from("lessons")
      .select("id, title, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    const syllabus = (siblingLessons ?? []) as SyllabusLesson[];

    const { data: progressRecords } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);

    const completedLessonIds =
      progressRecords?.map((record) => record.lesson_id) ?? [];

    return {
      courseId,
      courseTitle: course.title,
      lesson: lesson as LessonDetail,
      syllabus,
      completedLessonIds,
      nextLessonId: getNextLessonId(syllabus, lessonId),
    };
  },

  async getCourseResumeContext(
    courseId: string,
  ): Promise<CourseResumeContext | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data: course } = await supabase
      .from("courses")
      .select("id, title, description, thumbnail_url")
      .eq("id", courseId)
      .maybeSingle();

    if (!course) return null;

    const { data: syllabus } = await supabase
      .from("lessons")
      .select("id, title, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    const orderedSyllabus = (syllabus ?? []) as SyllabusLesson[];
    if (orderedSyllabus.length === 0) return null;

    const { data: progressRecords } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);

    const courseLessonIds = new Set(orderedSyllabus.map((lesson) => lesson.id));
    const completedLessonIds =
      progressRecords
        ?.map((record) => record.lesson_id)
        .filter((lessonId) => courseLessonIds.has(lessonId)) ?? [];

    const completedSet = new Set(completedLessonIds);

    const firstIncomplete = orderedSyllabus.find(
      (lesson) => !completedSet.has(lesson.id),
    );
    // Since we return only when there is at least one syllabus lesson,
    // orderedSyllabus[0] is guaranteed to exist.
    const resumeLessonId = firstIncomplete?.id ?? orderedSyllabus[0].id;

    const progressPercent =
      orderedSyllabus.length > 0
        ? Math.min(
            100,
            Math.round((completedSet.size / orderedSyllabus.length) * 100),
          )
        : 0;

    const isCourseFullyViewed =
      orderedSyllabus.length > 0 &&
      orderedSyllabus.every((lesson) => completedSet.has(lesson.id));

    const [quiz, quizAttempt] = await Promise.all([
      StudentCourseService.getCourseQuiz(courseId),
      StudentCourseService.getQuizAttempt(courseId),
    ]);

    return {
      course: course as CourseDetails,
      syllabus: orderedSyllabus,
      completedLessonIds,
      resumeLessonId,
      progressPercent,
      isCourseFullyViewed,
      quiz,
      quizAttempt,
    };
  },

  async getCourseQuiz(courseId: string): Promise<CourseQuiz | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Important: quizzes table currently has staff-only RLS by default.
    // Until student-facing select policy exists, the safest behavior is to
    // return null when select is denied.
    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from("quizzes")
      .select("course_id, title, passing_score, questions")
      .eq("course_id", courseId)
      .maybeSingle();

    if (error || !data) return null;

    // Reuse admin parsing logic shape (questions created by builder).
    const questions = Array.isArray(data.questions)
      ? (data.questions as CourseQuizQuestion[])
      : [];

    return {
      courseId: data.course_id,
      title: (data.title ?? "Final Assessment").trim(),
      passingScore: data.passing_score ?? 70,
      questions,
    };
  },

  async getQuizAttempt(courseId: string): Promise<QuizAttempt | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("score, passed, created_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error || !data) return null;
    return data as QuizAttempt;
  },

  async getClassroomContext(
    courseId: string,
    lessonId: string,
  ): Promise<ClassroomContext | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertPaidEnrollment(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data: course } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", courseId)
      .maybeSingle();
    if (!course) return null;

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, course_id, title, video_url, content_body, order_index")
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .maybeSingle();
    if (!lesson) return null;

    const { data: siblingLessons } = await supabase
      .from("lessons")
      .select("id, title, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });
    const syllabus = (siblingLessons ?? []) as SyllabusLesson[];

    const { data: progressRecords } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);
    const completedLessonIds =
      progressRecords?.map((record) => record.lesson_id) ?? [];
    const completedSet = new Set(completedLessonIds);

    const isCourseFullyViewed =
      syllabus.length > 0 && syllabus.every((row) => completedSet.has(row.id));

    const [quiz, quizAttempt] = await Promise.all([
      StudentCourseService.getCourseQuiz(courseId),
      StudentCourseService.getQuizAttempt(courseId),
    ]);

    return {
      courseId,
      courseTitle: course.title,
      lesson: lesson as LessonDetail,
      syllabus,
      completedLessonIds,
      isCourseFullyViewed,
      quiz,
      quizAttempt,
      nextLessonId: getNextLessonId(syllabus, lessonId),
    };
  },

  async submitQuizScore(
    courseId: string,
    selections: Record<string, number>,
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertPaidEnrollment(supabase, user.id, courseId);

    // Enforce unlock on server: must complete all lessons first.
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);
    const lessonIds = (lessons ?? []).map((l) => l.id);

    const { data: progressRecords } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);
    const completedSet = new Set(
      progressRecords?.map((record) => record.lesson_id) ?? [],
    );

    const isCourseFullyViewed =
      lessonIds.length > 0 && lessonIds.every((id) => completedSet.has(id));

    if (!isCourseFullyViewed) {
      throw new Error("Complete all lessons to unlock the final assessment.");
    }

    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("course_id, title, passing_score, questions")
      .eq("course_id", courseId)
      .maybeSingle();

    if (quizError || !quiz) {
      throw new Error("Final assessment is not available for this course yet.");
    }

    const questions = Array.isArray(quiz.questions)
      ? (quiz.questions as CourseQuizQuestion[])
      : [];
    if (questions.length === 0) {
      throw new Error("Final assessment has no questions configured yet.");
    }

    let correct = 0;
    for (const question of questions) {
      const selectedIndex = selections[question.id];
      if (selectedIndex === question.correctOptionIndex) {
        correct += 1;
      }
    }

    const score = Math.round((correct / questions.length) * 100);
    const passingScore = quiz.passing_score ?? 70;
    const passed = score >= passingScore;

    const { error } = await supabase.from("quiz_attempts").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        score,
        passed,
      },
      { onConflict: "user_id,course_id" },
    );

    if (error) throw new Error(error.message);

    return { score, passed, passingScore };
  },

  async completeLesson(lessonId: string, courseId: string) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertPaidEnrollment(supabase, user.id, courseId);

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, course_id")
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (!lesson) throw new Error("Lesson not found.");

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );

    if (error) throw new Error(error.message);

    const { data: syllabus } = await supabase
      .from("lessons")
      .select("id, title, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    const nextLessonId = getNextLessonId(
      (syllabus ?? []) as SyllabusLesson[],
      lessonId,
    );

    return { success: true as const, nextLessonId };
  },
};
