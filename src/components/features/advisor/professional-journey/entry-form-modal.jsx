import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const SERVICE_CATEGORIES = ["Life Insurance", "Health Insurance", "Others"];
const ENTRY_TYPES = ["Education", "Professional", "Certifications"];

export default function EntryFormModal({ isOpen, onClose, initialData, onSubmit }) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    entryType: "Education",
    serviceCategory: "Life Insurance",
    degree: "",
    institution: "",
    fromYear: "",
    toYear: "",
    isCurrent: false,
    description: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        entryType: initialData.entryType || "Education",
        serviceCategory: initialData.category || "Life Insurance",
        degree: initialData.title || "",
        institution: initialData.subtitle || "",
        fromYear: initialData.period ? initialData.period.split(" - ")[0].replace("—", "").trim() : "",
        toYear: initialData.period && (initialData.period.includes(" - ") || initialData.period.includes(" — ")) ? (initialData.period.split(/ - | — /)[1] || "").replace("PRESENT", "").trim() : "",
        isCurrent: initialData.period ? initialData.period.includes("PRESENT") : false,
        description: initialData.description || "",
      });
    } else if (!isOpen) {
      setFormData({
        entryType: "Education",
        serviceCategory: "Life Insurance",
        degree: "",
        institution: "",
        fromYear: "",
        toYear: "",
        isCurrent: false,
        description: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEducation = formData.entryType === "Education";

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
    if (onSubmit) onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white appearance-none cursor-pointer"
                  required
                >
                  {ENTRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Service Category (Hidden if Education) */}
            {!isEducation && (
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
                          ? "border-[#0A4A4A] bg-gray-50 text-[#111827] font-medium shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Degree / Certificate */}
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            {/* Institution */}
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            {/* From Year / To Year */}
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                  To Year {!formData.isCurrent && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="toYear"
                  value={formData.toYear}
                  onChange={handleChange}
                  placeholder="2020"
                  disabled={formData.isCurrent}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none transition-all ${
                    formData.isCurrent ? "bg-gray-50 text-gray-400" : "bg-white focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
                  }`}
                  required={!formData.isCurrent}
                />
              </div>
            </div>

            {/* Currently working here / Ongoing (Hidden if Education) */}
            {!isEducation && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0A4A4A] border-gray-300 rounded focus:ring-[#0A4A4A] cursor-pointer"
                />
                <label htmlFor="isCurrent" className="text-[14px] text-[#4B5563] cursor-pointer">
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white resize-none"
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
