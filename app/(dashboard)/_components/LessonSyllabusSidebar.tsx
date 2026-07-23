"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineAcademicCap,
  HiOutlineExclamationCircle,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

import type {
  QuizAttempt,
  SyllabusLesson,
} from "@/lib/services/student-course-service";

type LessonSyllabusSidebarProps = {
  courseId: string;
  courseTitle: string;
  syllabus: SyllabusLesson[];
  completedLessonIds: string[];
  activeLessonId: string;
  quizUnlocked: boolean;
  quizHref: string;
  activeMode: "lesson" | "quiz";
  quizAttempt?: QuizAttempt | null;
};

export function LessonSyllabusSidebar({
  courseId,
  courseTitle,
  syllabus,
  completedLessonIds,
  activeLessonId,
  quizUnlocked,
  quizHref,
  activeMode,
  quizAttempt,
}: LessonSyllabusSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const completedSet = new Set(completedLessonIds);
  const completedCount = completedLessonIds.length;
  const totalCount = syllabus.length;

  return (
    <aside className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
        {/* Mobile Accordion Toggle Header */}
        <div className="flex items-center justify-between lg:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
              {courseTitle}
            </p>
            <h2 className="mt-0.5 text-xs lg:text-sm font-medium text-customer-charcoal lg:mt-1 italic">
              Course Contents ({completedCount}/{totalCount})
            </h2>
          </div>

          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-customer-teal hover:bg-neutral-100 lg:hidden"
            aria-expanded={isMobileOpen}
          >
            <span>{isMobileOpen ? "Hide Modules" : "View Modules"}</span>
            {isMobileOpen ? (
              <HiChevronUp className="h-4 w-4" />
            ) : (
              <HiChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Syllabus Navigation - always visible on desktop lg:, collapsible on mobile */}
        <nav
          className={`mt-4 space-y-1 ${
            isMobileOpen ? "block" : "hidden lg:block"
          }`}
          aria-label="Course syllabus"
        >
          {syllabus.map((item, index) => {
            const isActive = item.id === activeLessonId;
            const isComplete = completedSet.has(item.id);
            const href = `/dashboard/courses/${courseId}/lessons/${item.id}`;

            return (
              <Link
                key={item.id}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-customer-teal/10 font-semibold text-customer-teal ring-1 ring-customer-teal/30"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {isComplete ? (
                  <HiOutlineCheckCircle
                    className="h-5 w-5 shrink-0 text-emerald-600"
                    aria-label="Completed"
                  />
                ) : (
                  <span
                    className="h-5 w-5 shrink-0 rounded-full border-2 border-neutral-300"
                    aria-hidden
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="text-xs text-neutral-400">
                    Lesson {index + 1}
                  </span>
                  <span className="mt-0.5 block line-clamp-2">
                    {item.title}
                  </span>
                </span>
              </Link>
            );
          })}

          <div className="my-4 h-px w-full bg-neutral-100" />

          {quizUnlocked ? (
            <Link
              href={quizHref}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                activeMode === "quiz"
                  ? "bg-customer-gold/15 font-semibold text-customer-charcoal ring-1 ring-customer-gold/40"
                  : "text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              {quizAttempt?.passed ? (
                <HiOutlineCheckCircle
                  className="h-5 w-5 shrink-0 text-emerald-600"
                  aria-label="Assessment passed"
                />
              ) : quizAttempt ? (
                <HiOutlineExclamationCircle
                  className="h-5 w-5 shrink-0 text-amber-600"
                  aria-label="Assessment attempted"
                />
              ) : (
                <HiOutlineAcademicCap
                  className="h-5 w-5 shrink-0 text-customer-gold"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="text-xs text-neutral-400">
                  🏆 Final Assessment
                  {quizAttempt?.passed
                    ? " • Passed"
                    : quizAttempt
                      ? " • Attempted"
                      : ""}
                </span>
                <span className="mt-0.5 block line-clamp-2">
                  Final Assessment Module
                </span>
              </span>
            </Link>
          ) : (
            <div
              title="Complete all curriculum course videos to unlock final assessment exam."
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-3 text-sm text-neutral-400"
            >
              <HiOutlineLockClosed className="h-5 w-5 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="text-xs text-neutral-400">
                  🏆 Final Assessment
                </span>
                <span className="mt-0.5 block line-clamp-2">
                  Final Assessment Module
                </span>
              </span>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
