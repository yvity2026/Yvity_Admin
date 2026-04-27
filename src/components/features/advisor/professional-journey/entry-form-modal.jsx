import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

const SERVICE_CATEGORIES = ["Life Insurance", "Health Insurance", "Others"];
const ENTRY_TYPES = ["Education", "Profession", "Certificate"];

const getDefaultFormData = () => ({
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

export default function EntryFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(getDefaultFormData());

  useEffect(() => {
    if (initialData && isOpen) {
      const mappedEntryType = initialData.entry_type || initialData.entryType || "Education";
      const initialCategory =
        initialData.service_category ||
        initialData.custom_service_category ||
        "Life Insurance";
      const isCustomCategory =
        Boolean(initialData.custom_service_category) ||
        (initialCategory &&
          !SERVICE_CATEGORIES.includes(initialCategory) &&
          initialCategory !== "");

      setFormData({
        entryType: mappedEntryType,
        serviceCategory: mappedEntryType === "Education"
          ? "Life Insurance"
          : isCustomCategory
            ? "Others"
            : initialData.service_category || "Life Insurance",
        customServiceCategory: isCustomCategory
          ? initialData.custom_service_category || initialCategory
          : "",
        degree:
          initialData.degree_or_certificate ||
          (mappedEntryType === "Education" ? initialData.title || "" : ""),
        institution: initialData.institution || "",
        company:
          mappedEntryType === "Profession"
            ? initialData.organisation || initialData.raw_title || initialData.title || ""
            : "",
        certificateName:
          initialData.certificate_name ||
          (mappedEntryType === "Certificate" ? initialData.title || "" : ""),
        fromYear: initialData.from_year ? String(initialData.from_year) : "",
        toYear: initialData.to_year ? String(initialData.to_year) : "",
        date: initialData.date ? String(initialData.date) : "",
        isCurrent: Boolean(initialData.is_ongoing),
        description: initialData.description || "",
      });
    } else if (!isOpen) {
      setFormData(getDefaultFormData());
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

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategory: category,
      customServiceCategory: category === "Others" ? prev.customServiceCategory : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceCategory = !isEducation
      ? formData.serviceCategory === "Others"
        ? null
        : formData.serviceCategory
      : null;
    const customServiceCategory =
      !isEducation && formData.serviceCategory === "Others"
        ? formData.customServiceCategory.trim()
        : null;
    const title = isEducation
      ? formData.degree.trim()
      : isProfession
        ? formData.company.trim()
        : formData.certificateName.trim();
    const organisation = isEducation
      ? formData.institution.trim()
      : isProfession
        ? formData.company.trim()
        : null;

    const payload = {
      entry_type: formData.entryType,
      service_category: serviceCategory,
      custom_service_category: customServiceCategory,
      title,
      organisation,
      description: formData.description.trim() || null,
      from_year:
        isCertificate || !formData.fromYear ? null : Number(formData.fromYear),
      to_year:
        isCertificate || formData.isCurrent || !formData.toYear
          ? null
          : Number(formData.toYear),
      date: isCertificate && formData.date ? Number(formData.date) : null,
      is_ongoing: isProfession ? formData.isCurrent : false,
      degree_or_certificate: isEducation ? formData.degree.trim() : null,
      institution: isEducation ? formData.institution.trim() : null,
      certificate_name: isCertificate ? formData.certificateName.trim() : null,
    };

    try {
      const success = await onSubmit?.(payload, initialData?.id);

      if (success !== false) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <Plus className="w-5 h-5 text-[#8B5CF6] mr-2 stroke-[3]" />
            <h2 className="text-[18px] font-bold text-[#111827]">
              {isEditing ? "Edit Career & Education" : "Add Career & Education"}
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

        <div className="p-6 overflow-y-auto max-h-[80vh] no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {!isEducation && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[14px] font-bold text-[#111827] mb-2">
                    Service Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {SERVICE_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`px-4 py-2 text-[13px] rounded-lg border transition-all cursor-pointer ${
                          formData.serviceCategory === category
                            ? "border-[#0A4A4A] bg-[#FAFCFB] text-[#111827] font-medium shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {category}
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
                      required
                    />
                  </div>
                )}
              </div>
            )}

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
                    required
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
                    placeholder="e.g. Nagarjuna University"
                    className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                    required
                  />
                </div>
              </>
            )}

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
                  required
                />
              </div>
            )}

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
                  placeholder="e.g. IRDAI Certification"
                  className="w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-[#FAFCFB]"
                  required
                />
              </div>
            )}

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
                    className={`w-full border border-[#DBE1E0] rounded-xl px-4 py-3 text-[14px] outline-none transition-all ${
                      formData.isCurrent
                        ? "bg-gray-50 text-gray-400"
                        : "bg-[#FAFCFB] focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
                    }`}
                    required={!formData.isCurrent}
                  />
                </div>
              </div>
            )}

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
                  required
                />
              </div>
            )}

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
                />
              </div>
            )}

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
