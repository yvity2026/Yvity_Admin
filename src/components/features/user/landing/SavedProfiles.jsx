"use client"
import React from 'react';
import { IoPricetag } from 'react-icons/io5';

const SavedProfiles = ({ savedAdvisors = [] }) => {
  const isEmpty = savedAdvisors.length === 0;

  return (
    <section className="w-full bg-[#F9F8F3] py-16 px-6 min-h-[400px]">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <h2 className="xl:text-[48px] md:text-4xl font-cormorant text-[#111827] font-bold mb-10 leading-[50px]">
          My Saved <span className="text-[#F59E0B] italic font-bold">Profiles</span>
        </h2>

        {/* Content Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center p-8">
          {isEmpty ? (
            /* Empty State */
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                {/* Rotated Tag Icon to match the screenshot */}
                <IoPricetag 
                  size={32} 
                  className="text-[#FF4D6D] transform -rotate-45" 
                />
              </div>
              
              <h3 className="text-[#374151] text-center text-[20px] font-medium font-[Poppins] leading-[16px] mb-4">
                No saved profiles yet
              </h3>
              
              <p className="text-sm text-[#6B7280] text-[14px] font-medium font-[Poppins] leading-[16px]">
                Browse advisors and tap save to bookmark them here
              </p>
            </div>
          ) : (
            /* Grid for Saved Cards (when data exists) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* map your imported Card component here */}
              {savedAdvisors.map(advisor => (
                <div key={advisor.id} className="p-4 border rounded-xl">
                  Saved Advisor Content
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedProfiles;