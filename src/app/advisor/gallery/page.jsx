"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/features/advisor/gallery/page-header";
import InfoBanner from "@/components/features/advisor/gallery/info-banner";
import GalleryItem from "@/components/features/advisor/gallery/gallery-item";
import AddPhotoCard from "@/components/features/advisor/gallery/add-photo-card";
import { AddPhotosModal, GalleryModalBase, ImageDetailsModal } from "@/components/features/advisor/gallery/gallery-modals";
import { useModal } from "@/context/ModalContext";

// MOCK DATA: Structured for future backend API integration
// When backend is ready, replace 'bgColor' and 'icon' with an 'imageUrl' property.
 export const galleryData = [
  {
    id: "gal-1",
    bgColor: "bg-[#0B4646]", // Dark teal
    icon: "🏆",
  },
  {
    id: "gal-2",
    bgColor: "bg-[#1E7145]", // Forest green
    icon: "💮",
  },
  {
    id: "gal-3",
    bgColor: "bg-[#B3830E]", // Mustard/Gold
    icon: "📜",
  },
  {
    id: "gal-4",
    bgColor: "bg-[#2A5773]", // Slate blue
    icon: "👥",
  },
  {
    id: "gal-5",
    bgColor: "bg-[#331E63]", // Dark purple
    icon: "🎓",
  },
];

export default function GalleryPage() {
  const [isAddPhotosOpen, setIsAddPhotosOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { trigger, clearTrigger } = useModal();
  const [isGallery, setIsGallery] = useState(false);
  useEffect(() => {
    if (trigger === "ADD_PHOTO") {
setIsGallery(true);
      clearTrigger(); 
    }
  }, [trigger]);

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader onAddPhotosClick={() => setIsAddPhotosOpen(true)} /> */}
      
        {<AddPhotosModal isOpen={isGallery} onClose={() => setIsGallery(false)} />}
      
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <InfoBanner />
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {galleryData.map((item) => (
            <GalleryItem 
              key={item.id} 
              data={item} 
              onClick={(data) => setSelectedImage(data)}
            />
          ))}
          
          {/* Always show the Add Photo card at the end of the grid */}
          <AddPhotoCard onClick={() => setIsAddPhotosOpen(true)} />
        </div>
      </div>

      <AddPhotosModal 
        isOpen={isAddPhotosOpen}
        onClose={() => setIsAddPhotosOpen(false)}
      />

      <ImageDetailsModal 
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        data={selectedImage}
      />
    </div>
  );
}