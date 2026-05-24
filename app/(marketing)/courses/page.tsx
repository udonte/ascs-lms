import FAQSection from "../_components/course/FaqSection";
import CareerAcceleratorSection from "../_components/courses/CareerAccelerationSection";
import CourseHero from "../_components/courses/CourseHero";
import ProgramsSections from "../_components/courses/ProgramsSections";
import RecommendedCoursesSection from "../_components/courses/RecommendedCoursesSection";
import GlobalOutcomesSection from "../_components/home/GlobalOutcomesSection";
import MentorsSection from "../_components/home/MentorsSection";

import { marketingCoursesMetadata as metadata } from "../_constants/marketing-seo";

export { metadata };

export default function Page() {
  return (
    <div>
      <CourseHero />
      <ProgramsSections />
      <RecommendedCoursesSection />
      <MentorsSection />
      <GlobalOutcomesSection />
      <CareerAcceleratorSection />
      <FAQSection />
    </div>
  );
}
