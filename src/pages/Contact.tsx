import FAQSection from "@/assets/course/FaqSection";
import PartnersShowcaseSection from "@/components/common/PartnersShowcaseSection";
import ContactHero from "@/components/contact/ContactHero";
import DetailsSection from "@/components/contact/DetailsSection";

const Contact = () => {
  return (
    <div>
      <ContactHero />
      <DetailsSection />
      <FAQSection />
      <PartnersShowcaseSection />
    </div>
  );
};

export default Contact;
