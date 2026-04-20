"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/features/advisor/achievements/page-header";
import InfoBanner from "@/components/features/advisor/achievements/info-banner";
import AchievementCard from "@/components/features/advisor/achievements/achievement-card";
import AchievementFormModal from "@/components/features/advisor/achievements/achievement-form-modal";
import AchievementDeleteModal from "@/components/features/advisor/achievements/achievement-delete-modal";
import EntryFormModal from "@/components/features/advisor/professional-journey/entry-form-modal";
import { useModal } from "@/context/ModalContext";

// MOCK DATA: Structured for future backend API integration
 export const achievementsData = [
  {
    id: "ach-1",
    icon: "🏆",
    iconBg: "bg-[#FEF3C7]", // Light yellow
    title: "MDRT Qualifier",
    description: "Million Dollar Round Table — Global recognition for top advisors",
    highlightText: "2022, 2023, 2024",
  },
  {
    id: "ach-2",
    icon: "🏵️",
    iconBg: "bg-[#F3F4F6]", // Light gray
    title: "Branch Champion",
    description: "Highest premium collection in Nellore LIC branch",
    highlightText: "2023",
  },
  {
    id: "ach-3",
    icon: "🌟",
    iconBg: "bg-[#FEF3C7]",
    title: "500+ Clients Served",
    description: "Successfully secured coverage for 500+ families",
    highlightText: "2024 milestone",
  },
  {
    id: "ach-4",
    icon: "📜",
    iconBg: "bg-[#F3F4F6]",
    title: "IRDAI Certified",
    description: "Valid IRDAI license verified by YVITY platform",
    highlightText: "Active",
  },
  {
    id: "ach-5",
    icon: "💎",
    iconBg: "bg-[#EFF6FF]", // Light blue
    title: "YVITY Founding Advisor",
    description: "Among first 500 verified advisors on YVITY",
    highlightText: "2024",
  },
  {
    id: "ach-6",
    icon: "🎓",
    iconBg: "bg-[#F4ECE1]", // Light tan/brown
    title: "Licentiate Cleared",
    description: "Insurance Institute of India — Professional certification",
    highlightText: "2015",
  },
];

export default function AchievementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAchievement, setDeletingAchievement] = useState(null);


   const { trigger, clearTrigger } = useModal();
    const [isAchievement, setAchievement] = useState(false);
    useEffect(() => {
      if (trigger === "ADD_ACHIEVEMENT") {
  setAchievement(true);
        clearTrigger(); 
      }
    }, [trigger]);

  const handleAddClick = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (achievement) => {
    setDeletingAchievement(achievement);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAchievement(null);
  };

  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Ready for backend integration
  };

  const handleDeleteSubmit = (achievement) => {
    console.log("Delete Submitted:", achievement);
    // Ready for backend integration
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
     
      {<EntryFormModal isOpen={isAchievement} onClose={() => setAchievement(false)} />}
      
      
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <InfoBanner />
        
        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementsData.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              data={achievement} 
              onEditClick={() => handleEditClick(achievement)} 
              onDeleteClick={() => handleDeleteClick(achievement)}
            />
          ))}
        </div>
      </div>

      <AchievementFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingAchievement}
        onSubmit={handleFormSubmit}
      />

      <AchievementDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        achievement={deletingAchievement}
        onDelete={handleDeleteSubmit}
      />
    </div>
  );
}