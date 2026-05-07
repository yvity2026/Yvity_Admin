
// // "use client";
// // import { Poppins } from "next/font/google";

// // const poppins = Poppins({
// //   subsets: ["latin"],
// //   weight: ["400", "500", "600", "700"],
// // });

// // export default function IrdaiModal({ advisor, onClose, onApprove, onReject }) {
// //   // ── Safely read any field name your backend sends ──
// //   const name       = advisor?.name       ?? advisor?.advisorName  ?? advisor?.fullName   ?? "—";
// //   const licNo      = advisor?.lic        ?? advisor?.licenseNo    ?? advisor?.licenseNumber ?? advisor?.license ?? "—";
// //   const type       = advisor?.type       ?? advisor?.licenseType  ?? "—";
// //   const authority  = advisor?.authority  ?? advisor?.issuedBy     ?? "—";
// //   const validUntil = advisor?.validUntil ?? advisor?.expiryDate   ?? advisor?.validity   ?? "—";
// //   const plan       = advisor?.plan       ?? advisor?.planName     ?? advisor?.subscription ?? "—";
// //   const submitted  = advisor?.submitted  ?? advisor?.submittedAt  ?? advisor?.createdAt  ?? "—";
// //   const certName   = advisor?.certificateName ?? advisor?.fileName ?? advisor?.document  ?? "certificate.jpg";
// //   const certUrl    = advisor?.certificateUrl  ?? advisor?.docUrl  ?? advisor?.fileUrl    ?? null;

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
// //       {/*
// //         Outer card:
// //         - width / maxWidth / borderRadius / shadow — UNTOUCHED from original
// //         - Added: maxHeight + display:flex + flexDirection:column
// //           so the card never grows taller than the viewport
// //       */}
// //       <div
// //         style={{
// //           width: "100%",
// //           maxWidth: "430px",
// //           maxHeight: "90vh",          /* ← shrinks with viewport height */
// //           display: "flex",            /* ← needed so children can flex-grow */
// //           flexDirection: "column",
// //           backgroundColor: "#ffffff",
// //           borderRadius: "22px",
// //           overflow: "hidden",
// //           boxShadow: "0 12px 48px rgba(0,0,0,0.14)",
// //           fontFamily: "inherit",
// //         }}
// //       >

// //         {/* ── Header — pinned, never scrolls ── */}
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "space-between",
// //             padding: "17px 22px 16px",
// //             borderBottom: "1px solid #EFEFEF",
// //             flexShrink: 0,            /* ← always visible */
// //           }}
// //         >
// //           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //             <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827">
// //               <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
// //             </svg>
// //             <span style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>IRDAI License</span>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             style={{
// //               width: "30px",
// //               height: "30px",
// //               borderRadius: "50%",
// //               background: "#F0F4F3",
// //               border: "none",
// //               cursor: "pointer",
// //               fontSize: "13px",
// //               color: "#9CA3AF",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //             }}
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         {/* ── Scrollable body — rows + certificate ── */}
// //         <div
// //           style={{
// //             overflowY: "auto",        /* ← scrollbar appears only when needed */
// //             flex: 1,
// //           }}
// //         >

// //           {/* ── Rows ── */}
// //           <div style={{ padding: "0 24px" }}>
// //             {[
// //               { label: "Advisor",     value: name },
// //               { label: "License No.", value: licNo },
// //               { label: "Type",        value: type },
// //               { label: "Authority",   value: authority },
// //               { label: "Valid Until", value: validUntil },
// //             ].map((row) => (
// //               <div
// //                 key={row.label}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "flex-start",
// //                   justifyContent: "space-between",
// //                   gap: "16px",
// //                   padding: "14px 0",
// //                   borderBottom: "1px solid #F3F3F3",
// //                 }}
// //               >
// //                 <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>
// //                   {row.label}
// //                 </span>
// //                 <span style={{ fontSize: "13.5px", color: "#111827", fontWeight: 500, textAlign: "right", wordBreak: "break-word", minWidth: 0 }}>
// //                   {row.value}
// //                 </span>
// //               </div>
// //             ))}

// //             {/* Plan Paid */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "space-between",
// //                 gap: "16px",
// //                 padding: "14px 0",
// //                 borderBottom: "1px solid #F3F3F3",
// //               }}
// //             >
// //               <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>Plan Paid</span>
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "5px",
// //                   background: "#FEF3C7",
// //                   borderRadius: "999px",
// //                   padding: "4px 12px",
// //                   flexShrink: 0,
// //                 }}
// //               >
// //                 <span style={{ fontSize: "12px" }}>🏅</span>
// //                 <span style={{ fontSize: "12px", color: "#92400E", fontWeight: 600 }}>{plan}</span>
// //               </div>
// //             </div>

