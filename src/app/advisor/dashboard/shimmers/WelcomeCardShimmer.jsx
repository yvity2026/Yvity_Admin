export default function WelcomeCardShimmer() {
  return (
    <div className="bg-[#124B48] rounded-2xl p-6 md:p-8 flex flex-col justify-center shadow-sm animate-pulse h-[132px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-24 bg-white/20 rounded"></div>
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
      </div>
      <div className="h-8 w-48 bg-white/20 rounded mb-3"></div>
      <div className="h-4 w-64 bg-white/20 rounded"></div>
    </div>
  );
}