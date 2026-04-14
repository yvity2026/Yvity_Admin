// export default function WelcomeCard() {
//   return (
//     <div className="bg-[#0F3D3E] text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between">
//       <div>
//         <p className="text-sm opacity-80">Good Morning 🌤️</p>
//         <h2 className="text-2xl font-semibold mt-1">Krishna Mohan!</h2>
//         <p className="text-sm opacity-70 mt-1">
//           Your credibility profile is active and growing 🚀
//         </p>
//       </div>
//     </div>
//   );
// }

export default function WelcomeCard() {
  return (
    <div className="bg-[#124B48] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-center shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm text-gray-200">Good Morning</p>
        <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
      </div>
      <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-wide mb-2">
        Krishna Mohan!
      </h2>
      <p className="text-sm text-gray-300">
        Your credibility profile is active and growing 🚀
      </p>
    </div>
  );
}