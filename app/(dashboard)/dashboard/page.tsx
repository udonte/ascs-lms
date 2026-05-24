import { DashboardErrorToast } from "@/app/(dashboard)/_components/DashboardErrorToast";
import { createClient } from "@/lib/supabase/server";
import { listCoursesForDashboardUser } from "@/src/lib/services/course-service";
import { ensureUserProfile } from "@/src/lib/services/profile-service";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserProfile(supabase);
  }

  const { courses, error: coursesError } = user
    ? await listCoursesForDashboardUser(user.id)
    : { courses: [], error: null };

  return (
    <div className="mx-auto max-w-3xl">
      <DashboardErrorToast message={coursesError} />
      <h1 className="text-2xl font-semibold text-[#003366]">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Signed in as{" "}
        <span className="font-medium text-neutral-900">
          {user?.email ?? user?.id ?? "Unknown"}
        </span>
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[#003366]">Your courses</h2>
        {courses.length === 0 && !coursesError ? (
          <p className="mt-3 text-sm text-neutral-600">
            No enrolled courses yet. After Paystack checkout and webhook
            enrollment, your courses will appear here.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {courses.map((course) => (
              <li
                key={course.enrollmentId ?? course.courseId}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {course.title}
                    </h3>
                    {course.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                        {course.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-neutral-500">
                      Instructor: {course.instructorId.slice(0, 8)}…
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[#003366]">
                    Enrolled
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
