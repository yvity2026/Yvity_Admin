import { Plus } from "lucide-react";
import JourneyTimelineItem from "./journey-timeline-item";

export default function JourneySection({ data }) {
  const Icon = data.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Colored Header */}
      <div className={`${data.themeColor} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3 text-white">
          <Icon className="w-5 h-5" />
          <h2 className="text-lg font-bold">{data.category}</h2>
          <span className="text-white/80 text-sm font-medium ml-2">
            {data.count}
          </span>
        </div>
        
        <button className="bg-white text-gray-900 hover:bg-gray-50 transition-colors px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Timeline Container */}
      <div className="p-6">
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 pb-2">
          {data.entries.map((entry, index) => (
            <JourneyTimelineItem 
              key={entry.id} 
              entry={entry} 
              themeColor={data.themeColor}
              textColor={data.textColor}
              isLast={index === data.entries.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}