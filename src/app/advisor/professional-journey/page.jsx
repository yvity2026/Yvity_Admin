
import InfoBanner from "@/components/features/advisor/professional-journey/info-banner";
import JourneySection from "@/components/features/advisor/professional-journey/journey-section";
import PageHeader from "@/components/features/advisor/professional-journey/page-header";
import { Shield, HeartPulse, GraduationCap } from "lucide-react";

// MOCK DATA: Structured exactly how your backend API should return it
const journeyData = [
  {
    id: "life-insurance",
    category: "Life Insurance",
    count: "3 entries",
    themeColor: "bg-[#2A9D8F]", // Teal
    textColor: "text-[#F8F6F1]",
    icon: Shield,
    entries: [
      {
        id: "l1",
        period: "2024 - PRESENT",
        title: "Senior Development Officer",
        subtitle: "LIC of India • Nellore Branch",
        description: "Leading a team of 12 advisors, responsible for premium collection and branch growth targets.",
      },
      {
        id: "l2",
        period: "2019 - 2024",
        title: "LIC Advisor - MDRT Qualifier",
        subtitle: "LIC of India",
        description: "Achieved MDRT qualification 3 consecutive years. Specialised in term and endowment plans.",
      },
      {
        id: "l3",
        period: "2015 - 2019",
        title: "Insurance Advisor",
        subtitle: "LIC of India",
        description: "Started career, built a client base of 200+ families in Nellore district.",
      },
    ],
  },
  {
    id: "health-insurance",
    category: "Health Insurance",
    count: "2 entries",
    themeColor: "bg-[#3498DB]", // Blue
    textColor: "text-[#F8F6F1]",
    icon: HeartPulse,
    entries: [
      {
        id: "h1",
        period: "2020 - PRESENT",
        title: "Health Insurance Advisor",
        subtitle: "Star Health Insurance • Nellore",
        description: "Advising clients on individual and family floater health plans.",
      },
      {
        id: "h2",
        period: "2018 - 2020",
        title: "Health Advisor",
        subtitle: "Niva Bupa Health Insurance",
        description: "Started health insurance practice alongside LIC work.",
      },
    ],
  },
  {
    id: "education",
    category: "Education",
    count: "3 entries",
    themeColor: "bg-[#E89C0F]", // Orange
    textColor: "text-[#F8F6F1]",
    icon: GraduationCap,
    entries: [
      {
        id: "e1",
        period: "2015",
        title: "Licentiate — Insurance Certification",
        subtitle: "Insurance Institute of India",
        description: null,
      },
      {
        id: "e2",
        period: "2012 — 2015",
        title: "B.Com — Commerce",
        subtitle: "Nagarjuna University, Nellore",
        description: null,
      },
      {
        id: "e3",
        period: "2010 — 2012",
        title: "Intermediate — Commerce",
        subtitle: "Sri Chaitanya Junior College, Nellore",
        description: null,
      },
    ],
  },
];

export default function ProfessionalJourneyPage() {
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader /> */}
      
      <div className="p-4 md:p-6 space-y-6 lg:p-10 xl:px-15 mx-auto w-full pb-12">
        <InfoBanner />
        
        <div className="space-y-8">
          {journeyData.map((section) => (
            <JourneySection key={section.id} data={section} />
          ))}
        </div>
      </div>
    </div>
  );
}