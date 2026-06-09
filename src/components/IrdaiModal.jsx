"use client";
import { Poppins } from "next/font/google";
import AdminModal from "@/components/admin/ui/AdminModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function IrdaiModal({ advisor, onClose, onApprove, onReject }) {
  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const status =
    advisor?.status ||
    (advisor?.account_status === "active"
      ? "approved"
      : advisor?.account_status === "action_required"
      ? "rejected"
      : "pending");

  const name =
    advisor?.name ?? advisor?.advisorName ?? advisor?.fullName ?? "—";
  const email = advisor?.email ?? advisor?.user?.email ?? "—";
  const phone = advisor?.phone ?? advisor?.user?.mobile ?? "—";
  const location = advisor?.location ?? advisor?.city ?? "—";
  const licNo =
    advisor?.licenseNo?.services?.[0]?.license ??
    advisor?.licenseNo ??
    advisor?.licenseNumber ??
    advisor?.license ??
    "—";
  const type = advisor?.type ?? advisor?.licenseType ?? "—";
  const authority = advisor?.authority ?? advisor?.issuedBy ?? "—";
  const validUntil =
    formatDate(advisor?.validUntil ?? advisor?.expiryDate ?? advisor?.validity);
  const plan =
    typeof advisor?.plan === "string"
      ? advisor.plan
      : advisor?.plan?.subscription_plan ?? advisor?.planName ?? advisor?.subscription ?? "Free";
  const submitted = formatDate(
    advisor?.submittedAt ?? advisor?.createdAt ?? advisor?.created_at,
  );
  const updatedAt = formatDate(advisor?.updatedAt ?? advisor?.updated_at);
  const certName =
    advisor?.certificateName ?? advisor?.fileName ?? advisor?.document ?? "certificate.jpg";
  const certUrl = advisor?.licenseUrl ?? advisor?.docUrl ?? advisor?.fileUrl ?? null;

  const rows = [
    { label: "Advisor", value: name },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Location", value: location },
    { label: "License No.", value: licNo },
    { label: "Type", value: type },
    { label: "Authority", value: authority },
    { label: "Valid Until", value: validUntil },
    { label: "Plan", value: plan },
    { label: "Submitted", value: submitted },
    { label: "Last Updated", value: updatedAt },
    { label: "Status", value: status || "pending" },
  ];

  if (!advisor) return null;

  return (
    <AdminModal
      open={Boolean(advisor)}
      onClose={onClose}
      title="IRDAI License"
      size="sm"
      className={poppins.className}
      footer={
        status === "pending" ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onApprove}
              className="flex flex-1 items-center justify-center gap-[7px] rounded-[10px] border-none bg-[#E8F5F0] py-[13px] text-[13.5px] font-semibold text-teal-700"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve
            </button>

            <button
              type="button"
              onClick={onReject}
              className="flex flex-1 items-center justify-center gap-[7px] rounded-[10px] border-none bg-[#FEF0F0] py-[13px] text-[13.5px] font-semibold text-red-600"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
              Reject
            </button>
          </div>
        ) : (
          <div className="rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-[13px] text-center text-[13.5px] font-semibold text-gray-600">
            {status === "approved"
              ? "This submission has already been approved."
              : "This submission has already been rejected."}
          </div>
        )
      }
    >
      <div className="no-scrollbar">
        <div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 border-b border-[#F3F3F3] py-[8px]"
            >
              <span className="shrink-0 text-[13.5px] font-normal text-gray-400">
                {row.label}
              </span>
              <span className="min-w-0 break-words text-right text-[13.5px] font-medium text-gray-900">
                {row.value}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 border-b border-[#F3F3F3] py-[14px]">
            <span className="shrink-0 text-[13.5px] font-normal text-gray-400">Plan Paid</span>
            <div className="flex shrink-0 items-center gap-[5px] rounded-full bg-amber-100 px-3 py-1">
              <span className="text-[12px]">🏅</span>
              <span className="text-[12px] font-semibold text-amber-900">{plan}</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 py-[14px]">
            <span className="shrink-0 text-[13.5px] font-normal text-gray-400">Submitted</span>
            <span className="text-right text-[13.5px] font-medium text-gray-900">{submitted}</span>
          </div>
        </div>

        <div className="mb-2 rounded-2xl border-[1.5px] border-dashed border-[#A7CFC8] bg-[#EDF7F5] px-5 pb-[22px] pt-7 text-center">
          <img
            src="/images/certificate.png"
            alt="IRDAI Certificate"
            className="mx-auto mb-[10px] h-10 w-10 object-contain"
          />
          <div className="mb-[5px] text-[16px] font-bold text-gray-900">IRDAI Certificate</div>
          <div className="mb-4 break-all text-[12.5px] text-gray-500">
            {licNo} • {certName}
          </div>
          <button
            type="button"
            onClick={() => certUrl && window.open(certUrl, "_blank")}
            disabled={!certUrl}
            className={`border-none bg-transparent text-[13.5px] font-bold ${certUrl ? "text-teal-700 hover:text-teal-900" : "cursor-not-allowed text-gray-400"}`}
          >
            {certUrl ? "View Document" : "No document available"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
