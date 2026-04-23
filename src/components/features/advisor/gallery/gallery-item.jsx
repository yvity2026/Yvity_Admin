export default function GalleryItem({ data, onClick }) {
  return (
    <div
      onClick={() => onClick?.(data)}
      className={`${data.bgColor || "bg-[#0A4A4A]"} aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group`}
    >
      {data.image_url ? (
        <img src={data.image_url} alt={data.caption || "Gallery item"} className="w-full h-full object-cover" /> 
      ) : (
        <span className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
          {data.icon || '🖼️'}
        </span>
      )}
    </div>
  );
}
