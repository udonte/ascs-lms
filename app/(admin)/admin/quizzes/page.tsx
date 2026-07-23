import Header from "@/app/_components/Header";
import { QuizBuilderPanel } from "@/app/(admin)/_components/QuizBuilderPanel";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";
import { QuizService } from "@/lib/services/admin/quizzes/quiz-service";

export default async function QuizBuilderPage() {
  const [quizzes, courses] = await Promise.all([
    QuizService.getAllQuizzesForAdmin(),
    AdminCourseService.getAdminCourses(),
  ]);

  const courseOptions = courses.map((course) => ({
    id: course.id,
    title: course.title,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header
        title="Quiz Builder"
        description="Build and manage course assessments to evaluate student completion."
      />
      <QuizBuilderPanel quizzes={quizzes} courses={courseOptions} />
    </div>
  );
}
