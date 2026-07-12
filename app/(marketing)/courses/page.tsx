import FAQSection from "../_components/course/FaqSection";
import CareerAcceleratorSection from "../_components/courses/CareerAccelerationSection";
import ProgramsSections from "../_components/courses/ProgramsSections";
import RecommendedCoursesSection from "../_components/courses/RecommendedCoursesSection";
import GlobalOutcomesSection from "../_components/home/GlobalOutcomesSection";
import MentorsSection from "../_components/home/MentorsSection";
import { MarketingCourseService } from "@/lib/services/marketing/marketing-course-service";

import { marketingCoursesMetadata as metadata } from "../_constants/marketing-seo";

export { metadata };

export default async function Page() {
  // Fetch real published courses from DB (visible to anon visitors via RLS policy)
  // Falls back to [] on error — ProgramsSections keeps hardcoded fallback links
  const dbCourses = await MarketingCourseService.getPublishedCourses();

  return (
    <div>
      {/* <CourseHero /> */}
      <ProgramsSections dbCourses={dbCourses} />
      <RecommendedCoursesSection />
      <MentorsSection />
      <GlobalOutcomesSection />
      <CareerAcceleratorSection />
      <FAQSection />
    </div>
  );
}