// //             {/* Submitted */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "flex-start",
// //                 justifyContent: "space-between",
// //                 gap: "16px",
// //                 padding: "14px 0",
// //               }}
// //             >
// //               <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>Submitted</span>
// //               <span style={{ fontSize: "13.5px", color: "#111827", fontWeight: 500, textAlign: "right" }}>{submitted}</span>
// //             </div>
// //           </div>

// //           {/* ── Certificate Box ── */}
// //           <div
// //             style={{
// //               margin: "0 18px 20px",
// //               border: "1.5px dashed #A7CFC8",
// //               borderRadius: "16px",
// //               background: "#EDF7F5",
// //               padding: "28px 20px 22px",
// //               textAlign: "center",
// //             }}
// //           >
// //             <div style={{ fontSize: "38px", lineHeight: 1, marginBottom: "10px" }}>🏷️</div>
// //             <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "5px" }}>
// //               IRDAI Certificate
// //             </div>
// //             <div style={{ fontSize: "12.5px", color: "#6B7280", marginBottom: "16px", wordBreak: "break-all" }}>
// //               {licNo} • {certName}
// //             </div>
// //             <button
// //               onClick={() => certUrl && window.open(certUrl, "_blank")}
// //               style={{
// //                 background: "none",
// //                 border: "none",
// //                 fontSize: "13.5px",
// //                 fontWeight: 700,
// //                 color: "#0F766E",
// //                 cursor: "pointer",
// //               }}
// //             >
// //               View Document
// //             </button>
// //           </div>

// //         </div>

// //         {/* ── Buttons — pinned at bottom, never scrolls ── */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "12px",
// //             padding: "12px 18px 22px",
// //             flexShrink: 0,            /* ← always visible */
// //             backgroundColor: "#ffffff",
// //             borderTop: "1px solid #F3F3F3",
// //           }}
// //         >
// //           <button
// //             onClick={onApprove}
// //             style={{
// //               flex: 1,
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "7px",
// //               background: "#E8F5F0",
// //               border: "none",
// //               borderRadius: "10px",
// //               padding: "13px 0",
// //               fontSize: "13.5px",
// //               fontWeight: 600,
// //               color: "#0F766E",
// //               cursor: "pointer",
// //             }}
// //           >
// //             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
// //               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
// //               <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
// //             </svg>
// //             Approve
// //           </button>
// //           <button
// //             onClick={onReject}
// //             style={{
// //               flex: 1,
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "7px",
// //               background: "#FEF0F0",
// //               border: "none",
// //               borderRadius: "10px",
// //               padding: "13px 0",
// //               fontSize: "13.5px",
// //               fontWeight: 600,
// //               color: "#DC2626",
// //               cursor: "pointer",
// //             }}
// //           >
// //             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
// //               <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
// //             </svg>
// //             Reject
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { Poppins } from "next/font/google";
// import { useEffect } from "react";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// export default function IrdaiModal({ advisor, onClose, onApprove, onReject }) {
//   // ── Lock body scroll when modal is open ──
//   useEffect(() => {
//     const original = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = original;
//     };
//   }, []);

//   // ── Safely read any field name your backend sends ──
//   const name       = advisor?.name       ?? advisor?.advisorName  ?? advisor?.fullName   ?? "—";
//   const licNo      = advisor?.lic        ?? advisor?.licenseNo    ?? advisor?.licenseNumber ?? advisor?.license ?? "—";
//   const type       = advisor?.type       ?? advisor?.licenseType  ?? "—";
//   const authority  = advisor?.authority  ?? advisor?.issuedBy     ?? "—";
//   const validUntil = advisor?.validUntil ?? advisor?.expiryDate   ?? advisor?.validity   ?? "—";
//   const plan       = advisor?.plan       ?? advisor?.planName     ?? advisor?.subscription ?? "—";
//   const submitted  = advisor?.submitted  ?? advisor?.submittedAt  ?? advisor?.createdAt  ?? "—";
//   const certName   = advisor?.certificateName ?? advisor?.fileName ?? advisor?.document  ?? "certificate.jpg";
//   const certUrl    = advisor?.certificateUrl  ?? advisor?.docUrl  ?? advisor?.fileUrl    ?? null;

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
//           maxHeight: "90vh",
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "#ffffff",
//           borderRadius: "22px",
//           overflow: "hidden",
//           boxShadow: "0 12px 48px rgba(0,0,0,0.14)",
//           fontFamily: "inherit",
//         }}
//       >

