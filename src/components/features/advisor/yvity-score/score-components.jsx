export function SectionWrapper({ title, icon: Icon, score, max, children }) {
  const isFull = score === max;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
      <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#F0F7F6] text-[#124B48] flex items-center justify-center">
            <Icon />
          </div>
          <h2 className="text-[clamp(16px,2.5vw,20px)] font-bold text-[#111827]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4 w-32 sm:w-48">
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isFull ? "bg-[#124B48]" : "bg-[#F59E0B]"
              }`}
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
    <div className="flex items-center justify-between gap-4 p-2 px-4">
      <div className="flex items-center gap-3 font-bold text-[clamp(10px,1vw,14px)] text-[#374151]">
        <span className="text-lg w-6 text-center">{icon}</span>
        {label}
      </div>

      <div className="flex items-center gap-3 w-28 sm:w-36">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              isFull ? "bg-[#124B48]" : "bg-[#F59E0B]"
            }`}
            style={{ width: `${(score / max) * 100}%` }}
          />
        </div>
        <span className="text-[clamp(14px,2vw,18px)] font-bold text-[#0A4A4A] w-12 text-right">
          {score}/{max}
        </span>
      </div>
    </div>
  );
}

export function InfoBox({
  title,
  subtitle,
  badge,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-[#F0F8F8] border border-[#DADEDE] rounded-[16px] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <h4 className="text-[clamp(10px,1vw,14px)] font-semibold text-[#374151]">
                  {title}
                </h4>
              </div>
            )}

            {subtitle && (
              <p className="text-[clamp(8px,1vw,12px)] text-gray-500 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {badge && (
            <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#1E7145] whitespace-nowrap">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
}
