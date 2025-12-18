import FAQSection from "@/assets/course/FaqSection";
import CareerAcceleratorSection from "@/components/courses/CareerAccelerationSection";
import CourseHero from "@/components/courses/CourseHero";
import ProgramsSections from "@/components/courses/ProgramsSections";
import RecommendedCoursesSection from "@/components/courses/RecommendedCoursesSection";
import GlobalOutcomesSection from "@/components/home/GlobalOutcomesSection";
import MentorsSection from "@/components/home/MentorsSection";

const Courses = () => {
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
};

export default Courses;
