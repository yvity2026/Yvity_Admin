// // "use client";
// // import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
// // import React, { useState } from "react";
// // import {
// //   FiArrowRight,
// //   FiLock,
// //   FiMic,
// //   FiVideo,
// //   FiRefreshCw,
// // } from "react-icons/fi";
// // import { IoClose } from "react-icons/io5";

// // const GiveTestimonialModal = ({ open, onClose, advisorId, userId, plan }) => {
// //   const [mobile, setMobile] = useState("");
// //   const [testimonial, setTestimonial] = useState("");
// //   const [rating, setRating] = useState(0);
// //   const [name, setName] = useState("");
// //   const [activeTab, setActiveTab] = useState("text");
// //   const [audioBlob, setAudioBlob] = useState(null);
// //   const [videoBlob, setVideoBlob] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [showPreview, setShowPreview] = useState(false);

// //   const normalizedPlan = String(plan || "free").toLowerCase();
// //   const canUseAudio = normalizedPlan === "silver" || normalizedPlan === "gold";
// //   const canUseVideo = normalizedPlan === "gold";
// //   const isTabLocked = (tab) =>
// //     tab === "audio" ? !canUseAudio : tab === "video" ? !canUseVideo : false;

// //   const retryFile = () => {
// //     setAudioBlob(null);
// //     setVideoBlob(null);
// //     setShowPreview(false);
// //   };

// //   const onAudioFileChange = (event) => {
// //     const file = event.target.files?.[0] ?? null;
// //     setAudioBlob(file);
// //     setShowPreview(!!file);
// //   };

// //   const onVideoFileChange = (event) => {
// //     const file = event.target.files?.[0] ?? null;
// //     setVideoBlob(file);
// //     setShowPreview(!!file);
// //   };

// //   const uploadToS3 = async (file, type) => {
// //     if (!file) return null;

// //     // ✅ Validate type
// //     if (type === "audio" && !file.type.startsWith("audio/")) {
// //       throw new Error("Invalid audio file");
// //     }

// //     if (type === "video" && !file.type.startsWith("video/")) {
// //       throw new Error("Invalid video file");
// //     }

// //     // ✅ Validate size (example: 20MB max)
// //     const MAX_SIZE = 20 * 1024 * 1024;
// //     if (file.size > MAX_SIZE) {
// //       throw new Error("File too large (max 20MB)");
// //     }

// //     const extension = file.name.split(".").pop(); // keep original format
// //     const fileName = `${type}_${Date.now()}_${Math.random()
// //       .toString(36)
// //       .substring(7)}.${extension}`;

// //     const formData = new FormData();
// //     formData.append("file", file, fileName);
// //     formData.append("type", type);

// //     const response = await fetch("/api/upload/media", {
// //       method: "POST",
// //       body: formData,
// //     });

// //     if (!response.ok) {
// //       throw new Error("Upload failed");
// //     }

// //     const data = await response.json();
// //     return data.url;
// //   };

// //   const handleSubmit = async () => {
// //     setLoading(true);

// //     if (isTabLocked(activeTab)) {
// //       alert(
// //         "This testimonial type is locked for the advisor's plan. Please choose another testimonial type.",
// //       );
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       let mediaUrl = null;
// //       let contentData = null;

// //       // ✅ Upload media if needed
// //       if (activeTab === "audio" && audioBlob) {
// //         mediaUrl = await uploadToS3(audioBlob, "audio");
// //       } else if (activeTab === "video" && videoBlob) {
// //         mediaUrl = await uploadToS3(videoBlob, "video");
// //       } else if (activeTab === "text") {
// //         contentData = testimonial;
// //       }

// //       const response = await fetch("/api/customer/testimonials", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           advisor_id: advisorId,
// //           name,
// //           mobile_number: mobile,
// //           testimonial_type: activeTab,
// //           content: contentData,
// //           media_url: mediaUrl,
// //           testimonial_rating: rating,
// //         }),
// //       });

// //       const result = await response.json();

// //       if (!response.ok) {
// //         throw new Error(result.error || "Failed to submit");
// //       }

// //       alert("Testimonial submitted successfully!");

// //       // ✅ Reset form
// //       setName("");
// //       setMobile("");
// //       setRating(0);
// //       setTestimonial("");
// //       setAudioBlob(null);
// //       setVideoBlob(null);
// //       setShowPreview(false);

