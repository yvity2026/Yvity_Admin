"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdvisorProfile from "@/components/AdvisorProfile";

// const advisors = [
//   {
//     id: 1,
//     name: "Krishna Mohan",
//     phone: "+91 9876543210",
//     city: "Nellore, AP",
//     type: "Life+ Health",
//     irdai: "Verified",
//     plan: "Gold",
//     score: 87,
//     maxScore: 90,
//     reviews: null,
//     joined: "Jan 2026",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Krishna Mohan",
//     phone: "+91 9876543210",
//     city: "Nellore, AP",
//     type: "Life",
//     irdai: "Verified",
//     plan: "Gold",
//     score: 87,
//     maxScore: 90,
//     reviews: null,
//     joined: "Jan 2026",
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Krishna Mohan",
//     phone: "+91 9876543210",
//     city: "Nellore, AP",
//     type: "Life+ Health",
//     irdai: "Pending",
//     plan: "Silver",
//     score: 84,
//     maxScore: 0,
//     reviews: null,
//     joined: "Mar 2026",
//     status: "Under Review",
//   },
//   {
//     id: 4,
//     name: "Krishna Mohan",
//     phone: "+91 9876543210",
//     city: "Nellore, AP",
//     type: "Life",
//     irdai: "Verified",
//     plan: "Free",
//     score: 45,
//     maxScore: 3,
//     reviews: null,
//     joined: "Jan 2026",
//     status: "Active",
//   },
//   {
//     id: 5,
//     name: "Krishna Mohan",
//     phone: "+91 9876543210",
//     city: "Nellore, AP",
//     type: "Health",
//     irdai: "Verified",
//     plan: "Gold",
//     score: 87,
//     maxScore: 90,
//     reviews: null,
//     joined: "Jan 2026",
//     status: "Active",
//   },
// ];

function Avatar({ initials, size = "md" }) {
  const sizeClass =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-12 h-12 text-base"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
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
    score >= 80 ? "bg-teal-800" : score >= 50 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold text-sm">{score}</span>
      <div className="w-10 h-1 rounded bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded ${fillClass}`}
          style={{ width: `${score}%` }}
        />
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
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  const filtered = advisors.filter(
    (a) =>
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.plan || "").toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const params = new URLSearchParams();

        // Plan filters
        if (activeFilter === "gold") {
          params.append("plan", "gold");
        }

        if (activeFilter === "silver") {
          params.append("plan", "silver");
        }

        if (activeFilter === "free") {
          params.append("plan", "free");
        }

        // Status filters
        if (activeFilter === "pending") {
          params.append("account_status", "under_review");
        }

        if (activeFilter === "suspended") {
          params.append("account_status", "action_required");
        }

        const res = await fetch(`/api/admin/advisors?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch advisors");
        }

        const json = await res.json();

        setAdvisors(json.data || []);
      } catch (error) {
        console.error("Failed to fetch advisors:", error);
      }
    };

    fetchAdvisors();
  }, [activeFilter]);

  //Status :
  function IrdaiBadge({ status }) {
    if (status === "Verified") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          ✓ Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800">
        ⏳ Pending
      </span>
    );
  }

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="p-6 md:p-6 p-3.5 flex-1">

                  {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#374151"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                strokeWidth="2"
              />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path
                d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                strokeWidth="2"
              />
            </svg>
            <span className="text-base font-bold text-gray-900">
              All Advisors
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-4">
            1,264 total registered advisors
          </div>

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
              <div className="text-white text-lg cursor-pointer shrink-0">
                →
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm">
            {/* Mobile scroll hint */}
            <div className="md:hidden text-xs text-gray-400 text-right px-3 pt-1.5 pb-0">
              ← Scroll to see all columns →
            </div>

            <div
              className="overflow-x-auto w-full"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
              }}
            >
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      "Advisor",
                      "City",
                      "Type",
                      "IRDAI",
                      "Plan",
                      "Score",
                      "Reviews",
                      "Joined",
                      "Status",
                      "Actions",
                    ].map((h) => (
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
                            <div className="font-semibold text-gray-900 text-[13px]">
                              {advisor.name}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {advisor.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">
                        {advisor.location}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">
                        {advisor.type}
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <IrdaiBadge
                          status={advisor.isVerified ? "Verified" : "Pending"}
                        />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <PlanBadge plan={advisor.plan} />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <ScoreBar score={advisor.total || 0} />
                      </td>
                      <td className="px-3 py-3 text-[13px] text-gray-700 align-middle">
                        —
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500 align-middle">
                        {advisor.submittedAt
                          ? new Date(advisor.submittedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <StatusBadge status={advisor.status} />
                      </td>
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
