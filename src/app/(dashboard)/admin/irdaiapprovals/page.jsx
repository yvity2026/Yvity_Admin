"use client";
import { useState, useEffect } from "react";
import IrdaiModal from "@/components/IrdaiModal";
import RejectModal from "@/components/RejectModal";
import PriorityModal from "@/components/PriorityModal";
import Link from "next/link";
import {
  useApprovalActions,
  useApprovals,
} from "@/hooks/TanstankQuery/useApprovals";
import IRDAISkeleton from "./loading";
import Image from "next/image";

// ── Icon components ──────────────────────────────────────────────
const IHourglass = ({ color }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12m0 0L7 6.172A2 2 0 016.414 4.758 2 2 0 015 4V2h14v2a2 2 0 01-.586 1.414A2 2 0 0117 6.172L12 12z" />
  </svg>
);
const ICheckCircle = ({ color }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IXCircle = ({ color }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const ICalendar = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ICheckSm = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IXSm = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IHourglassSm = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12" />
  </svg>
);
const ISubmission = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1a7a5a"
    strokeWidth="2.5"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ── Day badge helper ─────────────────────────────────────────────
function DayBadge({ dayType, days }) {
  const colorMap = {
    "day-red": "bg-red-50 text-red-600",
    "day-orange": "bg-orange-50 text-[#c57a00]",
    "day-yellow": "bg-yellow-50 text-yellow-700",
    "day-green": "bg-green-50 text-green-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${colorMap[dayType] || colorMap["day-yellow"]}`}
    >
      <ICalendar />
      {days}
    </span>
  );
}

// ── Avatar ───────────────────────────────────────────────────────
function Avatar({ initials, size = "md", bgClass = "bg-yellow-600" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-xs";
  return (
    <div
      className={`${sizeClass} ${bgClass} rounded-full text-white flex items-center justify-center font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function IRDAIApprovals() {
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState("IRDAI Approvals");
  const [search, setSearch] = useState("");
  // const [rows, setRows]                 = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openReject, setOpenReject] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  // const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, pendingPercentage: 0 });
  const [loading, setLoading] = useState(true);
  // const [error, setError]     = useState("");
  // const [data, setData] = useState(null);
  const { data, isLoading, error } = useApprovals();
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const { approve, reject, isProcessing } = useApprovalActions();

  const rows = data?.data || [];
  const stats = data?.stats || {};

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  // useEffect(() => {
  //   const loadApprovals = async () => {
  //     try {
  //       setLoading(true);
  //       setError("");
  //       const response = await fetch("/api/admin/approvals");
  //       if (!response.ok) throw new Error(`Failed to load approvals: ${response.status}`);

  //       const payload = await response.json();
  //       const items = payload?.data || [];
  //       const nextStats = payload?.stats || { pending: 0, approved: 0, rejected: 0 };
  //       const total = nextStats.pending + nextStats.approved + nextStats.rejected;

  //       setStats({
  //         pending: nextStats.pending || 0,
  //         approved: nextStats.approved || 0,
  //         rejected: nextStats.rejected || 0,
  //         pendingPercentage: total ? ((nextStats.pending / total) * 100).toFixed(2) : 0,
  //       });

  //       const nextRows = items.map((item, index) => {
  //         const name = item.name || "Advisor";
  //         const location = item.location || "Unknown, IN";
  //         const status = item.status || "pending";
  //         const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "AD";
  //         const submittedAt = item.submittedAt ? new Date(item.submittedAt) : new Date();
  //         const diffDays = Math.max(1, Math.floor((Date.now() - submittedAt.getTime()) / 86400000));
  //         const days = `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  //         const fileName = item.licenseUrl ? item.licenseUrl.split("/").pop() : "certificate.jpg";
  //         const dayTypeByStatus = {
  //           pending: diffDays > 3 ? "day-red" : "day-yellow",
  //           approved: "day-green",
  //           rejected: "day-orange",
  //         };
  //         return {
  //           id: item.id, status, initials,
  //           bgClass: index % 2 === 0 ? "bg-[#e8a020]" : "bg-[#1a5a50]",
  //           name, location,
  //           lic: item.licenseUrl ? fileName : "LIC-AP-2022-48291",
  //           type: "Life Insurance",
  //           plan: status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending Review",
  //           submitted: `Submitted ${days} ago`,
  //           days, dayType: dayTypeByStatus[status] || "day-yellow",
  //           certificateName: fileName,
  //         };
  //       });
  //       setRows(nextRows);
  //     } catch (fetchError) {
  //       console.warn("Unable to load advisor approvals", fetchError);
  //       setError("Failed to load approvals");
  //       setRows([]);
  //       setStats({ pending: 0, approved: 0, rejected: 0, pendingPercentage: 0 });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadApprovals();
  // }, []);

  const updateRowStatus = (id, status) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id !== id
          ? item
          : {
              ...item,
              status,
              plan:
                status === "approved"
                  ? "Approved"
                  : status === "rejected"
                    ? "Rejected"
                    : "Pending Review",
              dayType:
                status === "approved"
                  ? "day-green"
                  : status === "rejected"
                    ? "day-orange"
                    : item.dayType,
            },
      ),
    );
  };

  const updateStatsForStatusChange = (nextStatus) => {
    setStats((prev) => {
      const pending = Math.max(0, prev.pending - 1);
      const approved =
        nextStatus === "approved" ? prev.approved + 1 : prev.approved;
      const rejected =
        nextStatus === "rejected" ? prev.rejected + 1 : prev.rejected;
      const total = pending + approved + rejected;
      return {
        pending,
        approved,
        rejected,
        pendingPercentage: total ? ((pending / total) * 100).toFixed(2) : 0,
      };
    });
  };

  const filtered = (rows || []).filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
  !activeFilter ||
  activeFilter === "all" ||
  r.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const approveSubmission = async (id) => {
    if (!id || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", advisorId: id }),
      });
      if (!response.ok) {
        console.error("Approval failed", await response.text());
        return;
      }
      updateRowStatus(id, "approved");
      updateStatsForStatusChange("approved");
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: "approved",
                dayType: "day-green",
                plan: "Approved",
              }
            : null,
        );
        setShowModal(false);
      }
    } catch (err) {
      console.error("Approve submission error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectSubmission = async ({ reason, note }) => {
    if (!selectedSubmission?.id || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          advisorId: selectedSubmission.id,
          reason,
          note,
        }),
      });
      if (!response.ok) {
        console.error("Reject failed", await response.text());
        return;
      }
      updateRowStatus(selectedSubmission.id, "rejected");
      updateStatsForStatusChange("rejected");
      setOpenReject(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error("Reject submission error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Filter button definitions ────────────────────────────────
  const filterButtons = [
    {
      key: "pending",
      label: "Pending",
      icon: <IHourglassSm />,
      activeCls: "bg-[#fff5e6] border-[#e8a020] text-[#c57a00]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
    {
      key: "approved",
      label: "Approved",
      icon: (
        <span className="w-3.5 h-3.5 rounded-full bg-[#1a7a5a] flex items-center justify-center shrink-0">
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      ),
      activeCls: "bg-[#e6f5f0] border-[#1a7a5a] text-[#1a7a5a]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: (
        <span className="text-[#cc3333] font-bold text-sm leading-none">✕</span>
      ),
      activeCls: "bg-[#fff0f0] border-[#cc3333] text-[#cc3333]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
  ];

  if (isLoading) return <IRDAISkeleton />;

  return (
    <div className="flex min-h-screen bg-[#f0f2ee] font-sans">
      {/* Mobile overlay */}
      {/* {showSidebar && (
        <div className="fixed inset-0 bg-black/45 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )} */}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-md:p-3.5">
          {/* Stat cards */}
          <div className="flex flex-wrap gap-4 mb-5">
            {/* Pending */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#fff5e6] flex items-center justify-center">
                  <IHourglass color="#c57a00" />
                </div>
                <span className="bg-[#fff5e6] text-[#c57a00] text-[10px] font-bold rounded-full px-2.5 py-0.5">
                  20 Pending
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">
                {stats?.pending}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">
                Pending Review
              </div>
            </div>

            {/* Approved */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#e6f5f0] flex items-center justify-center">
                  <ICheckCircle color="#1a7a5a" />
                </div>
                <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1">
                  ↑ 18%
                </span>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">
                {stats?.approved}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">
                Approved
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#fff0f0] flex items-center justify-center">
                  <IXCircle color="#cc3333" />
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">
                {stats?.rejected}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">
                Rejected
              </div>
            </div>
          </div>

          {/* Submissions panel */}
          <div className="bg-white rounded-2xl p-[22px_24px] shadow-sm">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-[26px] h-[26px] rounded-lg bg-[#eef4f2] flex items-center justify-center">
                  <ISubmission />
                </div>
                <span className="text-[15px] font-bold text-[#1a3330]">
                  IRDAI Submissions
                </span>
              </div>
              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterButtons.map((btn) => {
                  const isActive = activeFilter === btn.key;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => setActiveFilter(isActive ? null : btn.key)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer ${isActive ? btn.activeCls : btn.defaultCls}`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-3 mb-5 items-center">
              <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
                <input
                  className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="text-white text-lg cursor-pointer shrink-0">
                  →
                </div>
              </div>
            </div>

            {/* Submission rows */}
            <div className="flex flex-col gap-2.5">
              {filtered.length === 0 && (
                <div className="text-center text-gray-300 py-8 text-sm">
                  No submissions found.
                </div>
              )}
              {filtered.map((r, i) => (
                <div
                  key={i}
                  className="bg-[#f9fbf9] rounded-xl px-[18px] py-3.5 flex items-center gap-3.5 border border-[#eef0ee] flex-wrap hover:bg-white hover:shadow-md"
                >
                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                    <Image
                      src={r.profile_pic || "/default-avatar.png"}
                      alt={r.name || "Advisor"}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#1a3330]">
                      {r.name}{" "}
                      <span className="text-gray-400 font-medium">
                        • {r.location}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 break-all sm:break-normal">
                      {r.licenseNo} &bull; {r.type} &bull; {r.plan} &bull;{" "}
                      {r.submittedAt}
                    </div>
                  </div>

                {/*priority */}
<div className="flex flex-wrap items-center gap-2 shrink-0 max-sm:w-full">
  <div className="flex items-center gap-2 w-full sm:w-auto">

    {/* Priority Button */}
    <button
      onClick={() => {
        setSelectedSubmission(r);
        setShowPriorityModal(true);
      }}
      className="px-3 py-1 text-[#8B0000] text-xs font-semibold underline underline-offset-2 bg-transparent border-none cursor-pointer hover:text-red-600"
    >
      Priority
    </button>

    {/* View Button */}
    
  </div>
</div>
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 max-sm:w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <DayBadge dayType={r.dayType} days={r.days} />
                      <button
                        onClick={() => {
                          setSelectedSubmission(r);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-[#0d3330] text-xs font-semibold underline underline-offset-2 bg-transparent border-none cursor-pointer hover:text-[#1a7a5a]"
                      >
                        View
                      </button>
                    </div>

                    {r.status === "pending" && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-[18px] py-1.5 rounded-full text-xs font-semibold border-[1.5px] border-[#b3e0cc] bg-[#e6f5f0] text-[#1a7a5a] cursor-pointer hover:bg-[#1a7a5a] hover:text-white hover:border-[#1a7a5a]"
                          onClick={() => approve(r.id)}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#1a7a5a] flex items-center justify-center shrink-0">
                            <ICheckSm />
                          </span>
                          Approve
                        </button>
                        <button
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-[18px] py-1.5 rounded-full text-xs font-semibold border-[1.5px] border-[#ffcccc] bg-[#fff5f5] text-[#cc3333] cursor-pointer hover:bg-[#cc3333] hover:text-white hover:border-[#cc3333]"
                          onClick={() => {
                            setSelectedSubmission(r);
                            setOpenReject(true);
                          }}
                        >
                          <IXSm /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <IrdaiModal
          advisor={selectedSubmission}
          onClose={() => {
            setShowModal(false);
            setSelectedSubmission(null);
          }}
          onApprove={() =>
            selectedSubmission && approveSubmission(selectedSubmission.id)
          }
          onReject={() => {
            setShowModal(false);
            setOpenReject(true);
          }}
        />
      )}


      {showPriorityModal && (
  <PriorityModal
    onClose={() => setShowPriorityModal(false)}
  />
)}
      {openReject && (
        <RejectModal
          open={openReject}
          setOpen={(value) => {
            if (!value) setSelectedSubmission(null);
            setOpenReject(value);
          }}
          onConfirm={({ reason, note }) =>
            reject({
              advisorId: selectedSubmission.id,
              reason,
              note,
            })
          }
        />
      )}
    </div>
  );
}
