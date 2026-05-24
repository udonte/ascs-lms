import HomeHero from "./_sections/HomeHero";
import StorySection from "./_components/home/StorySection";
import MissionVisionSection from "./_components/home/MissionVisionSection";
import WhyDifferentSection from "./_components/home/WhyDifferentSection";
import WhyStudentsLoveSection from "./_components/home/WhyStudentLoveSection";
import GlobalOutcomesSection from "./_components/home/GlobalOutcomesSection";
import CallToActionSection from "./_components/home/CallToActionSection";

import { marketingHomeMetadata as metadata } from "./_constants/marketing-seo";

export { metadata };

export default function Page() {
  return (
    <div>
      <HomeHero />
      <StorySection />
      <MissionVisionSection />
      <WhyDifferentSection />
      <WhyStudentsLoveSection />
      <GlobalOutcomesSection />
      <CallToActionSection />
    </div>
  );
}