//         {/* ── Header — pinned, never scrolls ── */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "17px 22px 16px",
//             borderBottom: "1px solid #EFEFEF",
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827">
//               <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
//             </svg>
//             <span style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>IRDAI License</span>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               width: "30px",
//               height: "30px",
//               borderRadius: "50%",
//               background: "#F0F4F3",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "13px",
//               color: "#9CA3AF",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* ── Scrollable body — rows + certificate ── */}
//         <div
//           style={{
//             overflowY: "auto",
//             flex: 1,
//           }}
//         >

//           {/* ── Rows ── */}
//           <div style={{ padding: "0 24px" }}>
//             {[
//               { label: "Advisor",     value: name },
//               { label: "License No.", value: licNo },
//               { label: "Type",        value: type },
//               { label: "Authority",   value: authority },
//               { label: "Valid Until", value: validUntil },
//             ].map((row) => (
//               <div
//                 key={row.label}
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   justifyContent: "space-between",
//                   gap: "16px",
//                   padding: "14px 0",
//                   borderBottom: "1px solid #F3F3F3",
//                 }}
//               >
//                 <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>
//                   {row.label}
//                 </span>
//                 <span style={{ fontSize: "13.5px", color: "#111827", fontWeight: 500, textAlign: "right", wordBreak: "break-word", minWidth: 0 }}>
//                   {row.value}
//                 </span>
//               </div>
//             ))}

//             {/* Plan Paid */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: "16px",
//                 padding: "14px 0",
//                 borderBottom: "1px solid #F3F3F3",
//               }}
//             >
//               <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>Plan Paid</span>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                   background: "#FEF3C7",
//                   borderRadius: "999px",
//                   padding: "4px 12px",
//                   flexShrink: 0,
//                 }}
//               >
//                 <span style={{ fontSize: "12px" }}>🏅</span>
//                 <span style={{ fontSize: "12px", color: "#92400E", fontWeight: 600 }}>{plan}</span>
//               </div>
//             </div>

//             {/* Submitted */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 gap: "16px",
//                 padding: "14px 0",
//               }}
//             >
//               <span style={{ fontSize: "13.5px", color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>Submitted</span>
//               <span style={{ fontSize: "13.5px", color: "#111827", fontWeight: 500, textAlign: "right" }}>{submitted}</span>
//             </div>
//           </div>

//           {/* ── Certificate Box ── */}
//           <div
//             style={{
//               margin: "0 18px 20px",
//               border: "1.5px dashed #A7CFC8",
//               borderRadius: "16px",
//               background: "#EDF7F5",
//               padding: "28px 20px 22px",
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: "38px", lineHeight: 1, marginBottom: "10px" }}>🏷️</div>
//             <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "5px" }}>
//               IRDAI Certificate
//             </div>
//             <div style={{ fontSize: "12.5px", color: "#6B7280", marginBottom: "16px", wordBreak: "break-all" }}>
//               {licNo} • {certName}
//             </div>
//             <button
//               onClick={() => certUrl && window.open(certUrl, "_blank")}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "13.5px",
//                 fontWeight: 700,
//                 color: "#0F766E",
//                 cursor: "pointer",
//               }}
//             >
//               View Document
//             </button>
//           </div>

//         </div>

