"use client";
<<<<<<< Anil/TrustSection
import { useEffect, useState } from "react";
import InfoBanner from "@/components/features/advisor/achievements/info-banner";
=======

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

>>>>>>> main
import AchievementCard from "@/components/features/advisor/achievements/achievement-card";
import AchievementDeleteModal from "@/components/features/advisor/achievements/achievement-delete-modal";
<<<<<<< Anil/TrustSection
=======
import AchievementFormModal from "@/components/features/advisor/achievements/achievement-form-modal";
import InfoBanner from "@/components/features/advisor/achievements/info-banner";
>>>>>>> main
import { useModal } from "@/context/ModalContext";

export const achievementsData = [
  {
    id: "ach-1",
    icon: "🏆",
    iconBg: "bg-[#FEF3C7]",
    title: "MDRT Qualifier",
    description:
      "Million Dollar Round Table - Global recognition for top advisors",
    highlightText: "2022, 2023, 2024",
  },
<<<<<<< Anil/TrustSection
=======
  {
    id: "ach-2",
    icon: "🏵️",
    iconBg: "bg-[#F3F4F6]",
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
    iconBg: "bg-[#EFF6FF]",
    title: "YVITY Founding Advisor",
    description: "Among first 500 verified advisors on YVITY",
    highlightText: "2024",
  },
  {
    id: "ach-6",
    icon: "🎓",
    iconBg: "bg-[#F4ECE1]",
    title: "Licentiate Cleared",
    description: "Insurance Institute of India - Professional certification",
    highlightText: "2015",
  },
>>>>>>> main
];

export default function AchievementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAchievement, setDeletingAchievement] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< Anil/TrustSection
  const { trigger, clearTrigger } = useModal();
  const [isAcheivementModal, setIsAcheivementModal] = useState(false);
=======
  const [isAcheivementModal, setIsAcheivementModal] = useState(false);

  const { trigger, clearTrigger } = useModal();
>>>>>>> main

  useEffect(() => {
    if (trigger === "ADD_ACHIEVEMENT") {
      setEditingAchievement(null);
      setIsAcheivementModal(true);
      clearTrigger();
    }
  }, [trigger, clearTrigger]);

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
    setIsAcheivementModal(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAchievement(null);
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
<<<<<<< Anil/TrustSection
      const res = await fetch("/api/advisor/achievements");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch achievements");
      setAchievements(data.achievements || []);
=======

      const res = await fetch("/api/advisor/achievements", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch achievements");
      }

      setAchievements(Array.isArray(data.achievements) ? data.achievements : []);
>>>>>>> main
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

<<<<<<< Anil/TrustSection
  const handleFormSubmit = async () => {
    await fetchAchievements();
=======
  const handleAchievementSubmit = async (payload, achievementId) => {
    const isEditing = Boolean(achievementId);
    const toastId = toast.loading(
      isEditing ? "Updating achievement..." : "Creating achievement..."
    );

    try {
      const res = await fetch(
        isEditing
          ? `/api/advisor/achievements/${achievementId}`
          : "/api/advisor/achievements",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || (isEditing ? "Failed to update" : "Failed to create")
        );
      }

      toast.success(
        isEditing
          ? "Achievement updated successfully"
          : "Achievement added successfully",
        { id: toastId }
      );

      await fetchAchievements();
      handleCloseModal();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { id: toastId });
      return false;
    }
>>>>>>> main
  };

  const handleDeleteSubmit = async (achievement) => {
    const toastId = toast.loading("Deleting...");

    try {
      const res = await fetch(`/api/advisor/achievements/${achievement.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      toast.success("Deleted successfully", { id: toastId });
      await fetchAchievements();
      handleCloseDeleteModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

<<<<<<< Anil/TrustSection
=======
  const formatAchievementYear = (value) => value?.toString() || "";

>>>>>>> main
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <AchievementFormModal
        isOpen={isAcheivementModal}
<<<<<<< Anil/TrustSection
        onClose={() => setIsAcheivementModal(false)}
        onSubmit={handleFormSubmit}
=======
        onClose={handleCloseModal}
        onSubmit={handleAchievementSubmit}
>>>>>>> main
      />

      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <InfoBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading &&
            achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                data={{
                  id: achievement.id,
                  icon: achievement.icon || "🏆",
                  iconBg: "bg-[#FEF3C7]",
                  title: achievement.title,
                  description: achievement.description || "Certificate uploaded",
<<<<<<< Anil/TrustSection
                  highlightText: achievement.achievement_year || "",
=======
                  highlightText: formatAchievementYear(
                    achievement.year_of_achievement
                  ),
>>>>>>> main
                }}
                onEditClick={() =>
                  handleEditClick({
                    id: achievement.id,
                    title: achievement.title,
                    organisation: achievement.organisation || "",
<<<<<<< Anil/TrustSection
                    year: achievement.achievement_year || "",
=======
                    year: achievement.year_of_achievement || "",
>>>>>>> main
                    description: achievement.description || "",
                    icon: achievement.icon || "🏆",
                  })
                }
                onDeleteClick={() => handleDeleteClick(achievement)}
                ShowActions={true}
              />
            ))}
        </div>
      </div>

      <AchievementFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingAchievement}
        onSubmit={handleAchievementSubmit}
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
