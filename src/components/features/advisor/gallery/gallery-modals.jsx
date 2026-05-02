"use client";

import { X, Camera, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export function GalleryModalBase({ isOpen, onClose, title, icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl flex items-center justify-center">{icon}</span>}
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F4F0] text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AddPhotosModal({ isOpen, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Photos uploaded successfully!");
    onClose();
  };

  return (
    <GalleryModalBase 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Photos" 
      icon={<Camera className="w-5 h-5 text-gray-900" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl py-10 px-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-2">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-[clamp(14px,1.5vw,16px)] font-bold text-gray-900">Click to Upload Photos</h3>
          <p className="text-[clamp(11px,1vw,13px)] text-gray-500 font-medium">
            JPG, PNG • Max 5 MB each • Up to 10 photos
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[clamp(13px,1.2vw,15px)] font-bold text-gray-900 mb-2">
              Caption (optional)
            </label>
            <input 
              type="text"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="e.g. MDRT Award Ceremony 2024" 
            />
          </div>

          <div>
            <label className="block text-[clamp(13px,1.2vw,15px)] font-bold text-gray-900 mb-2">
              Category
            </label>
            <input 
              type="text"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]" 
              placeholder="Awards & achievements" 
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-sm hover:bg-[#083a3a] transition-colors cursor-pointer mt-2"
        >
          Upload Photos
        </button>
      </form>
    </GalleryModalBase>
  );
}

export function ImageDetailsModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const handleEdit = () => {
    toast.success("Edit mode toggled");
  };

  const handleDelete = () => {
    toast.error("Image deleted");
    onClose();
  };

  // Use optional fallback values so it works nicely with existing simple mock structure
  const title = data.title || "Award Ceremony 2024";
  const subtitle = data.subtitle || "Awards & Achievements • Added 2 days ago";

  return (
    <GalleryModalBase 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      icon={data.icon} // reusing the emoji string from the item data
    >
      <div className="flex flex-col">
        {/* Image Placeholder rendering */}
        <div 
          className={`${data.bgColor || "bg-[#0A4A4A]"} w-full aspect-[4/3] rounded-2xl flex items-center justify-center text-5xl mb-4 sm:mb-5 shadow-inner relative overflow-hidden`}
        >
          <span className="drop-shadow-lg">{data.icon}</span>
        </div>

        <p className="text-[clamp(12px,1.2vw,14px)] font-medium text-[#6B7280] mb-6">
          {subtitle}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={handleEdit}
            className="flex-1 py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-[#083a3a] transition-colors cursor-pointer"
          >
            Edit caption
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 py-3 bg-[#FFF5F5] border border-[#FECACA] text-[#EF4444] rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </GalleryModalBase>
  );
}
