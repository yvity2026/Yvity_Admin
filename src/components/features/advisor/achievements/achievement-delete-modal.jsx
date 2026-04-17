import { X } from "lucide-react";

export default function AchievementDeleteModal({ isOpen, onClose, achievement, onDelete }) {
  if (!isOpen || !achievement) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(achievement);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111827]">
            Delete Achievement?
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ECF7F7] text-[#0A4A4A] hover:bg-[#D8E6E3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <p className="text-[15px] text-[#4B5563] mb-6">
            Remove <strong className="text-[#111827]">{achievement.title}</strong> from your profile?
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 border border-[#FCA5A5] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] font-bold py-3.5 rounded-xl text-[14px] transition-colors cursor-pointer"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
