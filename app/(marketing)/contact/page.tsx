import FAQSection from "../_components/course/FaqSection";
import PartnersShowcaseSection from "../_components/common/PartnersShowcaseSection";
import ContactHero from "../_components/contact/ContactHero";
import DetailsSection from "../_components/contact/DetailsSection";
import MagazinePodcastSection from "../_components/contact/MagazinePodcastSection";

import { marketingContactMetadata as metadata } from "../_constants/marketing-seo";

export { metadata };

export default function Page() {
  return (
    <div>
      <ContactHero />
      <DetailsSection />
      <FAQSection />
      <MagazinePodcastSection />
      <PartnersShowcaseSection />
    </div>
  );
}
