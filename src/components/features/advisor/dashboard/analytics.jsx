// export default function Analytics() {
//   const data = [
//     { label: "Views", value: 90 },
//     { label: "Shares", value: 70 },
//     { label: "Contacts", value: 40 },
//     { label: "Saves", value: 20 },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-xl">
//       <h3 className="font-semibold mb-4">Analytics</h3>

//       <div className="space-y-4">
//         {data.map((item, i) => (
//           <div key={i}>
//             <div className="flex justify-between text-sm">
//               <span>{item.label}</span>
//             </div>
//             <div className="h-2 bg-gray-200 rounded-full mt-1">
//               <div
//                 className="h-full bg-[#0F3D3E] rounded-full"
//                 style={{ width: `${item.value}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function Analytics() {
  const data = [
    { label: "Views", value: "1,247", width: "90%", color: "bg-[#124B48]" },
    { label: "Shares", value: "156", width: "75%", color: "bg-[#F59E0B]" },
    { label: "Contacts", value: "38", width: "40%", color: "bg-[#10B981]" },
    { label: "Saves", value: "24", width: "25%", color: "bg-[#4F46E5]" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Analytics</h3>
        <span className="text-xs text-gray-400 font-medium">Last 30 days</span>
      </div>

      <div className="space-y-6 mt-2 flex-1 justify-center flex flex-col">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium w-16 flex-shrink-0">
              {item.label}
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: item.width }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900 w-10 text-right flex-shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}