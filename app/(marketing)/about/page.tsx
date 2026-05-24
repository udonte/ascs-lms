import AboutHero from "../_components/about/AboutHero";
import AboutStorySection from "../_components/about/AboutStorySection";
import MissionVisionSection from "../_components/home/MissionVisionSection";
import InternationalRecognitionSection from "../_components/about/InternationalRecognitionSection";
import FacultySection from "../_components/about/FacultySection";
import CeoNoteSection from "../_components/about/CeoNoteSection";
import WhatIsCustomerSuccessSection from "../_components/about/WhatIsCustomerSuccessSection";

import { marketingAboutMetadata as metadata } from "../_constants/marketing-seo";

export { metadata };

export default function Page() {
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
}
