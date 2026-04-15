export function SectionWrapper({ title, icon: Icon, score, max, children }) {
  const isFull = score === max;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Section Header */}
      <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0F7F6] text-[#124B48] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>

        {/* Main Section Progress Bar */}
        <div className="flex items-center gap-4 w-32 sm:w-48">
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isFull ? "bg-[#124B48]" : "bg-[#F59E0B]"}`}
              style={{ width: `${(score / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#F59E0B] w-12 text-right">
            {score}/{max}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-4">{children}</div>
    </div>
  );
}

export function ProgressRow({ label, icon, score, max }) {
  const isFull = score === max;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 font-bold text-sm text-gray-800">
        <span className="text-lg w-6 text-center">{icon}</span>
        {label}
      </div>
      <div className="flex items-center gap-3 w-24 sm:w-32">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isFull ? "bg-[#124B48]" : "bg-[#F59E0B]"}`}
            style={{ width: `${(score / max) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#124B48] w-8 text-right">
          {score}/{max}
        </span>
      </div>
    </div>
  );
}

export function InfoBox({ title, subtitle, badge, children }) {
  return (
    <div className="bg-[#F8FBFA] border border-[#E2F1F0] rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      {children ? (
        children
      ) : (
        <>
          <div>
            {title && (
              <h4 className="text-sm font-bold text-gray-700">{title}</h4>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="text-xs font-bold text-[#1E7145] whitespace-nowrap">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
}
