

// "use client";

// export default function PriorityModal({ onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">

//       <div className="relative w-full max-w-md rounded-[28px] bg-[#f8f8f8] shadow-2xl overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          
//           <div className="flex items-center gap-2">

//             {/* Icon */}
//             <div className="w-7 h-7 rounded-full bg-[#fff3dc] flex items-center justify-center">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#c57a00"
//                 strokeWidth="2"
//               >
//                 <path d="M12 2v20M2 12h20" />
//               </svg>
//             </div>

//             {/* Title */}
//             <h2 className="text-[24px] font-bold text-[#1a3330]">
//               Priority
//             </h2>
//           </div>

//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content */}
//         <div className="px-6 py-6 space-y-6">

//           {/* Hero */}
//           <div className="flex items-center justify-between">

//             <div>
//               <h3 className="text-[15px] font-semibold text-gray-700">
//                 Hero
//               </h3>

//               <p className="text-sm text-gray-400 mt-1">
//                 1/3
//               </p>
//             </div>

//             {/* Toggle */}
//             <button className="relative w-14 h-7 rounded-full bg-[#1a7a5a] transition">
//               <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow-md transition"></span>
//             </button>
//           </div>

//           {/* LAN */}
//           <div className="flex items-center justify-between">

//             <div>
//               <h3 className="text-[15px] font-semibold text-gray-700">
//                 LAN
//               </h3>

//               <p className="text-sm text-gray-400 mt-1">
//                 2/6
//               </p>
//             </div>

//             {/* Toggle */}
//             <button className="relative w-14 h-7 rounded-full bg-[#e8a020] transition">
//               <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow-md transition"></span>
//             </button>
//           </div>

//           {/* Badge */}
//           <div className="flex items-center justify-between">

//             <div>
//               <h3 className="text-[15px] font-semibold text-gray-700">
//                 Badge
//               </h3>

//               <p className="text-sm text-gray-400 mt-1">
//                 100
//               </p>
//             </div>

//             {/* Toggle */}
//             <button className="relative w-14 h-7 rounded-full bg-[#cc3333] transition">
//               <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow-md transition"></span>
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }"use client";

import { useState } from "react";

export default function PriorityModal({ onClose }) {

  const [hero, setHero] = useState(true);
  const [lan, setLan] = useState(true);
  const [badge, setBadge] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">

      <div className="relative w-full max-w-md rounded-[28px] bg-[#f8f8f8] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

          <div className="flex items-center gap-2">

            {/* Icon */}
            <div className="w-7 h-7 rounded-full bg-[#fff3dc] flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c57a00"
                strokeWidth="2"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>

            <h2 className="text-[24px] font-bold text-[#1a3330]">
              Priority
            </h2>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">

          {/* Hero */}
          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-[15px] font-semibold text-gray-700">
                Hero
              </h3>

              <p className="text-sm text-black-400 mt-1">
                1/3
              </p>
            </div>

            <button
              onClick={() => setHero(!hero)}
              className={`relative w-14 h-7 rounded-full transition ${
                hero ? "bg-[#1a7a5a]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                  hero ? "right-1" : "left-1"
                }`}
              ></span>
            </button>
          </div>

          {/* LAN */}
          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-[15px] font-semibold text-gray-700">
                LAN
              </h3>

              <p className="text-sm text-black-400 mt-1">
                2/6
              </p>
            </div>

            <button
              onClick={() => setLan(!lan)}
              className={`relative w-14 h-7 rounded-full transition ${
                lan ? "bg-[#e8a020]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                  lan ? "right-1" : "left-1"
                }`}
              ></span>
            </button>
          </div>

          {/* Badge */}
          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-[15px] font-semibold text-gray-700">
                Badge
              </h3>

              <p className="text-sm text-black-400 mt-1">
                100
              </p>
            </div>

            <button
              onClick={() => setBadge(!badge)}
              className={`relative w-14 h-7 rounded-full transition ${
                badge ? "bg-[#cc3333]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                  badge ? "right-1" : "left-1"
                }`}
              ></span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}