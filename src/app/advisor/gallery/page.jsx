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
    </div>
  );
}