// //       onClose();
// //     } catch (err) {
// //       console.error(err);
// //       alert(err.message || "Something went wrong");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <ModalWrapper onClose={() => onClose()}>
// //       <div className="bg-white rounded-2xl shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden border border-gray-100 h-auto">
// //         {/* Header */}
// //         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
// //           <div className="flex items-center gap-2">
// //             <span className="text-2xl">📷</span>
// //             <h2 className="text-[clamp(12px,1.5vw,16px)] font-bold text-slate-900">
// //               Give Testimonial
// //             </h2>
// //           </div>

// //           <button
// //             onClick={() => onClose()}
// //             className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
// //           >
// //             <IoClose size={20} />
// //           </button>
// //         </div>

// //         {/* Body */}
// //         <div className="p-6 space-y-4">
// //           {/* Tabs */}
// //           <div className="flex p-1 bg-slate-100 rounded-xl">
// //             <button
// //               onClick={() => {
// //                 setActiveTab("text");
// //                 setShowPreview(false);
// //               }}
// //               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
// //                 activeTab === "text"
// //                   ? "bg-white shadow-sm text-slate-800"
// //                   : "text-slate-500 hover:text-slate-700"
// //               }`}
// //             >
// //               <span>📄</span> Text
// //             </button>

// //             <button
// //               onClick={() => {
// //                 if (isTabLocked("audio")) return;
// //                 setActiveTab("audio");
// //                 setShowPreview(false);
// //               }}
// //               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
// //                 activeTab === "audio"
// //                   ? "bg-white shadow-sm text-slate-800"
// //                   : "text-slate-500 hover:text-slate-700"
// //               } ${isTabLocked("audio") ? "opacity-70 cursor-not-allowed" : ""}`}
// //             >
// //               <span>🎵</span>
// //               Audio
// //               {isTabLocked("audio") && (
// //                 <FiLock className="ml-1 text-slate-500" />
// //               )}
// //             </button>

// //             <button
// //               onClick={() => {
// //                 if (isTabLocked("video")) return;
// //                 setActiveTab("video");
// //                 setShowPreview(false);
// //               }}
// //               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold ${
// //                 activeTab === "video"
// //                   ? "bg-white shadow-sm text-slate-800"
// //                   : "text-slate-500 hover:text-slate-700"
// //               } ${isTabLocked("video") ? "opacity-70 cursor-not-allowed" : ""}`}
// //             >
// //               <span>🎬</span>
// //               Video
// //               {isTabLocked("video") && (
// //                 <FiLock className="ml-1 text-slate-500" />
// //               )}
// //             </button>
// //           </div>

// //           {/* Form */}
// //           <div className="space-y-3">
// //             {/* COMMON FIELDS */}
// //             <div>
// //               <label className="block font-bold text-slate-800 mb-1.5 text-sm">
// //                 Your Name <span className="text-red-500">*</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 placeholder="Full name"
// //                 className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
// //               />
// //             </div>

// //             <div>
// //               <label className="block font-bold text-slate-800 mb-1.5 text-sm">
// //                 Mobile <span className="text-red-500">*</span>
// //               </label>
// //               <input
// //                 type="tel"
// //                 value={mobile}
// //                 onChange={(e) => setMobile(e.target.value)}
// //                 placeholder="10 digit mobile number"
// //                 className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
// //               />
// //             </div>

// //             <div>
// //               <label className="block font-bold text-slate-800 mb-1.5 text-sm">
// //                 Rating <span className="text-red-500">*</span>
// //               </label>
// //               <div className="flex gap-2">
// //                 {[1, 2, 3, 4, 5].map((star) => (
// //                   <button
// //                     key={star}
// //                     onClick={() => setRating(star)}
// //                     className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
// //                   >
// //                     ★
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* TEXT MODE */}
// //             {activeTab === "text" && (
// //               <div>
// //                 <label className="block font-bold text-slate-800 mb-1.5 text-sm">
// //                   Testimonial <span className="text-red-500">*</span>
// //                 </label>
// //                 <textarea
// //                   rows="3"
// //                   value={testimonial}
// //                   onChange={(e) => setTestimonial(e.target.value)}
// //                   placeholder="Share your experience..."
// //                   className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl"
// //                 />
// //               </div>
// //             )}