//         {/* ── Buttons — pinned at bottom, never scrolls ── */}
//         <div
//           style={{
//             display: "flex",
//             gap: "12px",
//             padding: "12px 18px 22px",
//             flexShrink: 0,
//             backgroundColor: "#ffffff",
//             borderTop: "1px solid #F3F3F3",
//           }}
//         >
//           <button
//             onClick={onApprove}
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "7px",
//               background: "#E8F5F0",
//               border: "none",
//               borderRadius: "10px",
//               padding: "13px 0",
//               fontSize: "13.5px",
//               fontWeight: 600,
//               color: "#0F766E",
//               cursor: "pointer",
//             }}
//           >
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//               <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             Approve
//           </button>
//           <button
//             onClick={onReject}
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "7px",
//               background: "#FEF0F0",
//               border: "none",
//               borderRadius: "10px",
//               padding: "13px 0",
//               fontSize: "13.5px",
//               fontWeight: 600,
//               color: "#DC2626",
//               cursor: "pointer",
//             }}
//           >
//             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
//               <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
//             </svg>
//             Reject
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";
import { Poppins } from "next/font/google";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function IrdaiModal({ advisor, onClose, onApprove, onReject }) {
  // ── Lock body scroll when modal is open ──
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // // ── Safely read any field name your backend sends ──
  // const name       = advisor?.name       ?? advisor?.advisorName     ?? advisor?.fullName      ?? "—";
  // const licNo      = advisor?.lic        ?? advisor?.licenseNo       ?? advisor?.licenseNumber ?? advisor?.license ?? "—";
  // const type       = advisor?.type       ?? advisor?.licenseType     ?? "—";
  // const authority  = advisor?.authority  ?? advisor?.issuedBy        ?? "—";
  // const validUntil = advisor?.validUntil ?? advisor?.expiryDate      ?? advisor?.validity      ?? "—";
  // const plan       = advisor?.plan       ?? advisor?.planName        ?? advisor?.subscription  ?? "—";
  // const submitted  = advisor?.submitted  ?? advisor?.submittedAt     ?? advisor?.createdAt     ?? "—";
  // const certName   = advisor?.certificateName ?? advisor?.fileName   ?? advisor?.document      ?? "certificate.jpg";
  // const certUrl    = advisor?.certificateUrl  ?? advisor?.docUrl     ?? advisor?.fileUrl       ?? null;

  const rows = [
    { label: "Advisor",     value: name },
    { label: "License No.", value: licNo },
    { label: "Type",        value: type },
    { label: "Authority",   value: authority },
    { label: "Valid Until", value: validUntil },
  ];

  return (
    <div className={`${poppins.className} fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4`}>

      {/* Modal card */}
      <div className="w-full max-w-[430px] max-h-[90vh] flex flex-col bg-white rounded-[22px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.14)]">

        {/* ── Header — pinned ── */}
        <div className="flex items-center justify-between px-[22px] py-[17px] border-b border-[#EFEFEF] shrink-0">
          <div className="flex items-center gap-[10px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
            </svg>
            <span className="text-[15px] font-semibold text-gray-900">IRDAI License</span>
          </div>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] rounded-full bg-[#F0F4F3] border-none cursor-pointer text-[13px] text-gray-400 flex items-center justify-center"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1">

          {/* Rows */}
          <div className="px-6">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-[14px] border-b border-[#F3F3F3]"
              >
                <span className="text-[13.5px] text-gray-400 font-normal shrink-0">
                  {row.label}
                </span>
                <span className="text-[13.5px] text-gray-900 font-medium text-right break-words min-w-0">
                  {row.value}
                </span>
              </div>
            ))}

            {/* Plan Paid */}
            <div className="flex items-center justify-between gap-4 py-[14px] border-b border-[#F3F3F3]">
              <span className="text-[13.5px] text-gray-400 font-normal shrink-0">Plan Paid</span>
              <div className="flex items-center gap-[5px] bg-amber-100 rounded-full px-3 py-1 shrink-0">
                <span className="text-[12px]">🏅</span>
                <span className="text-[12px] text-amber-900 font-semibold">{plan}</span>
              </div>
            </div>

            {/* Submitted */}
            <div className="flex items-start justify-between gap-4 py-[14px]">
              <span className="text-[13.5px] text-gray-400 font-normal shrink-0">Submitted</span>
              <span className="text-[13.5px] text-gray-900 font-medium text-right">{submitted}</span>
            </div>
          </div>

          {/* Certificate Box */}
          <div className="mx-[18px] mb-5 border-[1.5px] border-dashed border-[#A7CFC8] rounded-2xl bg-[#EDF7F5] px-5 pt-7 pb-[22px] text-center">
           <img
  src="/images/certificate.png"
  alt="IRDAI Certificate"
  className="w-10 h-10 object-contain mx-auto mb-[10px]"
/>
            <div className="text-[16px] font-bold text-gray-900 mb-[5px]">IRDAI Certificate</div>
            <div className="text-[12.5px] text-gray-500 mb-4 break-all">
              {licNo} • {certName}
            </div>
            <button
              onClick={() => certUrl && window.open(certUrl, "_blank")}
              className="bg-transparent border-none text-[13.5px] font-bold text-teal-700 cursor-pointer"
            >
              View Document
            </button>
          </div>
        </div>

        {/* ── Buttons — pinned at bottom ── */}
        <div className="flex gap-3 px-[18px] pt-3 pb-[22px] shrink-0 bg-white border-t border-[#F3F3F3]">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-[7px] bg-[#E8F5F0] border-none rounded-[10px] py-[13px] text-[13.5px] font-semibold text-teal-700 cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Approve
          </button>

          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-[7px] bg-[#FEF0F0] border-none rounded-[10px] py-[13px] text-[13.5px] font-semibold text-red-600 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}