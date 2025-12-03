import CallToActionSection from "@/components/home/CallToActionSection";
import GlobalOutcomesSection from "@/components/home/GlobalOutcomesSection";
import Hero from "@/components/home/Hero";
import MissionVisionSection from "@/components/home/MissionVisionSection";
import StorySection from "@/components/home/StorySection";
import WhyDifferentSection from "@/components/home/WhyDifferentSection";
import WhyStudentsLoveSection from "@/components/home/WhyStudentLoveSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <StorySection />
      <MissionVisionSection />
      <WhyDifferentSection />
      <WhyStudentsLoveSection />
      <GlobalOutcomesSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
