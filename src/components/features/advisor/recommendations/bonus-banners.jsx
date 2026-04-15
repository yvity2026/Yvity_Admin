export default function BonusBanners() {
  return (
    <div className="space-y-3">
      {/* Continuity Bonus Banner */}
      <div className="bg-[#F2F7F4] border border-[#D1E5D8] rounded-xl p-4 flex items-start sm:items-center gap-4">
        <div className="text-2xl flex-shrink-0">🌟</div>
        <div>
          <h4 className="text-[15px] font-bold text-[#1E7145]">Continuity Bonus Active!</h4>
          <p className="text-sm text-gray-600 font-medium mt-0.5">
            You received a recommendation this month — +1 bonus point added to your YVITY Score. Keep it up!
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#E2F1F0] border border-[#B2DFDB] rounded-xl p-4 flex items-start sm:items-center gap-4">
        <div className="text-2xl flex-shrink-0">💡</div>
        <p className="text-sm text-[#00695C] font-medium leading-relaxed">
          Each recommendation = 2 pts towards YVITY Score (Max 14 pts). Get monthly recommendations for +1 bonus. <br className="hidden sm:block" />
          <span className="font-bold">No recommendation in a month = -1 pt.</span>
        </p>
      </div>
    </div>
  );
}