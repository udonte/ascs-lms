import Header from "@/app/_components/Header";
import { AdminCourseList } from "@/app/(admin)/_components/AdminCourseList";
import { CreateCourseDialog } from "@/app/(admin)/_components/CreateCourseDialog";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";

export default async function ContentManagerPage() {
  const courses = await AdminCourseService.getAdminCourses();

  return (
    <div className="mx-auto w-full">
      <Header
        title="Content Manager"
        description="Create, edit, and organize mastercourses. Drafts stay hidden from students until published."
      />
      <div className="mb-6 flex items-center justify-end gap-2">
        <CreateCourseDialog
          triggerLabel="Create New Course"
          triggerVariant="header"
        />
      </div>

      <AdminCourseList courses={courses} />
    </div>
  );
}
