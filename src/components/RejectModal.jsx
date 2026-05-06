

// // "use client";
// // import { useState, useEffect } from "react";
// // import { Poppins } from "next/font/google";

// // const poppins = Poppins({
// //   subsets: ["latin"],
// //   weight: ["400", "500", "600", "700"],
// // });

// // export default function RejectModal({ onClose, onConfirm }) {

// //   const [showRejectModal, setShowRejectModal] = useState(true);
// //   const [reason, setReason] = useState("");
// //   const [note, setNote] = useState("");

// //   // ── Lock body scroll when modal is open ──
// //   useEffect(() => {
// //     const original = document.body.style.overflow;
// //     document.body.style.overflow = "hidden";
// //     return () => {
// //       document.body.style.overflow = original;
// //     };
// //   }, []);

// //   // close popup function
// //   const handleClose = () => {
// //     setShowRejectModal(false);
// //     if (onClose) {
// //       onClose();
// //     }
// //   };

// //   // if closed return nothing
// //   if (!showRejectModal) return null;

// //   return (
// //     <div
// //       className={poppins.className}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         zIndex: 9999,
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         backgroundColor: "rgba(0,0,0,0.30)",
// //         padding: "16px",
// //       }}
// //     >
// //       <div
// //         style={{
// //           width: "100%",
// //           maxWidth: "430px",
// //           backgroundColor: "#ffffff",
// //           borderRadius: "16px",
// //           overflow: "hidden",
// //           boxShadow: "0 10px 40px rgba(0,0,0,0.16)",
// //         }}
// //       >

// //         {/* ── Header ── */}
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "space-between",
// //             padding: "16px 18px 14px",
// //             borderBottom: "1px solid #EFEFEF",
// //           }}
// //         >
// //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// //             <span style={{ fontSize: "17px", lineHeight: 1 }}>⚠️</span>
// //             <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
// //               Reject IRDAI Submission
// //             </span>
// //           </div>
// //           <button
// //             onClick={handleClose}
// //             style={{
// //               width: "28px",
// //               height: "28px",
// //               borderRadius: "50%",
// //               background: "#F3F4F6",
// //               border: "none",
// //               cursor: "pointer",
// //               fontSize: "13px",
// //               color: "#6B7280",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //             }}
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         {/* ── Warning Banner ── */}
// //         <div
// //           style={{
// //             background: "#FEF2F2",
// //             border: "1px solid #FECACA",
// //             margin: "14px 18px 0",
// //             borderRadius: "8px",
// //             padding: "9px 14px",
// //             textAlign: "center",
// //           }}
// //         >
// //           <span style={{ fontSize: "12.5px", color: "#DC2626", fontWeight: 500 }}>
// //             This will mark the advisor's profile as "Action Required"
// //           </span>
// //         </div>

// //         {/* ── Form ── */}
// //         <div style={{ padding: "16px 18px 0" }}>

// //           {/* Reason label */}
// //           <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
// //             Reason for Rejection
// //           </div>

// //           {/* Reason input */}
// //           <input
// //             type="text"
// //             value={reason}
// //             onChange={(e) => setReason(e.target.value)}
// //             placeholder="License number mismatch"
// //             style={{
// //               width: "100%",
// //               boxSizing: "border-box",
// //               border: "none",
// //               borderBottom: "1px solid #E5E7EB",
// //               padding: "8px 0 10px",
// //               fontSize: "13.5px",
// //               color: "#374151",
// //               outline: "none",
// //               background: "transparent",
// //               fontFamily: "inherit",
// //             }}
// //           />

// //           {/* Additional Note label */}
// //           <div
// //             style={{
// //               fontSize: "13.5px",
// //               fontWeight: 700,
// //               color: "#111827",
// //               marginTop: "18px",
// //               marginBottom: "8px",
// //             }}
// //           >
// //             Additional Note{" "}
// //             <span style={{ fontWeight: 400, color: "#6B7280" }}>(shown to advisor)</span>
// //           </div>

// //           {/* Textarea */}
// //           <textarea
// //             value={note}
// //             onChange={(e) => setNote(e.target.value)}
// //             placeholder="Explain what the advisor needs to fix…."
// //             rows={4}
// //             style={{
// //               width: "100%",
// //               boxSizing: "border-box",
// //               border: "none",
// //               resize: "none",
// //               padding: "8px 0",
// //               fontSize: "13px",
// //               color: "#374151",
// //               outline: "none",
// //               background: "transparent",
// //               fontFamily: "inherit",
// //               lineHeight: "1.6",
// //             }}
// //           />
// //         </div>

