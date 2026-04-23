"use client";

import { useEffect, useState, useCallback } from "react";
import InfoBanner from "@/components/features/advisor/gallery/info-banner";
import GalleryItem from "@/components/features/advisor/gallery/gallery-item";
import AddPhotoCard from "@/components/features/advisor/gallery/add-photo-card";
import { AddPhotosModal, ImageDetailsModal } from "@/components/features/advisor/gallery/gallery-modals";
import { useModal } from "@/context/ModalContext";

export default function GalleryPage() {
  const [isAddPhotosOpen, setIsAddPhotosOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { trigger, clearTrigger } = useModal();
  const [isGallery, setIsGallery] = useState(false);

  const fetchGalleryItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/advisor/gallery");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setGalleryItems(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  useEffect(() => {
    if (trigger === "ADD_PHOTO") {
      setIsGallery(true);
      clearTrigger();
    }
  }, [trigger, clearTrigger]);

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <AddPhotosModal 
        isOpen={isGallery} 
        onClose={() => setIsGallery(false)} 
        onSuccess={fetchGalleryItems}
      />

      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <InfoBanner />

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item) => (
            <GalleryItem
              key={item.id}
              data={item}
              onEdit={(data) => setSelectedImage(data)}
              onView={(data) => setViewImage(data)}
            />
          ))}

          {/* Always show the Add Photo card at the end of the grid */}
          <AddPhotoCard onClick={() => setIsAddPhotosOpen(true)} />
        </div>
      </div>

      <AddPhotosModal
        isOpen={isAddPhotosOpen}
        onClose={() => setIsAddPhotosOpen(false)}
        onSuccess={fetchGalleryItems}
      />

      <ImageDetailsModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        data={selectedImage}
        onSuccess={() => {
          setSelectedImage(null);
          fetchGalleryItems();
        }}
      />

      {/* Full Image View Lightbox */}
      {viewImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setViewImage(null)}
        >
          <button 
            onClick={() => setViewImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center">
            {viewImage.image_url ? (
              <img 
                src={viewImage.image_url} 
                alt={viewImage.caption || "Full view"} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
              />
            ) : (
              <div 
                className={`${viewImage.bgColor || "bg-[#0A4A4A]"} text-9xl w-[50vh] h-[50vh] flex items-center justify-center rounded-2xl shadow-2xl`} 
                onClick={(e) => e.stopPropagation()}
              >
                {viewImage.icon || '🖼️'}
              </div>
            )}
            
            {viewImage.caption && (
              <p 
                className="text-white text-lg md:text-xl mt-6 text-center font-medium bg-black/50 px-6 py-3 rounded-full" 
                onClick={(e) => e.stopPropagation()}
              >
                {viewImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}