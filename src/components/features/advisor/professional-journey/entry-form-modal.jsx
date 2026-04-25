import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const SERVICE_CATEGORIES = ["Life Insurance", "Health Insurance", "Others"];
const ENTRY_TYPES = ["Education", "Profession", "Certificate"];

export default function EntryFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    entryType: "Education",
    serviceCategory: "Life Insurance",
    customServiceCategory: "",
    degree: "",
    institution: "",
    company: "",
    certificateName: "",
    fromYear: "",
    toYear: "",
    date: "",
    isCurrent: false,
    description: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      const mappedEntryType =
        initialData.entryType === "Certifications"
          ? "Certificate"
          : initialData.entryType || "Education";
      const initCategory = initialData.category || "Life Insurance";
      // If initialData.category is not one of our predefined options, treat it as a custom 'Others'
      const isCustomCat =
        !SERVICE_CATEGORIES.includes(initCategory) && initCategory !== "";

      setFormData({
        entryType: mappedEntryType,
        serviceCategory: isCustomCat ? "Others" : initCategory,
        customServiceCategory: isCustomCat ? initCategory : "",
        degree: initialData.title || "",
        institution: initialData.subtitle || "",
        company: initialData.title || "",
        certificateName: initialData.title || "",
        fromYear: initialData.period
          ? initialData.period.split(" - ")[0].replace("—", "").trim()
          : "",
        toYear:
          initialData.period &&
          (initialData.period.includes(" - ") ||
            initialData.period.includes(" — "))
            ? (initialData.period.split(/ - | — /)[1] || "")
                .replace("PRESENT", "")
                .trim()
            : "",
        date: initialData.period
          ? initialData.period.replace("PRESENT", "").trim()
          : "",
        isCurrent: initialData.period
          ? initialData.period.includes("PRESENT")
          : false,
        description: initialData.description || "",
      });
    } else if (!isOpen) {
      setFormData({
        entryType: "Education",
        serviceCategory: "Life Insurance",
        customServiceCategory: "",
        degree: "",
        institution: "",
        company: "",
        certificateName: "",
        fromYear: "",
        toYear: "",
        date: "",
        isCurrent: false,
        description: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEducation = formData.entryType === "Education";
  const isProfession = formData.entryType === "Profession";
  const isCertificate = formData.entryType === "Certificate";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({ ...prev, serviceCategory: cat }));
  };


    const handleSubmit = (e) => {
      e.preventDefault();

      const payload = {
        title:
          formData.entryType === "Education"
            ? formData.degree
            : formData.entryType === "Profession"
              ? formData.company
              : formData.certificateName,

        organisation:
          formData.entryType === "Education"
            ? formData.institution
            : formData.serviceCategory === "Others"
              ? formData.customServiceCategory
              : formData.serviceCategory,

        description: formData.description,
        icon: "🏆",

        fromYear:
          formData.entryType === "Certificate"
            ? Number(formData.date)
            : formData.fromYear
              ? Number(formData.fromYear)
              : null,

        toYear:
          formData.entryType === "Certificate"
            ? null
            : formData.isCurrent
              ? null
              : formData.toYear
                ? Number(formData.toYear)
                : null,

        isOngoing: formData.isCurrent,
      };

      onSubmit?.(payload);
      onClose();
    };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <Plus className="w-5 h-5 text-[#8B5CF6] mr-2 stroke-[3]" />
            <h2 className="text-[18px] font-bold text-[#111827]">
              {isEditing ? "Edit Career & Education" : "Add Carrer & Education"}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ECFDF5] text-gray-500 hover:bg-[#D1FAE5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#065F46]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Entry Type */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Entry Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="entryType"
                  value={formData.entryType}
                  onChange={handleChange}
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB] appearance-none cursor-pointer"
                  required
                >
                  {ENTRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Service Category (Hidden if Education) */}
            {!isEducation && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[14px] font-bold text-[#111827] mb-2">
                    Service Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={`px-4 py-2 text-[13px] rounded-lg border transition-all cursor-pointer ${
                          formData.serviceCategory === cat
                            ? "border-[#0A4A4A] bg-[#FAFCFB] text-[#111827] font-medium shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.serviceCategory === "Others" && (
                  <div>
                    <input
                      type="text"
                      name="customServiceCategory"
                      value={formData.customServiceCategory}
                      onChange={handleChange}
                      placeholder="Specify your category"
                      className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                      required={formData.serviceCategory === "Others"}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Education Fields */}
            {isEducation && (
              <>
                <div>
                  <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                    Degree / Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.com, Licentiate"
                    className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                    required={isEducation}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. Nararjuna University"
                    className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                    required={isEducation}
                  />
                </div>
              </>
            )}

            {/* Profession Fields */}
            {isProfession && (
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                  Company/Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. SBI Life"
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                  required={isProfession}
                />
              </div>
            )}

            {/* Certificate Fields */}
            {isCertificate && (
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                  Certificate Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="certificateName"
                  value={formData.certificateName}
                  onChange={handleChange}
                  placeholder="e.g. SBI Life"
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                  required={isCertificate}
                />
              </div>
            )}

            {/* From Year / To Year (For Education and Profession) */}
            {(isEducation || isProfession) && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                    From Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fromYear"
                    value={formData.fromYear}
                    onChange={handleChange}
                    placeholder="2015"
                    className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                    required={isEducation || isProfession}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                    To Year{" "}
                    {!formData.isCurrent && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="toYear"
                    value={formData.toYear}
                    onChange={handleChange}
                    placeholder="2020"
                    disabled={formData.isCurrent}
                    className={`w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none transition-all ${
                      formData.isCurrent
                        ? "bg-gray-50 text-gray-400"
                        : "bg-[#FAFCFB] focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
                    }`}
                    required={
                      !formData.isCurrent && (isEducation || isProfession)
                    }
                  />
                </div>
              </div>
            )}

            {/* Date (For Certificate) */}
            {isCertificate && (
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="2015"
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                  required={isCertificate}
                />
              </div>
            )}

            {/* Currently working here / Ongoing (Hidden if Education or Certificate) */}
            {isProfession && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0A4A4A] border-[#DBE1E0] rounded focus:ring-[#0A4A4A] cursor-pointer bg-[#FAFCFB]"
                />
                <label
                  htmlFor="isCurrent"
                  className="text-[14px] text-[#4B5563] cursor-pointer"
                >
                  Currently working here / Ongoing
                </label>
              </div>
            )}

            {/* Description (Hidden if Education) */}
            {!isEducation && (
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your role or achievement..."
                  rows={3}
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB] resize-none"
                ></textarea>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#124B48] hover:bg-[#0a2e2c] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors cursor-pointer"
              >
                {isEditing ? "Save Changes" : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