// //             {/* AUDIO MODE */}
// //             {activeTab === "audio" && (
// //               <div className="relative">
// //                 <div
// //                   className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
// //                     audioBlob
// //                       ? "border-green-400 bg-green-50"
// //                       : "border-gray-300 bg-slate-50/50"
// //                   } ${isTabLocked("audio") ? "blur-sm" : ""}`}
// //                 >
// //                   <label className="block font-bold text-slate-800 mb-2 text-sm">
// //                     Upload audio file <span className="text-red-500">*</span>
// //                   </label>

// //                   <input
// //                     type="file"
// //                     accept="audio/*"
// //                     onChange={onAudioFileChange}
// //                     disabled={isTabLocked("audio")}
// //                     className="absolute inset-0 opacity-0 cursor-pointer"
// //                   />

// //                   {!audioBlob && (
// //                     <div className="text-center text-sm text-gray-500 py-6">
// //                       🎵 Click or drag audio here
// //                     </div>
// //                   )}

// //                   {audioBlob && (
// //                     <div className="space-y-3">
// //                       {/* Re-upload */}
// //                       <button
// //                         type="button"
// //                         onClick={retryFile}
// //                         className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
// //                       >
// //                         <FiRefreshCw size={16} />
// //                       </button>

// //                       <audio
// //                         controls
// //                         src={URL.createObjectURL(audioBlob)}
// //                         className="w-full"
// //                       />

