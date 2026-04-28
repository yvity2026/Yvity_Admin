import { Eye, Pencil } from "lucide-react";

export default function GalleryItem({ data, onEdit, onView }) {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div
        className={`${
          data.bgColor || "bg-[#0A4A4A]"
        } aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl relative overflow-hidden w-full 
        /* Base Border - Darkened to gray-300 for better initial visibility */
        border-[5px] border-emerald-900 shadow-md 
        /* Hover Border & Ring (The "Effective" Part) */
        group-hover:border-blue-500 group-hover:ring-4 group-hover:ring-blue-500/30 group-hover:shadow-2xl 
        transition-all duration-300 ease-out`}
      >
        {data.image_url ? (
          <img 
            src={data.image_url} 
            alt={data.caption || "Gallery item"} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
          />
        ) : (
          <span className="transform group-hover:scale-125 transition-transform duration-500 ease-out drop-shadow-md">
            {data.icon || '🖼️'}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onView?.(data); }}
            className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.3)] cursor-pointer"
            title="View full image"
          >
            <Eye className="w-[22px] h-[22px]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(data); }}
            className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-green-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.3)] cursor-pointer"
            title="Edit image details"
          >
            <Pencil className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      {/* Caption Display */}
      {data.caption && (
        <div className="px-1 mt-1">
          <p className="text-[15px] text-gray-800 font-semibold text-start truncate w-full group-hover:text-blue-600 transition-colors duration-200">
            {data.caption}
          </p>
        </div>
      )}
    </div>
  );
}