import { Eye, Pencil } from "lucide-react";

export default function GalleryItem({ data, onEdit, onView }) {
  return (
    <div className="flex flex-col gap-3 group">
      <div
        className={`${data.bgColor || "bg-[#0A4A4A]"} aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden w-full`}
      >
        {data.image_url ? (
          <img src={data.image_url} alt={data.caption || "Gallery item"} className="w-full h-full object-cover" />
        ) : (
          <span className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
            {data.icon || '🖼️'}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onView?.(data); }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:scale-105 transition-transform shadow-lg cursor-pointer"
            title="View full image"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(data); }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:scale-105 transition-transform shadow-lg cursor-pointer"
            title="Edit image details"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Caption Display */}
      {data.caption && (
        <p className="text-sm md:text-[15px] text-gray-800 font-medium px-1 text-start truncate w-full">
          {data.caption}
        </p>
      )}
    </div>
  );
}
