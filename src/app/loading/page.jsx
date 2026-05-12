'use client';

const letters = ['Y', 'V', 'I', 'T', 'Y'];

export default function YVITYLoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex gap-1 md:gap-2 lg:gap-3 text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider font-['Segoe_UI','Poppins',system-ui]">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block bg-gradient-to-r from-green-500 via-lime-400 via-yellow-300 to-amber-500 bg-[length:300%_300%] bg-clip-text text-transparent animate-gradientFlow"
            style={{
              animationDelay: `${index * 0.15}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tailwind-compatible keyframes via global CSS (required once) */}
    </div>
  );
}