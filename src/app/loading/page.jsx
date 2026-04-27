'use client';

import React from 'react';

const YVITYLoadingPage = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#0a0a0a] z-[9999]">
      <div className="flex gap-1 md:gap-2 lg:gap-3 text-4xl md:text-6xl lg:text-7xl font-bold font-['Segoe_UI','Poppins',system-ui] tracking-wider">
        {'YVITY'.split('').map((letter, index) => (
          <span
            key={index}
            className="inline-block bg-gradient-to-r from-green-500 via-lime-400 via-yellow-300 to-amber-500 bg-[length:300%_auto] bg-clip-text text-transparent animate-gradient-flow"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-flow {
          animation: gradientFlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default YVITYLoadingPage;