"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSubscriptions } from "@/hooks/TanstankQuery/useSubscription";
import Image from "next/image";
import SubscriptionsSkeleton from "./loading";

function Avatar({
  src,
  alt,
  initials,
  size = "md",
  bgClass = "bg-yellow-600",
}) {
  const sizeClass =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-12 h-12 text-sm"
        : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sizeClass} relative rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0 ${bgClass}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "avatar"}
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// ── Badge color map keyed by badgeBg hex ────────────────────────
// Since badge colors come from data, we encode them as Tailwind classes directly in the data

export default function SubscriptionsPage() {
  const [activeNav, setActiveNav] = useState("Subscriptions");
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  // const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(1);
  // const [limit] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  const limit = 10;
  const { data, isLoading, isError, error, isFetching } = useSubscriptions(
    page,
    limit,
  );

  const subscriptions = data?.subscriptions || [];
  const totalPages = data?.pagination?.totalPages || 1;

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
  if(isLoading){
    return (<SubscriptionsSkeleton/>)
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-100 overflow-x-hidden w-full">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/45 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-x-hidden w-full">
        {/* Content */}
        <div className="flex-1 p-6 max-md:p-3.5 overflow-y-auto w-full">
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
                      <Avatar
                        src={item.profile_pic}
                        alt={item.name}
                        initials={item.initials}
                        size="md"
                      />
                      <div>
                        <div className="text-[13px] font-bold text-[#1a3330]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {item.plan} •{" "}
                          {formatDate(item.expiry)} {" "}
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
