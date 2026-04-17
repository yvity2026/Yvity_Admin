
'use client'
import { useState, useEffect } from "react";
import BonusBanners from "@/components/features/advisor/recommendations/bonus-banners";
import FilterTabs from "@/components/features/advisor/recommendations/filter-tabs";
import PageHeader from "@/components/features/advisor/recommendations/page-header";
import RecommendationCard from "@/components/features/advisor/recommendations/recommendation-card";
import StatsRow from "@/components/features/advisor/recommendations/stats-row";
import { useModal } from "@/context/ModalContext";
import { RecommendationModalBase, ShareModal } from "@/components/features/advisor/recommendations/recommendation-modals";


// MOCK DATA: Structured for future backend API integration
const recommendationsData = [
  {
    id: "rec-1",
    initials: "RS",
    name: "Ravi Shankar",
    subtitle: "Software Engineer • Nellore",
    date: "March 15, 2025",
    status: "Verified",
    pointsAdded: "+2 pts added",
    tags: [
      { icon: "🤝", label: "Helpful & Honest" },
      { icon: "🏆", label: "Expert Knowledge" },
      { icon: "🛡️", label: "Trustworthy" },
    ],
  },
  {
    id: "rec-2",
    initials: "PD",
    name: "Priya Devi",
    subtitle: "Teacher • Hyderabad",
    date: "March 15, 2025",
    status: "Verified",
    pointsAdded: "+2 pts added",
    tags: [
      { icon: "⚡", label: "Quick Response" },
      { icon: "💯", label: "Best Policy Advice" },
      { icon: "😊", label: "Great Experience" },
    ],
  },
  {
    id: "rec-3",
    initials: "PD", // Assuming Mahesh kumar has PD in mockup, though MK would make sense. Matching image strictly.
    name: "Mahesh kumar",
    subtitle: "Govt Employee • Nellore",
    date: "March 15, 2025",
    status: "Verified",
    pointsAdded: "+2 pts added",
    tags: [
      { icon: "🤝", label: "Helpful & Honest" },
      { icon: "💯", label: "Best Policy Advice" },
    ],
  },
];

export default function RecommendationsPage() {

  
   const { trigger, clearTrigger } = useModal();
    const [isRecommendation, setRecommendation] = useState(false);
    useEffect(() => {
      if (trigger === "ADD_RECOMMENDATION") {
  setRecommendation(true);
        clearTrigger(); 
      }
    }, [trigger]);
  
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader /> */}
       {<ShareModal isOpen={isRecommendation} onClose={() => setRecommendation(false)} />}

      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <StatsRow />
        <BonusBanners />

        <div className="space-y-4">
          <FilterTabs />

          <div className="space-y-4">
            {recommendationsData.map((rec) => (
              <RecommendationCard key={rec.id} data={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}