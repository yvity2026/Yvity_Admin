import { X } from "lucide-react";
import { useState, useEffect } from "react";

const ICONS = [
  { emoji: "🏆", bg: "bg-[#FEF3C7]" },
  { emoji: "🥇", bg: "bg-[#F3F4F6]" },
  { emoji: "🌟", bg: "bg-[#FEF3C7]" },
  { emoji: "📜", bg: "bg-[#F3F4F6]" },
  { emoji: "💎", bg: "bg-[#EFF6FF]" },
  { emoji: "🎓", bg: "bg-[#F4ECE1]" }
];

export default function AchievementFormModal({ isOpen, onClose, initialData, onSubmit }) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    title: "",
    organisation: "",
    year: "",
    description: "",
    icon: "🏆"
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        organisation: initialData.organisation || "",
        year: initialData.highlightText || "",
        description: initialData.description || "",
        icon: initialData.icon || "🏆",
      });
    } else if (!isOpen) {
      // reset form on close
      setFormData({
        title: "",
        organisation: "",
        year: "",
        description: "",
        icon: "🏆"
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (emoji) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-[18px] font-bold text-[#111827]">
              {isEditing ? "Edit Achievement" : "Add Achievement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Achievement Title */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Achievement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. MDRT Qualifier 2024"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            {/* Organisation / Issuer */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Organisation / Issuer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                placeholder="e.g. MDRT, LIC, YVITY"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2024 or 2022, 2023, 2024"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            {/* Description */}
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

            {/* Icon / Badge */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2">
                Icon / Badge <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {ICONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleIconSelect(item.emoji)}
                    className={`w-[48px] h-[48px] flex items-center justify-center rounded-xl border transition-all cursor-pointer text-2xl ${
                      formData.icon === item.emoji
                        ? "border-[#0A4A4A] shadow-sm bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors cursor-pointer"
              >
                {isEditing ? "Save Changes" : "Add Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
