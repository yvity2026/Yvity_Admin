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
console.log("fdghjgfdsfhjkhgfdsfghjkhgfds",advisor);
  // ── Safely read any field name your backend sends ──
  const name       = advisor?.name       ?? advisor?.advisorName     ?? advisor?.fullName      ?? "—";
  const licNo      = advisor?.licenseNo?.services?.[0]?.license       ?? advisor?.licenseNo       ?? advisor?.licenseNumber ?? advisor?.license ?? "—";
  const type       = advisor?.type       ?? advisor?.licenseType     ?? "—";
  const authority  = advisor?.authority  ?? advisor?.issuedBy        ?? "—";
  const validUntil = advisor?.validUntil ?? advisor?.expiryDate      ?? advisor?.validity      ?? "—";
  const plan       = advisor?.plan?.subscription_plan       ?? advisor?.planName        ?? advisor?.subscription  ?? "—";
  const submitted  = advisor?.submittedAt  ?? advisor?.submittedAt     ?? advisor?.createdAt     ?? "—";
  const certName   = advisor?.certificateName ?? advisor?.fileName   ?? advisor?.document      ?? "certificate.jpg";
  const certUrl    = advisor?.licenseUrl  ?? advisor?.docUrl     ?? advisor?.fileUrl       ?? null;

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
        <div className="overflow-y-auto flex-1 no-scrollbar">

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
                {/* <span className="text-[12px]">🏅</span> */}
                {/* <span className="text-[12px]">🏅</span> */}
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