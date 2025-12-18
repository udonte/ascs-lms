import FAQSection from "@/assets/course/FaqSection";
import PartnersShowcaseSection from "@/components/common/PartnersShowcaseSection";
import ContactHero from "@/components/contact/ContactHero";
import DetailsSection from "@/components/contact/DetailsSection";
import MagazinePodcastSection from "@/components/contact/MagazinePodcastSection";

const Contact = () => {
  return (
    <div>
      <ContactHero />
      <DetailsSection />
      <FAQSection />
      <MagazinePodcastSection />
      <PartnersShowcaseSection />
    </div>
  );
};

export default Contact;
