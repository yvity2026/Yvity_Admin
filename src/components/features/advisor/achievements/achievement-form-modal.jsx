// import { X } from "lucide-react";
// import { useEffect, useState } from "react";

// const ICONS = [
//   { emoji: "🏆", bg: "bg-[#FEF3C7]" },
//   { emoji: "🥇", bg: "bg-[#F3F4F6]" },
//   { emoji: "🌟", bg: "bg-[#FEF3C7]" },
//   { emoji: "📜", bg: "bg-[#F3F4F6]" },
//   { emoji: "💎", bg: "bg-[#EFF6FF]" },
//   { emoji: "🎓", bg: "bg-[#F4ECE1]" },
// ];

// export default function AchievementFormModal({
//   isOpen,
//   onClose,
//   initialData,
//   onSubmit,
// }) {
//   const isEditing = !!initialData;
//   const [formData, setFormData] = useState({
//     title: "",
//     organisation: "",
//     year: "",
//     description: "",
//     icon: "🏆",
//   });

//   useEffect(() => {
//     if (initialData && isOpen) {
//       setFormData({
//         title: initialData.title || "",
//         organisation: initialData.organisation || "",
//         year: initialData.year || "",
//         description: initialData.description || "",
//         icon: initialData.icon || "🏆",
//       });
//     } else if (!isOpen) {
//       setFormData({
//         title: "",
//         organisation: "",
//         year: "",
//         description: "",
//         icon: "🏆",
//       });
//     }
//   }, [initialData, isOpen]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleIconSelect = (emoji) => {
//     setFormData((prev) => ({ ...prev, icon: emoji }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       title: formData.title.trim(),
//       organisation: formData.organisation.trim(),
//       description: formData.description.trim(),
//       icon: formData.icon,
//       achievement_year: formData.year.trim(),
//     };

//     try {
//       const res = await fetch(
//         isEditing
//           ? `/api/advisor/achievements/${initialData.id}`
//           : "/api/advisor/achievements",
//         {
//           method: isEditing ? "PUT" : "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }

//       await onSubmit?.();
//       onClose();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
//         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="text-2xl">🏆</span>
//             <h2 className="text-[18px] font-bold text-[#111827]">
//               {isEditing ? "Edit Achievement" : "Add Achievement"}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             type="button"
//             className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto max-h-[80vh] no-scrollbar">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
//                 Achievement Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. MDRT Qualifier 2024"
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
//                 Organisation / Issuer <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="organisation"
//                 value={formData.organisation}
//                 onChange={handleChange}
//                 placeholder="e.g. LIC, YVITY"
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
//                 Achievement Year <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="year"
//                 value={formData.year}
//                 onChange={handleChange}
//                 placeholder="e.g. MDRT 2024 or COT 2022, TOT 2023,"
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white uppercase"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
//                 Description (optional)
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Brief description of your role or achievement..."
//                 rows={3}
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white resize-none"
//               />
//             </div>

//             <div>
//               <label className="block text-[14px] font-bold text-[#111827] mb-2">
//                 Icon / Badge <span className="text-red-500">*</span>
//               </label>
//               <div className="flex flex-wrap items-center gap-3">
//                 {ICONS.map((item, idx) => (
//                   <button
//                     key={idx}
//                     type="button"
//                     onClick={() => handleIconSelect(item.emoji)}
//                     className={`w-[48px] h-[48px] flex items-center justify-center rounded-xl border transition-all cursor-pointer text-2xl ${
//                       formData.icon === item.emoji
//                         ? "border-[#0A4A4A] shadow-sm bg-gray-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     {item.emoji}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="pt-2">
//               <button
//                 type="submit"
//                 className="w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors cursor-pointer"
//               >
//                 {isEditing ? "Save Changes" : "Add Achievement"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = [
  { emoji: "🏆", bg: "bg-[#FEF3C7]" },
  { emoji: "🥇", bg: "bg-[#F3F4F6]" },
  { emoji: "🌟", bg: "bg-[#FEF3C7]" },
  { emoji: "📜", bg: "bg-[#F3F4F6]" },
  { emoji: "💎", bg: "bg-[#EFF6FF]" },
  { emoji: "🎓", bg: "bg-[#F4ECE1]" },
];

