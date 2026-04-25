"use client";
import { useState, useEffect } from "react";
import InfoBanner from "@/components/features/advisor/professional-journey/info-banner";
import JourneySection from "@/components/features/advisor/professional-journey/journey-section";
import EntryFormModal from "@/components/features/advisor/professional-journey/entry-form-modal";
import EntryDeleteModal from "@/components/features/advisor/professional-journey/entry-delete-modal";
import { Shield, HeartPulse, GraduationCap } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import toast from "react-hot-toast";

const SECTION_CONFIG = {
  "Life Insurance": {
    id: "life-insurance",
    category: "Life Insurance",
    themeColor: "bg-[#2A9D8F]",
    textColor: "text-[#F8F6F1]",
    icon: Shield,
  },
  "Health Insurance": {
    id: "health-insurance",
    category: "Health Insurance",
    themeColor: "bg-[#3498DB]",
    textColor: "text-[#F8F6F1]",
    icon: HeartPulse,
  },
  Education: {
    id: "education",
    category: "Education",
    themeColor: "bg-[#E89C0F]",
    textColor: "text-[#F8F6F1]",
    icon: GraduationCap,
  },
  Others: {
    id: "others",
    category: "Others",
    themeColor: "bg-[#2A9D8F]",
    textColor: "text-[#F8F6F1]",
    icon: Shield,
  },
};

const SECTION_ORDER = [
  "Life Insurance",
  "Health Insurance",
  "Education",
  "Others",
];

const formatPeriod = (entry) => {
  if (entry.entry_type === "Certificate") {
    return entry.date ? String(entry.date) : "";
  }

  if (entry.from_year && entry.to_year) {
    return `${entry.from_year} - ${entry.to_year}`;
  }

  if (entry.from_year && entry.is_ongoing) {
    return `${entry.from_year} - PRESENT`;
  }

  if (entry.from_year) {
    return String(entry.from_year);
  }

  return "";
};

const getSectionKey = (entry) => {
  if (
    entry.entry_type === "Education" ||
    entry.entry_type === "Certificate"
  ) {
    return "Education";
  }

  return entry.service_category || "Others";
};

const mapEntryToItem = (entry) => ({
  id: entry.id,
  period: formatPeriod(entry),
  title: entry.title || "",
  subtitle:
    entry.entry_type === "Education" || entry.entry_type === "Certificate"
      ? entry.organisation || ""
      : entry.organisation ||
        entry.custom_service_category ||
        entry.service_category ||
        "",
  description: entry.description,
  entryType: entry.entry_type,
  category:
    entry.entry_type === "Education" || entry.entry_type === "Certificate"
      ? "Education"
      : entry.service_category || "Others",
});

const buildJourneySections = (entries) => {
  const grouped = entries.reduce((acc, entry) => {
    const sectionKey = getSectionKey(entry);

    if (!acc[sectionKey]) {
      const config = SECTION_CONFIG[sectionKey] || {
        id: sectionKey.toLowerCase().replace(/\s+/g, "-"),
        category: sectionKey,
        themeColor: "bg-[#2A9D8F]",
        textColor: "text-[#F8F6F1]",
        icon: Shield,
      };

      acc[sectionKey] = {
        ...config,
        count: "0 entries",
        entries: [],
      };
    }

    acc[sectionKey].entries.push(mapEntryToItem(entry));
    return acc;
  }, {});

  Object.values(grouped).forEach((section) => {
    section.count = `${section.entries.length} entr${
      section.entries.length === 1 ? "y" : "ies"
    }`;
  });

  return Object.values(grouped).sort((a, b) => {
    const aIndex = SECTION_ORDER.indexOf(a.category);
    const bIndex = SECTION_ORDER.indexOf(b.category);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
};

export default function ProfessionalJourneyPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [journeyData, setJourneyData] = useState([]);

  const { trigger, clearTrigger } = useModal();
  const [isProfessional, setProfessional] = useState(false);

  const fetchJourney = async () => {
    try {
      const response = await fetch("/api/advisor/journey");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to fetch journey data");
      }

      setJourneyData(buildJourneySections(Array.isArray(result) ? result : []));
    } catch (error) {
      console.error("Journey fetch failed:", error);
      setJourneyData([]);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  useEffect(() => {
    if (trigger === "ADD_PROFESSIONAL_JOURNEY") {
      setProfessional(true);
      clearTrigger();
    }
  }, [trigger, clearTrigger]);

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleDeleteClick = (entry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingEntry(null);
  };

  const handleFormSubmit = async (data) => {
    const isEditing = Boolean(editingEntry?.id);
    const { icon, ...payload } = data;
    const toastId = toast.loading(
      isEditing ? "Updating journey entry..." : "Creating journey entry..."
    );

    try {
      const response = await fetch(
        isEditing
          ? `/api/advisor/journey/${editingEntry.id}`
          : "/api/advisor/journey",
        {
          method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            (isEditing
              ? "Failed to update journey entry"
              : "Failed to create journey entry")
        );
      }

      await fetchJourney();
      setEditingEntry(null);
      toast.success(
        isEditing
          ? "Journey entry updated successfully"
          : "Journey entry created successfully",
        { id: toastId }
      );
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      console.error("Journey submit failed:", error);
    }
  };

  const handleDeleteSubmit = async (entry) => {
    const toastId = toast.loading("Deleting journey entry...");

    try {
      const response = await fetch(`/api/advisor/journey/${entry.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete journey entry");
      }

      await fetchJourney();
      setDeletingEntry(null);
      toast.success("Journey entry deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      console.error("Journey delete failed:", error);
    }
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader onAddClick={handleAddClick} /> */}
      {
        <EntryFormModal
          isOpen={isProfessional}
          onClose={() => setProfessional(false)}
          onSubmit={handleFormSubmit}
        />
      }

      <div className="p-4 md:p-6 space-y-6 lg:p-10 xl:px-15 mx-auto w-full pb-12">
        <InfoBanner />

        <div className="space-y-8">
          {journeyData.map((section) => (
            <JourneySection
              key={section.id}
              data={section}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <EntryFormModal
        isOpen={isEntryModalOpen}
        onClose={handleCloseModal}
        initialData={editingEntry}
        onSubmit={handleFormSubmit}
      />

      <EntryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        entry={deletingEntry}
        onDelete={handleDeleteSubmit}
      />
    </div>
  );
}
