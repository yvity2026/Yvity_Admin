export default function BonusBanners() {
  return (
    <div className="space-y-3">
      <div className="bg-[#EAEFE8] border border-[#D1E5D8] rounded-xl p-4 flex items-start sm:items-center gap-4">
        <div className=" flex-shrink-0">🌟</div>
        <div>
          <h4 className="text-[clamp(12px,1.5vw,16px)] font-bold text-[#065F46]">
            Continuity Bonus Active!
          </h4>
          <p className="text-[clamp(10px,1vw,14px)] text-[#0A4A4A] font-medium mt-0.5">
            You received a recommendation this month — +1 bonus point added to
            your YVITY Score. Keep it up!
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#D3EFF0] border border-[#B2DFDB] rounded-xl p-4 flex items-start sm:items-center gap-4">
        <div className="text-2xl flex-shrink-0">💡</div>
        <p className="text-[clamp(10px,1vw,14px)] text-[#0A4A4A] font-medium leading-relaxed">
          Each recommendation = 2 pts towards YVITY Score (Max 14 pts). Get
          monthly recommendations for +1 bonus. No recommendation in a month = -1 pt.
          
        </p>
      </div>
    </div>
  );
}
