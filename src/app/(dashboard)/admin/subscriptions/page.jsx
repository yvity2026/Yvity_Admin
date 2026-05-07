"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function Avatar({ initials, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── Badge color map keyed by badgeBg hex ────────────────────────
// Since badge colors come from data, we encode them as Tailwind classes directly in the data
const subscriptions = [
  {
    name: "Krishna Mohan",
    plan: "Gold Plan",
    date: "Jan 15, 2025",
    amount: "₹2,999",
    days: "7 days",
    initials: "KM",
    avatarBg: "bg-[#e8a020]",
    badgeCls: "bg-red-100 text-red-700",
    remind: true,
  },
  {
    name: "Sunitha Mehta",
    plan: "Gold Plan",
    date: "Jan 20, 2026",
    amount: "₹2,999",
    days: "12 days",
    initials: "SM",
    avatarBg: "bg-[#1a5a50]",
    badgeCls: "bg-orange-100 text-orange-700",
    remind: true,
  },
  {
    name: "Rahul Kumar",
    plan: "Silver Plan",
    date: "Jan 22, 2026",
    amount: "₹999",
    days: "14 days",
    initials: "RK",
    avatarBg: "bg-[#e8a020]",
    badgeCls: "bg-yellow-100 text-yellow-700",
    remind: true,
  },
  {
    name: "Sunitha Mehta",
    plan: "Gold Plan",
    date: "Jan 22, 2026",
    amount: "₹999",
    days: "28 days",
    initials: "SM",
    avatarBg: "bg-[#1a5a50]",
    badgeCls: "bg-green-100 text-green-700",
    remind: false,
  },
];

export default function SubscriptionsPage() {
  const [activeNav, setActiveNav] = useState("Subscriptions");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/subscriptions?limit=${limit}&page=${page}`,
        );
        const data = await res.json();
        if (data.success) {
          setSubscriptions(data.data);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.error("Failed to load subscriptions:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchSubscriptions();
  }, [page, limit]);

  const filtered = subscriptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.plan.toLowerCase().includes(search.toLowerCase()),
  );

  const calcDaysLeft = (expiry) => {
    if (!expiry) return 0;
    return Math.max(
      Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24)),
      0,
    );
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/45 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 p-6 max-md:p-3.5 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-lg">🔄</span>
              <span className="text-[15px] font-bold text-[#1a3330]">
                Upcoming Renewals
              </span>
            </div>

            {/* Search */}
            <div className="flex gap-3 mb-5 items-center">
              <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
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

            {/* Subscription rows */}
            <div className="flex flex-col gap-2.5">
              {filtered.map((item, i) => {
                const daysLeft = calcDaysLeft(item.expiry);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#f5f7f5] rounded-xl px-4 py-3.5 hover:bg-[#edf0ec]"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1a3330]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {item.plan} •{" "}
                          {item.expiry
                            ? new Date(item.expiry).toLocaleDateString()
                            : "—"}{" "}
                          • ₹{item.amount}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${item.badgeCls}`}
                      >
                        {daysLeft} days
                      </span>
                      {item && (
                        <button className="text-xs font-bold text-[#0A4A4A] bg-transparent border-none cursor-pointer hover:text-[#8bc34a]">
                          Remind
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
