import AboutHero from "@/components/about/AboutHero";
import AboutStorySection from "@/components/about/AboutStorySection";
import CeoNoteSection from "@/components/about/CeoNoteSection";
import FacultySection from "@/components/about/FacultySection";
import InternationalRecognitionSection from "@/components/about/InternationalRecognitionSection";
import WhatIsCustomerSuccessSection from "@/components/about/WhatIsCustomerSuccessSection";
import MissionVisionSection from "@/components/home/MissionVisionSection";

const About = () => {
  return (
    <div>
      <AboutHero />
      <AboutStorySection />
      <MissionVisionSection />
      <InternationalRecognitionSection />
      <FacultySection />
      <CeoNoteSection />
      <WhatIsCustomerSuccessSection />
    </div>
  );
};

export default About;
