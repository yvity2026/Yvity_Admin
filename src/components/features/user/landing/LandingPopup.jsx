"use client"
import React, { useState } from 'react';
import { Briefcase, X } from 'lucide-react';

const LandingPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#F2F0E4] border-y border-[#D1D5DB] px-4 py-3 sm:py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Content Area */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="bg-orange-400 p-1.5 rounded-md shrink-0">
            <Briefcase size={16} className="text-white fill-current" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <span className="text-[16px] font-semibold font-poppins text-[#1A3C40] whitespace-nowrap">
              Offer your services on YVITY?
            </span>
            <span className="text-[14px] leading-[16px] font-normal text-[#6B7280] font-poppins">
              Complete your profile setup — takes 3 minutes.
            </span>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
          <button 
            className="bg-[#104D4D] hover:bg-[#0D3D3D]  py-2 px-6 rounded-full transition-all text-sm md:text-base whitespace-nowrap text-[14px] font-bold text-[var(--ct-as-badges-accents,#F59E0B)] font-poppins"
            onClick={() => console.log("Navigating to setup...")}
          >
            Setup Now
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPopup;