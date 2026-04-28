export default function AchievementCard({
  data,
  onEditClick,
  onDeleteClick,
  ShowActions,
}) {
  return (
    <div className="bg-white border-t-[5px] border-[#00796B] rounded-[16px] p-3 sm:p-5 lg:p-7 flex items-start gap-2 lg:gap-3 shadow-sm">
      <div className="p-2 flex-shrink-0 rounded-[12px] flex items-center justify-center bg-[#FBF3E6]">
        {data.icon}
      </div>

      <div className="flex-1">
        <h3 className="text-[clamp(12px,1.5vw,16px)] font-bold text-[#111827] leading-tight">
          {data.title}
        </h3>

        <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] mt-1.5 font-normal">
          {data.description}
        </p>

        <p className="text-[clamp(8px,1vw,12px)] font-bold text-[#065F46] tracking-wide mt-4">
          {data.highlightText}
        </p>

        {ShowActions && (
          <div className="flex items-center gap-3 mt-3">
            {/* <button
              onClick={onEditClick}
              className="px-5 py-1.5 rounded-lg text-[clamp(8px,1vw,12px)] font-bold text-[#0A4A4A] transition-all border border-[#D5D5D5] bg-[#E8F4F4] cursor-pointer"
            >
              Edit
            </button> */}
            <button
              onClick={onDeleteClick}
              className="px-5 py-1.5 rounded-lg text-[clamp(8px,1vw,12px)] font-bold text-[#D32323] bg-[#FFF2F2] transition-all border border-[#F7C6C6] cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
