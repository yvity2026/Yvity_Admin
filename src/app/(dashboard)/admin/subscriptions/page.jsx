
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}


// ── Badge color map keyed by badgeBg hex ────────────────────────
// Since badge colors come from data, we encode them as Tailwind classes directly in the data
const subscriptions = [
  {
    name: "Krishna Mohan", plan: "Gold Plan", date: "Jan 15, 2025", amount: "₹2,999",
    days: "7 days", initials: "KM", avatarBg: "bg-[#e8a020]",
    badgeCls: "bg-red-100 text-red-700", remind: true,
  },
  {
    name: "Sunitha Mehta", plan: "Gold Plan", date: "Jan 20, 2026", amount: "₹2,999",
    days: "12 days", initials: "SM", avatarBg: "bg-[#1a5a50]",
    badgeCls: "bg-orange-100 text-orange-700", remind: true,
  },
  {
    name: "Rahul Kumar", plan: "Silver Plan", date: "Jan 22, 2026", amount: "₹999",
    days: "14 days", initials: "RK", avatarBg: "bg-[#e8a020]",
    badgeCls: "bg-yellow-100 text-yellow-700", remind: true,
  },
  {
    name: "Sunitha Mehta", plan: "Gold Plan", date: "Jan 22, 2026", amount: "₹999",
    days: "28 days", initials: "SM", avatarBg: "bg-[#1a5a50]",
    badgeCls: "bg-green-100 text-green-700", remind: false,
  },
];

export default function SubscriptionsPage() {
  const [activeNav, setActiveNav]     = useState("Subscriptions");
  const [search, setSearch]           = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  const filtered = subscriptions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.plan.toLowerCase().includes(search.toLowerCase())
  );

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
              <span className="text-[15px] font-bold text-[#1a3330]">Upcoming Renewals</span>
            </div>

            {/* Search */}
            <div className="flex gap-3 mb-5 items-center">
              <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="text-white text-lg cursor-pointer shrink-0">→</div>
              </div>
            </div>

            {/* Subscription rows */}
            <div className="flex flex-col gap-2.5">
              {filtered.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#f5f7f5] rounded-xl px-4 py-3.5 hover:bg-[#edf0ec]"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1a3330]">{item.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {item.plan} &bull; {item.date} &bull; {item.amount}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3.5">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${item.badgeCls}`}>
                      {item.days}
                    </span>
                    {item.remind && (
                      <button className="text-xs font-bold text-[#0A4A4A] bg-transparent border-none cursor-pointer hover:text-[#8bc34a]">
                        Remind
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
