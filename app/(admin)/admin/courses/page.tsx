import Header from "@/app/_components/Header";
import { AdminCourseList } from "@/app/(admin)/_components/AdminCourseList";
import { CreateCourseDialog } from "@/app/(admin)/_components/CreateCourseDialog";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";

export default async function ContentManagerPage() {
  const courses = await AdminCourseService.getAdminCourses();

  return (
    <div className="mx-auto w-full">
      <Header title="Content Manager" />
      <div className="flex flex-col lg:flex-row items-start justify-between  mb-8">
        <p className="mb-6 text-sm text-customer-charcoal">
          Create, edit, and organize mastercourses. Drafts stay hidden from
          students until published.
        </p>
        <div className="">
          <CreateCourseDialog
            triggerLabel="Create New Course"
            triggerVariant="header"
          />
        </div>
      </div>

      <AdminCourseList courses={courses} />
    </div>
  );
}
