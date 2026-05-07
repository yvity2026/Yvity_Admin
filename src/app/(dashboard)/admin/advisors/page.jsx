
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdvisorProfile from "@/components/AdvisorProfile";

const advisors = [
  { id: 1, name: "Krishna Mohan", phone: "+91 9876543210", city: "Nellore, AP", type: "Life+ Health", irdai: "Verified", plan: "Gold", score: 87, maxScore: 90, reviews: null, joined: "Jan 2026", status: "Active" },
  { id: 2, name: "Krishna Mohan", phone: "+91 9876543210", city: "Nellore, AP", type: "Life", irdai: "Verified", plan: "Gold", score: 87, maxScore: 90, reviews: null, joined: "Jan 2026", status: "Active" },
  { id: 3, name: "Krishna Mohan", phone: "+91 9876543210", city: "Nellore, AP", type: "Life+ Health", irdai: "Pending", plan: "Silver", score: 84, maxScore: 0, reviews: null, joined: "Mar 2026", status: "Under Review" },
  { id: 4, name: "Krishna Mohan", phone: "+91 9876543210", city: "Nellore, AP", type: "Life", irdai: "Verified", plan: "Free", score: 45, maxScore: 3, reviews: null, joined: "Jan 2026", status: "Active" },
  { id: 5, name: "Krishna Mohan", phone: "+91 9876543210", city: "Nellore, AP", type: "Health", irdai: "Verified", plan: "Gold", score: 87, maxScore: 90, reviews: null, joined: "Jan 2026", status: "Active" },
];

const navItems = {
  MAIN: [
    {
      label: "Overview", href: "/admin",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" /><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" /><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" /><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" /></svg>,
    },
    {
      label: "Advisors", href: "/admin/advisors",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="9" cy="7" r="4" strokeWidth="2" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" /><path d="M16 11l2 2 4-4" strokeWidth="2" /></svg>,
    },
    {
      label: "Customers", href: "/admin/customers",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="8" r="4" strokeWidth="2" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" /></svg>,
    },
  ],
  APPROVALS: [
    {
      label: "IRDAI Approvals", href: "/admin/irdaiapprovals",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="12" r="9" strokeWidth="2" /><path d="M9 12l2 2 4-4" strokeWidth="2" /></svg>,
    },
    {
      label: "Testimonials", href: "/admin/testimonials",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" /></svg>,
    },
  ],
  FINANCE: [
    {
      label: "Payments", href: "/admin/payments",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" /></svg>,
    },
    {
      label: "Subscriptions", href: "/admin/subscriptions",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" /></svg>,
    },
  ],
  SYSTEM: [
    {
      label: "Settings", href: "/admin/settings",
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="12" r="3" strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" /></svg>,
    },
  ],
};

function Avatar({ initials, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <div className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

function IrdaiBadge({ status }) {
  if (status === "Verified")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        ✓ Verified
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800">
      ⏳ Pending
    </span>
  );
}

function PlanBadge({ plan }) {
  const styles = {
    Gold: "bg-yellow-100 text-yellow-800",
    Silver: "bg-slate-100 text-slate-600",
    Free: "bg-green-50 text-green-800",
  };
  const labels = { Gold: "👑 Gold", Silver: "🥇 Silver", Free: "Free" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-semibold ${styles[plan] || styles.Free}`}>
      {labels[plan] || "Free"}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Active")
    return (
      <span className="bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold">
        Active
      </span>
    );
  return (
    <span className="bg-yellow-100 text-yellow-800 inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-semibold">
      Under Review
    </span>
  );
}

function ScoreBar({ score }) {
  const fillClass = score >= 80 ? "bg-teal-800" : score >= 50 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold text-sm">{score}</span>
      <div className="w-10 h-1 rounded bg-gray-200 overflow-hidden">
        <div className={`h-full rounded ${fillClass}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

const filterTabs = [
  { label: "All (1,042)", key: "all" },
  { label: "👑 Gold (451)", key: "gold" },
  { label: "🥇 Silver (281)", key: "silver" },
  { label: "🆓 Free (962)", key: "free" },
  { label: "⏳ Pending IRDAI", key: "pending" },
  { label: "🚫 Suspended", key: "suspended" },
];

const filterTabStyles = {
  all: "bg-white-50 text-[6B7280] border border-yellow-200",
  gold: "bg-white-50 text-[6B7280] border border-yellow-200",
  silver: "bg-white-50 text-[6B7280] border border-gray-300",
  free: "bg-white-50 text-[6B7280] border border-green-300",
  pending: "bg-white-50 text-[6B7280] border border-yellow-300",
  suspended: "bg-white-50 text-[6B7280] border border-red-300",
};

export default function AdvisorsDashboard() {
  const [activeNav, setActiveNav] = useState("Advisors");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  const filtered = advisors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">

      {/* Main */}
       <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">


        {/* Content */}
        <div className="p-6 md:p-6 p-3.5 flex-1">

                  {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" />
            </svg>
            <span className="text-base font-bold text-gray-900">All Advisors</span>
          </div>
          <div className="text-xs text-gray-400 mb-4">1,264 total registered advisors</div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {filterTabs.map((tab) => (
              <span
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer border ${
                  activeFilter === tab.key
                    ? "bg-[#0A4A4A] text-white border-transparent"
                    : filterTabStyles[tab.key]
                }`}
              >
                {tab.label}
              </span>
            ))}
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
              <div className="text-white text-lg cursor-pointer shrink-0">→</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm">
            {/* Mobile scroll hint */}
            <div className="md:hidden text-xs text-gray-400 text-right px-3 pt-1.5 pb-0">
              ← Scroll to see all columns →
            </div>

            <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: "touch",  scrollBehavior: "smooth", }}>
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr>
                    {["Advisor", "City", "Type", "IRDAI", "Plan", "Score", "Reviews", "Joined", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((advisor) => (
                    <tr
                      key={advisor.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials="KM" size="sm" />
                          <div>
                            <div className="font-semibold text-gray-900 text-[13px]">{advisor.name}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{advisor.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{advisor.city}</td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{advisor.type}</td>
                      <td className="px-3 py-3 align-middle"><IrdaiBadge status={advisor.irdai} /></td>
                      <td className="px-3 py-3 align-middle"><PlanBadge plan={advisor.plan} /></td>
                      <td className="px-3 py-3 align-middle"><ScoreBar score={advisor.score} /></td>
                      <td className="px-3 py-3 text-[13px] text-gray-700 align-middle">—</td>
                      <td className="px-3 py-3 text-xs text-gray-500 align-middle">{advisor.joined}</td>
                      <td className="px-3 py-3 align-middle"><StatusBadge status={advisor.status} /></td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedAdvisor(advisor)}
                            className="bg-[#0A4A4A] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none hover:bg-[#155e5e]"
                          >
                            View
                          </button>
                          {advisor.status === "Under Review" ? (
                            <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none hover:bg-green-200">
                              Approve
                            </button>
                          ) : (
                            <button className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none hover:bg-red-200">
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedAdvisor && (
        <AdvisorProfile onClose={() => setSelectedAdvisor(null)} />
      )}
    </div>
  );
}
