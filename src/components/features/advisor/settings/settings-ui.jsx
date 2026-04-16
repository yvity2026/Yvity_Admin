"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function SettingsCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h2 className="text-[clamp(12px,1.5vw,16px)] font-bold text-[#111827] mb-4">{title}</h2>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function ActionRow({ icon, iconBg, title, subtitle, actionText }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-[clamp(10px,1vw,14px)] font-bold text-[#374151]">{title}</h3>
          <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button className="flex items-center gap-1 text-[clamp(10px,1vw,14px)] font-bold text-[#0A4A4A] hover:text-[#0a2e2c] transition-colors cursor-pointer">
        {actionText} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToggleRow({ icon, iconBg, title, subtitle, isActive, onToggle }) {
  const [active, setActive] = useState(isActive);

  const handleToggle = () => {
    const nextActive = !active;
    setActive(nextActive);
    onToggle?.(nextActive);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-4 pr-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>
        </div>
      </div>
      
     {/* Custom Toggle Switch - Responsive with clamp */}
<button 
  type="button"
  onClick={handleToggle}
  aria-pressed={active}
  className={`
    relative 
    flex-shrink-0 
    cursor-pointer 
    rounded-full 
    transition-colors 
    duration-200 
    ${active ? 'bg-[var(--primary-900,#0A4A4A)]' : 'bg-gray-200'}
    w-[clamp(50px,12vw,60px)]
    h-[clamp(25px,6vw,30px)]
  `}
>
  <div 
    className={`
      absolute 
      top-1/2 
      -translate-y-1/2 
      rounded-full 
      bg-white 
      transition-all 
      duration-200 
      shadow-sm
      w-[clamp(16px,4vw,20px)]
      h-[clamp(16px,4vw,20px)]
      ${active ? 'left-[clamp(26px,7vw,34px)]' : 'left-[clamp(4px,1.5vw,5px)]'}
    `} 
  />
</button>
    </div>
  );
}
