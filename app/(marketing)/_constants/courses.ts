/**
 * ASCS course catalogue data.
 *
 * Each entry contains all static content shown on the public courses page and
 * the LMS course-detail page: overview, benefits, competencies, and standards.
 */

export type CourseCompetency = string;

export type CourseStandard = string;

export type CourseBenefit = {
  title: string;
  description: string;
};

export type Course = {
  /** Matches the slug / id used throughout the LMS */
  id: string;
  /** Short display abbreviation shown as a badge (e.g. "FCSM") */
  badge: string;
  /** Full course title */
  title: string;
  /** One-line marketing subtitle */
  subtitle: string;
  /** Long-form overview paragraphs (one paragraph per string) */
  overview: string[];
  /** "What you will gain" bullet points */
  benefits: CourseBenefit[];
  /** Competency bullet points */
  competencies: CourseCompetency[];
  /** Standard-of-mastery checklist items (without the leading ✓) */
  standards: CourseStandard[];
};

export const COURSES: Course[] = [
  {
    id: "switch-to-tech-csm",
    badge: "Beginner",
    title: "Switch to Tech as a Customer Success Manager",
    subtitle:
      "Your proven roadmap to a high-paying tech career — no coding required.",
    overview: [
      "The Switch to Tech as a Customer Success Manager Certification equips aspiring professionals with the foundational knowledge, practical skills, and career readiness required to successfully transition into entry-level Customer Success roles, regardless of previous industry experience.",
      "Whether you are in Customer Service, Banking, Sales, HR, or a completely non-tech field, you are closer to a high-paying tech career than you think. You don't need to be a coder to break in. You just need the right roadmap.",
      "This course is your bridge to the tech industry. We take the skills you already have and translate them into the language of Customer Success (CS), one of the fastest-growing and most stable sectors in tech today.",
    ],
    benefits: [
      {
        title: "A Proven Roadmap",
        description:
          "Step-by-step guidance for transitioning your current experience into a tech role.",
      },
      {
        title: "Tech Lingo Mastery",
        description:
          "Learn the terminology and concepts, so you walk into interviews sounding like an insider.",
      },
      {
        title: "Resume Overhaul",
        description:
          "Transform your CV from traditional to tech ready so recruiters actually notice you.",
      },
      {
        title: "Confidence",
        description: "Replace fear of the unknown with a solid action plan.",
      },
    ],
    competencies: [
      "Explain the Customer Success profession and its role within modern technology companies.",
      "Customer Success principles and methodologies",
      "Customer lifecycle management",
      "Customer onboarding",
      "Product adoption strategies",
      "Customer communication",
      "Customer engagement",
      "Identify transferable skills from previous careers and position them for Customer Success roles.",
      "Demonstrate understanding of SaaS business models and the customer lifecycle.",
      "Communicate Customer Success concepts using industry-standard terminology.",
      "Create ATS-friendly resumes and optimize LinkedIn profiles for Customer Success opportunities.",
      "Develop a structured job search strategy.",
      "Prepare for Customer Success interviews using proven frameworks.",
      "Present their previous experience confidently using competency-based storytelling.",
    ],
    standards: [
      "Build a complete Customer Success career portfolio.",
      "Design an onboarding journey.",
      "Develop a customer success plan.",
      "Complete practical career transition assignments.",
      "Pass the Customer Success Foundations Assessment.",
      "Complete interview simulations.",
      "Achieve competency across all learning modules.",
    ],
  },
  {
    id: "customer-success-fundamentals",
    badge: "FCSM",
    title: "Customer Success Fundamentals",
    subtitle: "Validate your expertise and stand out from non-certified peers.",
    overview: [
      "The Foundations of Customer Success Certification validates that professionals possess the essential knowledge and practical skills required to deliver exceptional customer experiences and contribute effectively to Customer Success teams.",
    ],
    benefits: [
      {
        title: "Global Credibility",
        description:
          "A certification that validates your expertise and sets you apart from non-certified peers.",
      },
      {
        title: "Core Mastery",
        description:
          "A rock-solid understanding of what Customer Success actually is and why it drives revenue.",
      },
      {
        title: "Practical Skills",
        description:
          "Learn how to onboard clients, handle challenges, and keep customers happy from day one.",
      },
      {
        title: "Career Boost",
        description:
          "Open doors to new opportunities at top-tier companies looking for certified talent.",
      },
    ],
    competencies: [
      "Customer Success principles and methodologies",
      "Customer lifecycle management",
      "Customer onboarding",
      "Product adoption strategies",
      "Customer communication",
      "Customer engagement",
      "Customer health monitoring",
      "Customer retention fundamentals",
      "Customer Success metrics including NPS, CSAT, CES, GRR, and NRR",
      "Managing customer expectations",
      "Cross-functional collaboration",
      "Customer Success technologies",
    ],
    standards: [
      "Design an onboarding journey.",
      "Develop a customer success plan.",
      "Analyze customer health.",
      "Apply Customer Success metrics to business scenarios.",
      "Successfully complete the certification examination.",
    ],
  },
  {
    id: "certified-customer-success-manager",
    badge: "CCSM",
    title: "Certified Customer Success Manager",
    subtitle:
      "Advanced competency in Customer Success strategy, retention, and revenue growth.",
    overview: [
      "The Certified Customer Success Manager (CCSM) credential recognizes professionals who have demonstrated advanced competency in designing, implementing, and leading Customer Success strategies that improve customer retention, expansion revenue, and long-term business growth.",
    ],
    benefits: [
      {
        title: "Strategic Leadership",
        description:
          "Learn to think like a business leader, not just a support worker.",
      },
      {
        title: "Revenue Impact",
        description:
          "Understand exactly how Customer Success drives the bottom line and makes you indispensable to your CEO.",
      },
      {
        title: "Advanced Problem Solving",
        description:
          "Master the art of handling complex accounts and turning angry customers into loyal fans.",
      },
      {
        title: "Elite Status",
        description:
          "Join a select group of certified managers who command higher salaries and respect in the industry.",
      },
    ],
    competencies: [
      "Design scalable Customer Success strategies",
      "Build customer success operating models",
      "Develop customer health score frameworks",
      "Lead strategic customer conversations",
      "Manage renewals and expansion opportunities",
      "Identify churn risks",
      "Execute churn mitigation plans",
      "Conduct Executive Business Reviews",
      "Analyze customer data for strategic decision-making",
      "Build Customer Success playbooks",
      "Collaborate with Product, Sales and Support teams",
      "Lead Customer Success teams",
    ],
    standards: [
      "Develop a complete Customer Success strategy.",
      "Present a customer retention improvement project.",
      "Analyze customer success data and recommend business actions.",
      "Demonstrate leadership decision-making through case studies.",
      "Pass the advanced CCSM certification assessment.",
    ],
  },
  {
    id: "train-the-trainer",
    badge: "Trainer",
    title: "Certified Customer Success Trainer",
    subtitle:
      "Train-the-Trainer Certification — equip others with world-class Customer Success skills.",
    overview: [
      "The Certified Customer Success Trainer credential equips experienced professionals with the instructional design, facilitation, coaching, and assessment skills required to train Customer Success professionals within organizations, educational institutions, and consulting environments.",
    ],
    benefits: [
      {
        title: "The Trainer's Mindset",
        description:
          "Learn proven adult learning techniques to make your training stick.",
      },
      {
        title: "Curriculum Design",
        description:
          "Create engaging courses and modules that keep students eager to learn more.",
      },
      {
        title: "Coaching Skills",
        description:
          "Learn how to give feedback that inspires growth rather than defensiveness.",
      },
      {
        title: "New Revenue Streams",
        description:
          "Open doors to paid speaking gigs, consulting, and internal training leadership roles.",
      },
    ],
    competencies: [
      "Apply adult learning principles",
      "Design Customer Success curricula",
      "Facilitate engaging learning experiences",
      "Deliver instructor-led and virtual training",
      "Assess learner performance",
      "Provide coaching and constructive feedback",
      "Develop learning materials",
      "Design competency-based assessments",
      "Measure learning outcomes",
      "Build internal Customer Success academies",
    ],
    standards: [
      "Design a complete Customer Success training module.",
      "Deliver a live training session.",
      "Develop learner assessment tools.",
      "Demonstrate effective facilitation techniques.",
      "Pass instructor competency evaluations.",
    ],
  },
  {
    id: "customer-service-for-businesses",
    badge: "SMB",
    title: "Certified Customer Service Excellence for Business",
    subtitle:
      "Build a customer-centric organization that drives loyalty, retention, and long-term profitability.",
    overview: [
      "This certification equips business owners, managers, and frontline teams with the systems, processes, and leadership capabilities required to build customer-centric organizations that increase loyalty, retention, and long-term profitability.",
    ],
    benefits: [
      {
        title: "Loyal Customers",
        description:
          "Learn the secrets to turning first-time buyers into lifetime fans who refer their friends.",
      },
      {
        title: "Brand Reputation",
        description:
          "Build a 5-star reputation that makes marketing easier because your customers do the selling for you.",
      },
      {
        title: "Happier Teams",
        description:
          "Create a clear service structure that reduces burnout and confusion among your staff.",
      },
      {
        title: "Scalable Systems",
        description:
          "Put processes in place that allow you to grow without the usual growing pains.",
      },
    ],
    competencies: [
      "Customer experience design",
      "Customer journey mapping",
      "Service standards development",
      "Complaint management",
      "Customer communication",
      "Customer retention strategies",
      "Service recovery",
      "Team service culture",
      "Customer feedback systems",
      "Customer loyalty strategies",
      "Customer satisfaction measurement",
      "Continuous service improvement",
    ],
    standards: [
      "Design customer service standards.",
      "Develop a customer journey map.",
      "Create customer complaint resolution workflows.",
      "Build a customer retention improvement plan.",
      "Complete practical business case assessments.",
    ],
  },
  {
    id: "elevate-mentorship",
    badge: "Elevate",
    title: "Elevate Career Mentorship Certification",
    subtitle:
      "10-day intensive mentorship — career clarity, confidence, and a concrete action plan.",
    overview: [
      "The Elevate Career Mentorship Certification prepares aspiring professionals to successfully navigate career transitions through personal branding, professional communication, interview excellence, strategic networking, and structured career planning.",
      "The Elevate Mentorship Program is an intensive 10-day sprint designed to pull you out of confusion and put you on the path to success.",
      "This isn't a generic webinar. It is a hands-on, deep-dive mentorship for aspiring tech professionals who need direction, structure, and a serious confidence boost.",
    ],
    benefits: [
      {
        title: "Crystal Clear Direction",
        description:
          "We will help you define exactly where you want to go and map out how to get there.",
      },
      {
        title: "Unstoppable Confidence",
        description:
          "Overcome imposter syndrome and the fear that is holding you back from applying for that big role.",
      },
      {
        title: "Personalized Strategy",
        description:
          "Get specific advice on your career path, not one-size-fits-all tips.",
      },
      {
        title: "Accountability",
        description:
          "We won't let you sit on the sidelines. We push you to take action.",
      },
    ],
    competencies: [
      "Career planning",
      "Personal branding",
      "Professional networking",
      "LinkedIn optimization",
      "Resume development",
      "Interview communication",
      "Salary negotiation",
      "Goal setting",
      "Confidence building",
      "Accountability systems",
      "Professional etiquette",
      "Job search strategy",
    ],
    standards: [
      "Develop a complete career roadmap.",
      "Build a professional LinkedIn profile.",
      "Produce an ATS-compliant resume.",
      "Complete interview simulations.",
      "Develop a personalized 90-day career action plan.",
    ],
  },
];

/** Convenience map for O(1) lookup by course id */
export const COURSES_BY_ID: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
);