// //         {/* ── Buttons ── */}
// //         <div style={{ display: "flex", borderTop: "1px solid #F0F0F0", marginTop: "10px" }}>
// //           <button
// //             onClick={handleClose}
// //             style={{
// //               flex: 1,
// //               padding: "15px 0",
// //               background: "#EF4444",
// //               border: "none",
// //               fontSize: "14px",
// //               fontWeight: 700,
// //               color: "#ffffff",
// //               cursor: "pointer",
// //             }}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={() => onConfirm?.({ reason, note })}
// //             style={{
// //               flex: 1,
// //               padding: "15px 0",
// //               background: "#1A3A2A",
// //               border: "none",
// //               fontSize: "14px",
// //               fontWeight: 700,
// //               color: "#C9A227",
// //               cursor: "pointer",
// //             }}
// //           >
// //             Confirm Reject
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useState, useEffect } from "react";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function RejectModal({ onClose, onConfirm }) {

//   const [reason, setReason] = useState("");
//   const [note, setNote] = useState("");

//   // ── Lock body scroll when modal is open ──
//   useEffect(() => {
//     const original = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = original;
//     };
//   }, []);

//   return (
//     <div
//       className={poppins.className}
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9999,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "rgba(0,0,0,0.30)",
//         padding: "16px",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "430px",
//           backgroundColor: "#ffffff",
//           borderRadius: "16px",
//           overflow: "hidden",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.16)",
//         }}
//       >

//         {/* ── Header ── */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "16px 18px 14px",
//             borderBottom: "1px solid #EFEFEF",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <span style={{ fontSize: "17px", lineHeight: 1 }}>⚠️</span>
//             <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
//               Reject IRDAI Submission
//             </span>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               width: "28px",
//               height: "28px",
//               borderRadius: "50%",
//               background: "#F3F4F6",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "13px",
//               color: "#6B7280",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* ── Warning Banner ── */}
//         <div
//           style={{
//             background: "#FEF2F2",
//             border: "1px solid #FECACA",
//             margin: "14px 18px 0",
//             borderRadius: "8px",
//             padding: "9px 14px",
//             textAlign: "center",
//           }}
//         >
//           <span style={{ fontSize: "12.5px", color: "#DC2626", fontWeight: 500 }}>
//             This will mark the advisor's profile as "Action Required"
//           </span>
//         </div>

//         {/* ── Form ── */}
//         <div style={{ padding: "16px 18px 0" }}>

//           <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
//             Reason for Rejection
//           </div>

//           <input
//             type="text"
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="License number mismatch"
//             style={{
//               width: "100%",
//               boxSizing: "border-box",
//               border: "none",
//               borderBottom: "1px solid #E5E7EB",
//               padding: "8px 0 10px",
//               fontSize: "13.5px",
//               color: "#374151",
//               outline: "none",
//               background: "transparent",
//               fontFamily: "inherit",
//             }}
//           />

//           <div
//             style={{
//               fontSize: "13.5px",
//               fontWeight: 700,
//               color: "#111827",
//               marginTop: "18px",
//               marginBottom: "8px",
//             }}
//           >
//             Additional Note{" "}
//             <span style={{ fontWeight: 400, color: "#6B7280" }}>(shown to advisor)</span>
//           </div>

//           <textarea
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             placeholder="Explain what the advisor needs to fix…."
//             rows={4}
//             style={{
//               width: "100%",
//               boxSizing: "border-box",
//               border: "none",
//               resize: "none",
//               padding: "8px 0",
//               fontSize: "13px",
//               color: "#374151",
//               outline: "none",
//               background: "transparent",
//               fontFamily: "inherit",
//               lineHeight: "1.6",
//             }}
//           />
//         </div>

//         {/* ── Buttons ── */}
//         <div style={{ display: "flex", borderTop: "1px solid #F0F0F0", marginTop: "10px" }}>
//           <button
//             onClick={onClose}
//             style={{
//               flex: 1,
//               padding: "15px 0",
//               background: "#EF4444",
//               border: "none",
//               fontSize: "14px",
//               fontWeight: 700,
//               color: "#ffffff",
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onConfirm?.({ reason, note })}
//             style={{
//               flex: 1,
//               padding: "15px 0",
//               background: "#1A3A2A",
//               border: "none",
//               fontSize: "14px",
//               fontWeight: 700,
//               color: "#C9A227",
//               cursor: "pointer",
//             }}
//           >
//             Confirm Reject
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  // ── Lock body scroll when modal is open ──
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className={`${poppins.className} fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4`}
    >
      <div className="w-full max-w-[430px] bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.16)]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-[18px] pt-4 pb-[14px] border-b border-[#EFEFEF]">
          <div className="flex items-center gap-2">
            <span className="text-[17px] leading-none">⚠️</span>
            <span className="text-[15px] font-bold text-gray-900">
              Reject IRDAI Submission
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 border-none cursor-pointer text-[13px] text-gray-500 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* ── Warning Banner ── */}
        <div className="mx-[18px] mt-[14px] bg-red-50 border border-red-200 rounded-lg px-[14px] py-[9px] text-center">
          <span className="text-[12.5px] text-red-600 font-medium">
            This will mark the advisor's profile as "Action Required"
          </span>
        </div>

        {/* ── Form ── */}
        <div className="px-[18px] pt-4">

          <div className="text-[13.5px] font-bold text-gray-900 mb-2">
            Reason for Rejection
          </div>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="License number mismatch"
            className="w-full box-border border-0 border-b border-gray-200 py-2 pb-[10px] text-[13.5px] text-gray-700 outline-none bg-transparent font-[inherit] placeholder:text-gray-400"
          />

          <div className="text-[13.5px] font-bold text-gray-900 mt-[18px] mb-2">
            Additional Note{" "}
            <span className="font-normal text-gray-500">(shown to advisor)</span>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain what the advisor needs to fix…."
            rows={4}
            className="w-full box-border border-0 resize-none py-2 text-[13px] text-gray-700 outline-none bg-transparent font-[inherit] leading-relaxed placeholder:text-gray-400"
          />
        </div>

        {/* ── Buttons ── */}
        <div className="flex border-t border-[#F0F0F0] mt-[10px]">
          <button
            onClick={onClose}
            className="flex-1 py-[15px] bg-red-500 border-none text-[14px] font-bold text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm?.({ reason, note })}
            className="flex-1 py-[15px] bg-[#1A3A2A] border-none text-[14px] font-bold text-[#C9A227] cursor-pointer"
          >
            Confirm Reject
          </button>
        </div>

      </div>
    </div>
  );
}