export default function AchievementFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    title: "",
    organisation: "",
    year: "",
    description: "",
    icon: "🏆",
  });
  
  // State to hold year validation error
  const [yearError, setYearError] = useState("");
  // NEW: State to control loading and prevent multiple submissions
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        organisation: initialData.organisation || "",
        year: initialData.year || "",
        description: initialData.description || "",
        icon: initialData.icon || "🏆",
      });
      setYearError(""); // Reset error when modal opens
    } else if (!isOpen) {
      setFormData({
        title: "",
        organisation: "",
        year: "",
        description: "",
        icon: "🏆",
      });
      setYearError(""); // Reset error when modal closes
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error as soon as the user starts typing again
    if (name === "year") {
      setYearError("");
    }
  };

  const handleIconSelect = (emoji) => {
    setFormData((prev) => ({ ...prev, icon: emoji }));
  };

  // Helper function to validate and format the year string
  const validateAndFormatYear = (inputStr) => {
    // Convert to uppercase for easier matching
    const upperStr = inputStr.toUpperCase();
    
    // Check if it contains exactly one of the allowed designations
    const matchTOT = upperStr.match(/TOT/g);
    const matchCOT = upperStr.match(/COT/g);
    const matchMDRT = upperStr.match(/MDRT/g);
    
    // Total count of designations found
    const designationCount = (matchTOT ? matchTOT.length : 0) + 
                             (matchCOT ? matchCOT.length : 0) + 
                             (matchMDRT ? matchMDRT.length : 0);

    // Extract any 4-digit number (the year)
    const yearMatch = upperStr.match(/\b\d{4}\b/);

    if (designationCount !== 1 || !yearMatch) {
      return { 
        isValid: false, 
        error: "Must contain a valid year (e.g.,MDRT 2024) space and one of: TOT, COT, or MDRT." 
      };
    }

    // Determine which designation was used
    let designation = "";
    if (matchTOT) designation = "TOT";
    if (matchCOT) designation = "COT";
    if (matchMDRT) designation = "MDRT";

    const yearNumber = yearMatch[0];

    // Determine the order (did the text come before or after the year in the original string?)
    const textIndex = upperStr.indexOf(designation);
    const yearIndex = upperStr.search(/\b\d{4}\b/);
    
    // Format with exactly one space
    let formattedString = "";
    if (textIndex < yearIndex) {
      formattedString = `${designation} ${yearNumber}`;
    } else {
      formattedString = `${yearNumber} ${designation}`;
    }

    return { isValid: true, formattedValue: formattedString };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the year field before proceeding
    const validationResult = validateAndFormatYear(formData.year.trim());
    
    if (!validationResult.isValid) {
      setYearError(validationResult.error);
      return; // Stop submission
    }

    // NEW: Block new submissions and trigger loading state
    if (isLoading) return;
    setIsLoading(true);

    const payload = {
      title: formData.title.trim(),
      organisation: formData.organisation.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      // Use the formatted string (with the guaranteed space) for the backend
      achievement_year: validationResult.formattedValue, 
    };

    try {
      const res = await fetch(
        isEditing
          ? `/api/advisor/achievements/${initialData.id}`
          : "/api/advisor/achievements",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      await onSubmit?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      // NEW: Release loading state whether the request succeeds or fails
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-[18px] font-bold text-[#111827]">
              {isEditing ? "Edit Achievement" : "Add Achievement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Achievement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. MDRT Qualifier 2024"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Organisation / Issuer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                placeholder="e.g. LIC, YVITY"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Achievement Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. MDRT 2024 or 2022 COT"
                className={`w-full border rounded-xl px-4 py-3 text-[14px] outline-none transition-all bg-white uppercase ${
                  yearError 
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                    : "border-gray-200 focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A]"
                }`}
                required
              />
              {/* Error message display */}
              {yearError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{yearError}</p>
              )}
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-1.5">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your role or achievement..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#0A4A4A] focus:ring-1 focus:ring-[#0A4A4A] transition-all bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2">
                Icon / Badge <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {ICONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleIconSelect(item.emoji)}
                    className={`w-[48px] h-[48px] flex items-center justify-center rounded-xl border transition-all cursor-pointer text-2xl ${
                      formData.icon === item.emoji
                        ? "border-[#0A4A4A] shadow-sm bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              {/* NEW: Disable button, update classes, and change text based on isLoading */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading 
                  ? (isEditing ? "Saving..." : "Adding...") 
                  : (isEditing ? "Save Changes" : "Add Achievement")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}