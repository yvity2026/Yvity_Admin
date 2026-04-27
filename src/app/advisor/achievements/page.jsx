"use client";
import { useEffect, useState } from "react";
import InfoBanner from "@/components/features/advisor/achievements/info-banner";
import AchievementCard from "@/components/features/advisor/achievements/achievement-card";
import AchievementFormModal from "@/components/features/advisor/achievements/achievement-form-modal";
import AchievementDeleteModal from "@/components/features/advisor/achievements/achievement-delete-modal";
import { useModal } from "@/context/ModalContext";
import toast from "react-hot-toast";

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
];

export default function AchievementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAchievement, setDeletingAchievement] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const { trigger, clearTrigger } = useModal();
  const [isAcheivementModal, setIsAcheivementModal] = useState(false);

  useEffect(() => {
    if (trigger === "ADD_ACHIEVEMENT") {
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
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAchievement(null);
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/advisor/achievements");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch achievements");
      setAchievements(data.achievements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleFormSubmit = async () => {
    await fetchAchievements();
  };

  const handleDeleteSubmit = async (achievement) => {
    const toastId = toast.loading("Deleting...");

    try {
      const res = await fetch(`/api/advisor/achievements/${achievement.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Delete failed");

      toast.success("Deleted successfully", { id: toastId });
      await fetchAchievements();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <AchievementFormModal
        isOpen={isAcheivementModal}
        onClose={() => setIsAcheivementModal(false)}
        onSubmit={handleFormSubmit}
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
                  highlightText: achievement.achievement_year || "",
                }}
                onEditClick={() =>
                  handleEditClick({
                    id: achievement.id,
                    title: achievement.title,
                    organisation: achievement.organisation || "",
                    year: achievement.achievement_year || "",
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