// //                       <p className="text-xs text-green-600 font-medium">
// //                         Audio uploaded successfully
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {isTabLocked("audio") && (
// //                   <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-2xl">
// //                     <div className="text-center">
// //                       <FiLock className="mx-auto mb-2" />
// //                       <p className="text-sm font-semibold">
// //                         Audio locked for this plan
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* VIDEO MODE */}
// //             {activeTab === "video" && (
// //               <div className="relative">
// //                 <div
// //                   className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
// //                     videoBlob
// //                       ? "border-green-400 bg-green-50"
// //                       : "border-gray-300 bg-slate-50/50"
// //                   } ${isTabLocked("video") ? "blur-sm" : ""}`}
// //                 >
// //                   <label className="block font-bold text-slate-800 mb-2 text-sm">
// //                     Upload video file <span className="text-red-500">*</span>
// //                   </label>

// //                   <input
// //                     type="file"
// //                     accept="video/*"
// //                     onChange={onVideoFileChange}
// //                     disabled={isTabLocked("video")}
// //                     className="absolute inset-0 opacity-0 cursor-pointer"
// //                   />

// //                   {!videoBlob && (
// //                     <div className="text-center text-sm text-gray-500 py-6">
// //                       🎬 Click or drag video here
// //                     </div>
// //                   )}

// //                   {videoBlob && (
// //                     <div className="space-y-3">
// //                       {/* Re-upload */}
// //                       <button
// //                         type="button"
// //                         onClick={retryFile}
// //                         className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
// //                       >
// //                         <FiRefreshCw size={16} />
// //                       </button>

// //                       <video
// //                         controls
// //                         src={URL.createObjectURL(videoBlob)}
// //                         className="w-full rounded-lg"
// //                       />

// //                       <p className="text-xs text-green-600 font-medium">
// //                         Video uploaded successfully
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {isTabLocked("video") && (
// //                   <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-2xl">
// //                     <div className="text-center">
// //                       <FiLock className="mx-auto mb-2" />
// //                       <p className="text-sm font-semibold">
// //                         Video locked for this plan
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* Submit */}
// //           <button
// //             className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
// //             onClick={handleSubmit}
// //             disabled={
// //               loading ||
// //               isTabLocked(activeTab) ||
// //               (activeTab === "text" && !testimonial) ||
// //               (activeTab === "audio" && !audioBlob) ||
// //               (activeTab === "video" && !videoBlob) ||
// //               !name ||
// //               !mobile ||
// //               rating === 0
// //             }
// //           >
// //             {loading ? "Processing..." : "Submit Testimonial"}
// //             {loading ? (
// //               <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
// //             ) : (
// //               <FiArrowRight size={18} />
// //             )}
// //           </button>
// //         </div>
// //       </div>
// //     </ModalWrapper>
// //   );
// // };

// // export default GiveTestimonialModal;
// "use client";
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   FiArrowRight,
//   FiLock,
//   FiMic,
//   FiVideo,
//   FiRefreshCw,
// } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";

// const GiveTestimonialModal = ({ open, onClose, advisorId, userId, plan, onOtpRequired }) => {
//   const [mobile, setMobile] = useState("");
//   const [testimonial, setTestimonial] = useState("");
//   const [rating, setRating] = useState(0);
//   const [name, setName] = useState("");
//   const [activeTab, setActiveTab] = useState("text");
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [videoBlob, setVideoBlob] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);

//   const normalizedPlan = String(plan || "free").toLowerCase();
//   const canUseAudio = normalizedPlan === "silver" || normalizedPlan === "gold";
//   const canUseVideo = normalizedPlan === "gold";
//   const isTabLocked = (tab) =>
//     tab === "audio" ? !canUseAudio : tab === "video" ? !canUseVideo : false;

//   const retryFile = () => {
//     setAudioBlob(null);
//     setVideoBlob(null);
//     setShowPreview(false);
//   };

//   const onAudioFileChange = (event) => {
//     const file = event.target.files?.[0] ?? null;
//     setAudioBlob(file);
//     setShowPreview(!!file);
//   };

//   const onVideoFileChange = (event) => {
//     const file = event.target.files?.[0] ?? null;
//     setVideoBlob(file);
//     setShowPreview(!!file);
//   };

//   const uploadToS3 = async (file, type) => {
//     if (!file) return null;

//     if (type === "audio" && !file.type.startsWith("audio/")) {
//       throw new Error("Invalid audio file");
//     }

//     if (type === "video" && !file.type.startsWith("video/")) {
//       throw new Error("Invalid video file");
//     }

//     const MAX_SIZE = 20 * 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       throw new Error("File too large (max 20MB)");
//     }

//     const extension = file.name.split(".").pop();
//     const fileName = `${type}_${Date.now()}_${Math.random()
//       .toString(36)
//       .substring(7)}.${extension}`;

//     const formData = new FormData();
//     formData.append("file", file, fileName);
//     formData.append("type", type);

//     const response = await fetch("/api/upload/media", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Upload failed");
//     }

//     const data = await response.json();
//     return data.url;
//   };

//   const handleSubmit = async () => {
//   setLoading(true);

//   try {
//     // =========================================================
//     // VALIDATE LOCKED PLAN
//     // =========================================================

//     if (isTabLocked(activeTab)) {
//       throw new Error(
//         "This testimonial type is locked for this advisor plan"
//       );
//     }

//     // =========================================================
//     // PREPARE CONTENT
//     // =========================================================

//     let mediaUrl = null;
//     let contentData = null;

//     // =========================================================
//     // UPLOAD AUDIO
//     // =========================================================

//     if (activeTab === "audio" && audioBlob) {
//       mediaUrl = await uploadToS3(audioBlob, "audio");
//     }

//     // =========================================================
//     // UPLOAD VIDEO
//     // =========================================================

//     if (activeTab === "video" && videoBlob) {
//       mediaUrl = await uploadToS3(videoBlob, "video");
//     }

//     // =========================================================
//     // TEXT CONTENT
//     // =========================================================

//     if (activeTab === "text") {
//       contentData = testimonial;
//     }

//     // =========================================================
//     // PAYLOAD
//     // =========================================================

//     const payload = {
//       advisor_id: advisorId,
//       user_id: userId || null,
//       name: name.trim(),
//       mobile_number: mobile.trim(),
//       testimonial_type: activeTab,
//       content: contentData,
//       media_url: mediaUrl,
//       testimonial_rating: rating,
//       is_mobile_verified: true,
//       status: "verified"
//     };

//     // =========================================================
//     // LOGGED-IN USER
//     // DIRECT SUBMIT
//     // =========================================================

//     if (userId && userId !== "" && userId !== null  ) {
//       const response = await fetch(
//         "/api/customer/testimonials",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.error || "Failed to submit testimonial"
//         );
//       }

//       toast.success("Testimonial submitted successfully");

//       onClose();

//       return;
//     }

//     // =========================================================
//     // GUEST USER
//     // SEND OTP ONLY
//     // =========================================================

//     const otpResponse = await fetch("/api/customer/testimonials/send-otp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         phone: mobile,
//         advisor_id: advisorId,
//         testimonial_type: activeTab,
//       }),
//     });

//     const otpResult = await otpResponse.json();

//     if (!otpResponse.ok) {
//       throw new Error(
//         otpResult.error || "Failed to send OTP"
//       );
//     }

//     // =========================================================
//     // OPEN OTP MODAL FROM PARENT
//     // =========================================================

//     onOtpRequired(payload);

//     toast.success("OTP sent successfully");

//     onClose();

//   } catch (err) {
//     console.error(err);

//     toast.error(
//       err.message || "Something went wrong"
//     );

//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <ModalWrapper onClose={() => onClose()}>
//       <div className="bg-white rounded-3xl shadow-xl w-[calc(100vw-2rem)] max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">📷</span>
//             <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-poppins">
//               Give Testimonial
//             </h2>
//           </div>

//           <button
//             type="button" // <--- Prevents form refresh
//             onClick={() => onClose()}
//             className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
//           >
//             <IoClose size={20} />
//           </button>
//         </div>

//         {/* Scrollable Body */}
//         <div className="p-5 sm:p-6 space-y-5 overflow-y-auto no-scrollbar">
//           {/* Tabs Container */}
//           <div className="flex p-1.5 bg-[#F4F5F7] rounded-2xl w-full">
//             <button
//               type="button" // <--- Prevents form refresh
//               onClick={() => {
//                 setActiveTab("text");
//                 setShowPreview(false);
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//                 activeTab === "text"
//                   ? "bg-white shadow-sm text-slate-900"
//                   : "text-slate-500 hover:text-slate-700"
//               }`}
//             >
//               <span className="text-lg opacity-70">📄</span> Text
//             </button>

//             <button
//               type="button" // <--- Prevents form refresh
//               onClick={() => {
//                 if (isTabLocked("audio")) return;
//                 setActiveTab("audio");
//                 setShowPreview(false);
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//                 activeTab === "audio"
//                   ? "bg-white shadow-sm text-[#4E4E98]"
//                   : "text-[#4E4E98]/70 hover:text-[#4E4E98]"
//               } ${isTabLocked("audio") ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               <span className="text-lg opacity-80">🎵</span>
//               Audio
//               {isTabLocked("audio") && (
//                 <FiLock className="ml-1 text-slate-500" size={14} />
//               )}
//             </button>

//             <button
//               type="button" // <--- Prevents form refresh
//               onClick={() => {
//                 if (isTabLocked("video")) return;
//                 setActiveTab("video");
//                 setShowPreview(false);
//               }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
//                 activeTab === "video"
//                   ? "bg-white shadow-sm text-[#4E4E98]"
//                   : "text-[#4E4E98]/70 hover:text-[#4E4E98]"
//               } ${isTabLocked("video") ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               <span className="text-lg opacity-80">🎬</span>
//               Video
//               {isTabLocked("video") && (
//                 <FiLock className="ml-1 text-slate-500" size={14} />
//               )}
//             </button>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             {/* Name Input */}
//             <div>
//               <label className="block font-bold text-slate-800 mb-1.5 text-sm font-poppins">
//                 Your Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Full name"
//                 className="w-full px-4 py-3 bg-white border border-[#E2E2E2] rounded-xl outline-none focus:border-[#0a4d4a] transition-colors placeholder:text-gray-400 text-sm"
//               />
//             </div>

//             {/* Mobile Input */}
//             <div>
//               <label className="block font-bold text-slate-800 mb-1.5 text-sm font-poppins">
//                 Mobile <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 placeholder="10 digit mobile number"
//                 className="w-full px-4 py-3 bg-white border border-[#E2E2E2] rounded-xl outline-none focus:border-[#0a4d4a] transition-colors placeholder:text-gray-400 text-sm"
//               />
//             </div>

//             {/* Rating Stars */}
//             <div>
//               <label className="block font-bold text-slate-800 mb-1.5 text-sm font-poppins">
//                 Rating <span className="text-red-500">*</span>
//               </label>
//               <div className="flex gap-2">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     type="button" // <--- Prevents form refresh
//                     key={star}
//                     onClick={() => setRating(star)}
//                     className={`text-2xl sm:text-3xl transition-colors cursor-pointer ${
//                       star <= rating ? "text-[#F4B400]" : "text-[#E2E2E2]"
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* TEXT MODE */}
//             {activeTab === "text" && (
//               <div>
//                 <label className="block font-bold text-slate-800 mb-1.5 text-sm font-poppins">
//                   Testimonial <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   rows="4"
//                   value={testimonial}
//                   onChange={(e) => setTestimonial(e.target.value)}
//                   placeholder="Share your experience..."
//                   className="w-full px-4 py-3 bg-white border border-[#E2E2E2] rounded-xl outline-none focus:border-[#0a4d4a] transition-colors resize-none placeholder:text-gray-400 text-sm"
//                 />
//               </div>
//             )}

