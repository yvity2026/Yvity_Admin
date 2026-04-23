"use client";

import { X, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export function GalleryModalBase({ isOpen, onClose, title, icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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

export function AddPhotosModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a photo");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      formData.append("category", category);

      const response = await fetch("/api/advisor/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Photo uploaded successfully!");
        setFile(null);
        setCaption("");
        setCategory("");
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message || "Failed to upload photo");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <GalleryModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Add Photo"
      icon={<Camera className="w-5 h-5 text-gray-900" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl py-10 px-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
          {file ? (
            <div className="w-full flex items-center justify-center text-sm font-medium text-[#0A4A4A]">
              Selected: {file.name}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-2">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-[clamp(14px,1.5vw,16px)] font-bold text-gray-900">Click to Upload Photo</h3>
              <p className="text-[clamp(11px,1vw,13px)] text-gray-500 font-medium">
                JPG, PNG • Max 5 MB
              </p>
            </>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[clamp(13px,1.2vw,15px)] font-bold text-gray-900 mb-2">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
              placeholder="Awards & achievements"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 flex justify-center items-center gap-2 bg-[#0A4A4A] text-white rounded-lg font-bold text-sm hover:bg-[#083a3a] transition-colors cursor-pointer mt-2 disabled:opacity-70"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Upload Photo
        </button>
      </form>
    </GalleryModalBase>
  );
}

export function ImageDetailsModal({ isOpen, onClose, data, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize caption when data changes
  useState(() => {
    if (data) setCaption(data.caption || "");
  }, [data]);

  if (!data) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      setCaption(data.caption || ""); // Reset
    } else {
      setCaption(data.caption || ""); // Set current
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advisor/gallery?id=${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Caption updated");
        setIsEditing(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advisor/gallery?id=${data.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Photo deleted");
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[clamp(13px,1.2vw,15px)] font-bold text-gray-900">Are you sure you want to delete this photo?</p>
        <div className="flex justify-end gap-3 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete();
            }}
            className="px-4 py-2 bg-[#EF4444] text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity,
    });
  };

  const title = isEditing ? "Edit Caption" : (data.caption || "Gallery Photo");
  const subtitle = data.category || "Added recently";

  return (
    <GalleryModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={data.icon}
    >
      <div className="flex flex-col">
        {/* Image Placeholder rendering */}
        <div
          className={`${data.bgColor || "bg-[#0A4A4A]"} w-full aspect-[4/3] rounded-2xl flex items-center justify-center text-5xl mb-4 sm:mb-5 shadow-inner relative overflow-hidden`}
        >
          {data.image_url ? (
            <img src={data.image_url} alt="Gallery item" className="w-full h-full object-cover" />
          ) : (
            <span className="drop-shadow-lg">{data.icon}</span>
          )}
        </div>

        {isEditing ? (
          <div className="mb-6">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
              placeholder="Caption"
            />
          </div>
        ) : (
          <p className="text-[clamp(12px,1.2vw,14px)] font-medium text-[#6B7280] mb-6">
            {subtitle}
          </p>
        )}

        <div className="flex items-center gap-3 w-full">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-[#083a3a] transition-colors cursor-pointer flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditToggle}
                className="flex-1 py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-[#083a3a] transition-colors cursor-pointer"
              >
                Edit caption
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 py-3 bg-[#FFF5F5] border border-[#FECACA] text-[#EF4444] rounded-lg font-bold text-[clamp(13px,1.2vw,15px)] hover:bg-[#FEE2E2] transition-colors cursor-pointer flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </GalleryModalBase>
  );
}
