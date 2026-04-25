"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Award, BriefcaseBusiness, GraduationCap } from "lucide-react";

import EntryDeleteModal from "@/components/features/advisor/professional-journey/entry-delete-modal";
import EntryFormModal from "@/components/features/advisor/professional-journey/entry-form-modal";
import InfoBanner from "@/components/features/advisor/professional-journey/info-banner";
import JourneySection from "@/components/features/advisor/professional-journey/journey-section";
import { useModal } from "@/context/ModalContext";

const SECTION_CONFIG = {
  Profession: {
    id: "profession",
    category: "Profession",
    themeColor: "bg-[#2A9D8F]",
    textColor: "text-[#F8F6F1]",
    icon: BriefcaseBusiness,
  },
  Certificate: {
    id: "certificate",
    category: "Certification",
    themeColor: "bg-[#3498DB]",
    textColor: "text-[#F8F6F1]",
    icon: Award,
  },
  Education: {
    id: "education",
    category: "Education",
    themeColor: "bg-[#E89C0F]",
    textColor: "text-[#F8F6F1]",
    icon: GraduationCap,
  },
};

const SECTION_ORDER = ["Profession", "Certificate", "Education"];

const formatPeriod = (entry) => {
  if (entry.entry_type === "Certificate") {
    return entry.date ? String(entry.date) : "";
  }

  if (entry.from_year && entry.is_ongoing) {
    return `${entry.from_year} - PRESENT`;
  }

  if (entry.from_year && entry.to_year) {
    return `${entry.from_year} - ${entry.to_year}`;
  }

  if (entry.from_year) {
    return String(entry.from_year);
  }

  return "";
};

const getSectionKey = (entry) => {
  if (
    entry?.entry_type === "Education" ||
    entry?.entry_type === "Profession" ||
    entry?.entry_type === "Certificate"
  ) {
    return entry.entry_type;
  }

  return "Profession";
};

const getDisplayTitle = (entry) => {
  if (entry.entry_type === "Education") {
    return entry.degree_or_certificate || entry.title || "";
  }

  if (entry.entry_type === "Certificate") {
    return entry.certificate_name || entry.title || "";
  }

  return entry.title || entry.organisation || "";
};

const getDisplaySubtitle = (entry) => {
  if (entry.entry_type === "Education") {
    return entry.institution || entry.organisation || "";
  }

  const category = entry.custom_service_category || entry.service_category || "";
  const organisation = entry.organisation || "";

  return [organisation, category]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(" • ");
};

const mapEntryToItem = (entry) => ({
  id: entry.id,
  period: formatPeriod(entry),
  title: getDisplayTitle(entry),
  subtitle: getDisplaySubtitle(entry),
  description: entry.description || "",
  entryType: entry.entry_type,
  category: getSectionKey(entry),
  entry_type: entry.entry_type,
  service_category: entry.service_category,
  custom_service_category: entry.custom_service_category,
  from_year: entry.from_year,
  to_year: entry.to_year,
  date: entry.date,
  is_ongoing: entry.is_ongoing,
  degree_or_certificate: entry.degree_or_certificate,
  institution: entry.institution,
  certificate_name: entry.certificate_name,
  organisation: entry.organisation,
  raw_title: entry.title,
});

const buildJourneySections = (entries) => {
  const grouped = entries.reduce((acc, entry) => {
    const sectionKey = getSectionKey(entry);
    const config = SECTION_CONFIG[sectionKey] || SECTION_CONFIG.Profession;

    if (!acc[sectionKey]) {
      acc[sectionKey] = {
        ...config,
        count: "0 entries",
        entries: [],
      };
    }

    acc[sectionKey].entries.push(mapEntryToItem(entry));
    return acc;
  }, {});

  return SECTION_ORDER.filter((key) => grouped[key]?.entries?.length).map((key) => ({
    ...grouped[key],
    count: `${grouped[key].entries.length} entr${
      grouped[key].entries.length === 1 ? "y" : "ies"
    }`,
  }));
};

export default function ProfessionalJourneyPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [journeyData, setJourneyData] = useState([]);
  const [isProfessional, setProfessional] = useState(false);

  const { trigger, clearTrigger } = useModal();

  const fetchJourney = async () => {
    try {
      const response = await fetch("/api/advisor/journey", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to fetch journey data");
      }

      setJourneyData(buildJourneySections(Array.isArray(result) ? result : []));
    } catch (error) {
      console.error("Journey fetch failed:", error);
      setJourneyData([]);
      toast.error(error.message || "Failed to fetch journey data");
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  useEffect(() => {
    if (trigger === "ADD_PROFESSIONAL_JOURNEY") {
      setEditingEntry(null);
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
    setProfessional(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingEntry(null);
  };

  const handleFormSubmit = async (data, entryId) => {
    const isEditing = Boolean(entryId);
    const toastId = toast.loading(
      isEditing ? "Updating journey entry..." : "Creating journey entry..."
    );

    try {
      const response = await fetch(
        isEditing ? `/api/advisor/journey/${entryId}` : "/api/advisor/journey",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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
      handleCloseModal();
      toast.success(
        isEditing
          ? "Journey entry updated successfully"
          : "Journey entry created successfully",
        { id: toastId }
      );
      return true;
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      console.error("Journey submit failed:", error);
      return false;
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
      handleCloseDeleteModal();
      toast.success("Journey entry deleted successfully", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      console.error("Journey delete failed:", error);
    }
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <EntryFormModal
        isOpen={isProfessional}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />

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