//             {/* AUDIO MODE */}
//             {activeTab === "audio" && (
//               <div className="relative">
//                 <div
//                   className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[120px] ${
//                     audioBlob
//                       ? "border-green-400 bg-green-50"
//                       : "border-gray-300 bg-[#F4F5F7]"
//                   } ${isTabLocked("audio") ? "blur-sm" : ""}`}
//                 >
//                   <label className="block font-bold text-slate-800 mb-2 text-sm text-center w-full">
//                     Upload audio file <span className="text-red-500">*</span>
//                   </label>

//                   <input
//                     type="file"
//                     accept="audio/*"
//                     onChange={onAudioFileChange}
//                     disabled={isTabLocked("audio")}
//                     className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
//                   />

//                   {!audioBlob && (
//                     <div className="text-center text-sm text-gray-500">
//                       🎵 Click or drag audio here
//                     </div>
//                   )}

//                   {audioBlob && (
//                     <div className="space-y-3 w-full relative z-20">
//                       <button
//                         type="button" // <--- Prevents form refresh
//                         onClick={retryFile}
//                         className="absolute -top-10 -right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-30 cursor-pointer"
//                       >
//                         <FiRefreshCw size={16} />
//                       </button>

//                       <audio
//                         controls
//                         src={URL.createObjectURL(audioBlob)}
//                         className="w-full"
//                       />

