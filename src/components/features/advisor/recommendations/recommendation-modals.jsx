"use client";

import { X, Upload, Copy, MessageCircle, Smartphone, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

export function RecommendationModalBase({ isOpen, onClose, title, icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
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

export function ShareModal({ isOpen, onClose, profileLink = "yvity.in/krishna-mohan" }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <RecommendationModalBase 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Share for recommendations" 
      icon={<Upload className="w-5 h-5" />}
    >
      <div className="bg-[#EAF5F3] p-4 rounded-xl mb-6">
        <p className="text-[#0A4A4A] text-[clamp(12px,1.2vw,14px)] font-medium leading-relaxed">
          Share your profile link and ask satisfied clients to recommend you. More recommendations = higher YVITY Score!
        </p>
      </div>

      <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 mb-6">
        <span className="text-gray-500 text-[clamp(12px,1.2vw,14px)] px-2 font-medium truncate">
          {profileLink}
        </span>
        <button 
          onClick={handleCopy}
          className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          Copy
        </button>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center gap-3 bg-[#EAF5E8] hover:bg-[#dcf0da] text-gray-900 p-4 rounded-xl font-bold text-sm transition-colors cursor-pointer">
          <MessageCircle className="w-5 h-5 fill-current" />
          Share via WhatsApp
        </button>
        
        <button className="w-full flex items-center gap-3 bg-[#EAF1F8] hover:bg-[#dae8f5] text-gray-900 p-4 rounded-xl font-bold text-sm transition-colors cursor-pointer">
          <Smartphone className="w-5 h-5 text-[#4D5A89]" />
          Send via SMS
        </button>
      </div>
    </RecommendationModalBase>
  );
}

export function RecommendationDetailsModal({ isOpen, onClose, data }) {
  if (!data) return null;

  return (
    <RecommendationModalBase 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Recommendation Details" 
      icon="👍"
    >
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[52px] h-[52px] rounded-full bg-[#124B48] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
          {data.initials}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
          <p className="text-[clamp(12px,1vw,14px)] text-gray-500 font-medium">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Details List */}
      <div className="border-t border-gray-100 flex flex-col gap-4 py-4 mb-2">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-gray-500 text-[clamp(13px,1.2vw,15px)]">Date</span>
          <span className="font-bold text-gray-900 text-[clamp(13px,1.2vw,15px)]">{data.date}</span>
        </div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-gray-500 text-[clamp(13px,1.2vw,15px)]">OTP verified</span>
          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[clamp(13px,1.2vw,15px)]">
            <BadgeCheck className="w-4 h-4 text-[#1E7145]" />
            Yes
          </div>
        </div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="text-gray-500 text-[clamp(13px,1.2vw,15px)]">Score Points</span>
          <span className="font-bold text-[#065F46] text-[clamp(13px,1.2vw,15px)]">{data.pointsAdded}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 text-base mb-4">Reasons for recommendation:</h4>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-[#EAF5F3] text-[#0A4A4A] px-3 py-1.5 rounded-full text-[clamp(11px,1vw,13px)] font-bold"
            >
              <span>{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="w-full py-3 bg-[#0A4A4A] text-white rounded-lg font-bold text-sm hover:bg-[#083a3a] transition-colors cursor-pointer"
      >
        Close
      </button>
    </RecommendationModalBase>
  );
}
