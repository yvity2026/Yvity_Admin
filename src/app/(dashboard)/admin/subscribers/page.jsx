"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdvisorProfile from "@/components/AdvisorProfile";
import { useAdvisors } from "@/hooks/TanstankQuery/useAdvisor";
import AdvisorsSkeleton from "./loading";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import Image from "next/image";

const SUBSCRIBERS_PER_PAGE = 5;

function Avatar({ src, initials, size = "md" }) {
  const sizeClass =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  if (src) {
    return (
      <div className={`${sizeClass} relative rounded-full overflow-hidden`}>
        <Image
          src={src}
          alt="avatar"
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold`}
    >
      {initials}
    </div>
  );
}

function PlanBadge({ plan }) {
  const normalizedPlan = (plan || "").toLowerCase();

  const styles = {
    gold: "bg-yellow-100 text-yellow-800",
    silver: "bg-slate-100 text-slate-600",
    free: "bg-green-50 text-green-800",
  };

  const labels = {
    gold: "👑 Gold",
    silver: "🥇 Silver",
    free: "Free",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-semibold ${
        styles[normalizedPlan] || styles.free
      }`}
    >
      {labels[normalizedPlan] || "Free"}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold">
        Active
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="bg-red-100 text-red-700 inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold">
        Suspended
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-800 inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold">
      Under Review
    </span>
  );
}

function ScoreBar({ score }) {
  const fillClass =
    score >= 80 ? "bg-[#0a4a4a]" : score >= 50 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${fillClass}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-xs font-semibold text-gray-700 min-w-fit">{score}%</span>
    </div>
  );
}

export default function AdvisorsDashboard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  const { data, isLoading, error } = useAdvisors();
  const advisors = data?.data || [];

  const filtered = advisors.filter(
    (a) =>
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.company || "").toLowerCase().includes(search.toLowerCase())
  );
  const pagination = getPaginationData(filtered, currentPage, SUBSCRIBERS_PER_PAGE);
  const paginatedAdvisors = pagination.items;

  if (isLoading) return <AdvisorsSkeleton />;

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-[#F8F6F1] overflow-x-hidden w-full">
      <div className="flex-1 flex flex-col overflow-x-hidden w-full">
        <div className="p-6 md:p-6 p-3.5 flex-1 w-full">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-[#0a4a4a] font-cormorant">Advisors</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center bg-[#0a4a4a] rounded-full px-6 gap-2.5 h-12">
              <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.45)" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" strokeWidth="2" />
              </svg>
              <input
                type="text"
                className="border-none bg-transparent outline-none text-[13px] text-white flex-1 min-w-0 placeholder-white/70 font-poppins"
                placeholder="Search advisors..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
              <table className="min-w-full w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#E5E7EB]">
                    {["Name", "Company", "Status", "Plan", "Score", "Email", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-[0.05em] font-poppins">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdvisors.map((advisor) => (
                    <tr key={advisor.id} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar src={advisor.avatar} initials={advisor.initials} size="sm" />
                          <span className="text-xs font-semibold text-[#0a4a4a]">{advisor.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{advisor.company}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={advisor.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PlanBadge plan={advisor.plan} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBar score={advisor.score || 0} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{advisor.email}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedAdvisor(advisor)}
                          className="bg-[#0a4a4a] hover:bg-[#0d5a5a] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                        No advisors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControls pagination={pagination} onPageChange={setCurrentPage} label="advisors" />
          </div>
        </div>
      </div>

      {selectedAdvisor && (
        <AdvisorProfile data={selectedAdvisor} onClose={() => setSelectedAdvisor(null)} />
      )}
    </div>
  );
}