//                       <p className="text-xs text-green-600 font-medium text-center">
//                         Audio uploaded successfully
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {isTabLocked("audio") && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl z-30">
//                     <div className="text-center">
//                       <FiLock
//                         className="mx-auto mb-2 text-slate-700"
//                         size={24}
//                       />
//                       <p className="text-sm font-bold text-slate-800">
//                         Audio locked for this plan
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* VIDEO MODE */}
//             {activeTab === "video" && (
//               <div className="relative">
//                 <div
//                   className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[120px] ${
//                     videoBlob
//                       ? "border-green-400 bg-green-50"
//                       : "border-gray-300 bg-[#F4F5F7]"
//                   } ${isTabLocked("video") ? "blur-sm" : ""}`}
//                 >
//                   <label className="block font-bold text-slate-800 mb-2 text-sm text-center w-full">
//                     Upload video file <span className="text-red-500">*</span>
//                   </label>

//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={onVideoFileChange}
//                     disabled={isTabLocked("video")}
//                     className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
//                   />

//                   {!videoBlob && (
//                     <div className="text-center text-sm text-gray-500">
//                       🎬 Click or drag video here
//                     </div>
//                   )}

//                   {videoBlob && (
//                     <div className="space-y-3 w-full relative z-20">
//                       <button
//                         type="button" // <--- Prevents form refresh
//                         onClick={retryFile}
//                         className="absolute -top-10 -right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-30 cursor-pointer"
//                       >
//                         <FiRefreshCw size={16} />
//                       </button>

//                       <video
//                         controls
//                         src={URL.createObjectURL(videoBlob)}
//                         className="w-full rounded-lg max-h-[200px] object-cover bg-black"
//                       />

//                       <p className="text-xs text-green-600 font-medium text-center">
//                         Video uploaded successfully
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {isTabLocked("video") && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl z-30">
//                     <div className="text-center">
//                       <FiLock
//                         className="mx-auto mb-2 text-slate-700"
//                         size={24}
//                       />
//                       <p className="text-sm font-bold text-slate-800">
//                         Video locked for this plan
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Spacer to push button down slightly if needed */}
//           <div className="pt-2">
//             <button
//               type="button" // <--- Prevents form refresh
//               className="w-full bg-[#0A4A4A] hover:bg-[#3D645D] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 text-sm sm:text-base font-poppins cursor-pointer"
//               onClick={handleSubmit}
//               disabled={
//                 loading ||
//                 isTabLocked(activeTab) ||
//                 (activeTab === "text" && !testimonial) ||
//                 (activeTab === "audio" && !audioBlob) ||
//                 (activeTab === "video" && !videoBlob) ||
//                 !name ||
//                 !mobile ||
//                 rating === 0
//               }
//             >
//               {loading ? "Processing..." : "Submit Testimonial"}
//               {loading ? (
//                 <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//               ) : (
//                 <FiArrowRight size={18} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </ModalWrapper>
//   );
// };

// export default GiveTestimonialModal;
export default function Page() {
  return null
}