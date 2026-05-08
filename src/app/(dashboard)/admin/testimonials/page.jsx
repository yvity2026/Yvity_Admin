"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTestimonials } from "@/hooks/TanstankQuery/useTestimonial";
import TestimonialsSkeleton from "./loading";

// ── Icon components ──
const ISearch = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.42)"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);
const ITextReview = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2255bb"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IAudio = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#c57a00"
    strokeWidth="2"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const IVideo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6633bb"
    strokeWidth="2"
  >
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const ITextSm = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
  </svg>
);
const IAudioSm = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
  </svg>
);
const IVideoSm = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);
const IShield = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IHourglassSm = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#c57a00"
    strokeWidth="2.5"
  >
    <path d="M5 22h14M5 2h14M17 22v-4l-5-5-5 5v4M7 2v4l5 5 5-5V2" />
  </svg>
);
const ICheckSm = () => (
  <svg
    width="9"
    height="9"
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
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IPanelUsers = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1a7a5a"
    strokeWidth="2.5"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

// ── Sub-components ──
function Avatar({ initials, size = "md", bgColor = "#d4a017" }) {
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm" };
  return (
    <div
      className={`${sizeMap[size]} rounded-full text-white flex items-center justify-center font-bold shrink-0`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}

function Topbar({ title, onHamburger }) {
  return (
    <div className="bg-white border-b border-gray-200 h-[60px] px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center">
        <button
          onClick={onHamburger}
          aria-label="Open menu"
          className="flex md:hidden items-center justify-center p-1.5 rounded-md mr-2 bg-transparent border-none cursor-pointer"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#374151"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="text-[18px] font-bold text-gray-900">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="#6b7280"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeWidth="2"
            />
          </svg>
          <div className="w-2 h-2 bg-amber-400 rounded-full absolute -top-0.5 -right-0.5" />
        </div>
        <Avatar initials="KM" size="sm" />
      </div>
    </div>
  );
}

function Stars({ count, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-[13px] ${i < count ? "text-[#e8a020]" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TypeBadge({ type }) {
  if (type === "text")
    return (
      <span className="inline-flex items-center gap-1 bg-[#e8f4ff] text-[#2255bb] rounded-[7px] px-[9px] py-[3px] text-[11px] font-semibold">
        <ITextSm />
        Text
      </span>
    );
  if (type === "audio")
    return (
      <span className="inline-flex items-center gap-1 bg-[#fff5e6] text-[#c57a00] rounded-[7px] px-[9px] py-[3px] text-[11px] font-semibold">
        <IAudioSm />
        Audio
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-[#f0ecff] text-[#6633bb] rounded-[7px] px-[9px] py-[3px] text-[11px] font-semibold">
      <IVideoSm />
      Video
    </span>
  );
}

// ── Data ──
const testimonials = [
  {
    clientInitials: "RS",
    clientBg: "#e84040",
    clientName: "Ravi Shankar",
    clientLoc: "Nellore, AP",
    advisor: "Krishna Mohan",
    type: "text",
    rating: 5,
    review: '"Very trustworthy advisor..."',
    otp: true,
    submitted: "2 days ago",
  },
  {
    clientInitials: "RS",
    clientBg: "#e84040",
    clientName: "Ravi Shankar",
    clientLoc: "Nellore, AP",
    advisor: "Krishna Mohan",
    type: "audio",
    rating: 5,
    review: "Audio recording · 1 · 12",
    otp: true,
    submitted: "3 days ago",
  },
  {
    clientInitials: "PS",
    clientBg: "#6633bb",
    clientName: "Priya Sharma",
    clientLoc: "Hyderabad",
    advisor: "Krishna Mohan",
    type: "video",
    rating: 5,
    review: "Video · 1 · 45 min",
    otp: true,
    submitted: "4 days ago",
  },
];

const filterButtons = [
  {
    key: "text",
    label: "Pending",
    icon: <IHourglassSm />,
    active: "bg-[#fff5e6] border-[#e8a020] text-[#c57a00]",
    inactive: "bg-white border-gray-200 text-gray-500",
  },
  {
    key: "audio",
    label: "Approved",
    icon: (
      <span className="w-[14px] h-[14px] rounded-full bg-[#1a7a5a] flex items-center justify-center shrink-0">
        <ICheckSm />
      </span>
    ),
    active: "bg-[#e6f5f0] border-[#1a7a5a] text-[#1a7a5a]",
    inactive: "bg-white border-gray-200 text-gray-500",
  },
  {
    key: "video",
    label: "Rejected",
    icon: (
      <span className="text-[#cc3333] font-bold text-[13px] leading-none">
        ✕
      </span>
    ),
    active: "bg-[#fff0f0] border-[#cc3333] text-[#cc3333]",
    inactive: "bg-white border-gray-200 text-gray-500",
  },
];

// ── Page ──
export default function Testimonials() {
  const [activeNav, setActiveNav] = useState("Testimonials");
  const [search, setSearch] = useState("");
  // const [data, setData] = useState([]);
  // const [filtered, setFiltered] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTestimonials(page);

  const testimonials = Array.isArray(data?.data)
    ? data.data.map((c) => ({
        id: c.id,
        name: c.name || "Unknown User",
        profile_pic: c.profile_pic || "/default-avatar.png",
        location: c.location || "Unknown",
        advisor: c.advisor_name || "—",
        type: c.type || "text",
        rating: c.rating || 5,
        review: c.review || "No review",
        is_verified: c.is_verified || false,
        submitted: c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "—",
        otp: true
      }))
    : [];
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       setLoading(true);

  //       const res = await fetch(
  //         `/api/admin/testimonials?page=${page}&limit=10`,
  //       );

  //       const json = await res.json();

  //       const mapped = (json.data || []).map((c) => ({
  //         id: c.id,
  //         name: c.name,
  //         mobile: c.phone,
  //         email: c.email,
  //         city: c.location,
  //         profession: "Customer", // backend doesn’t provide this
  //         reviews: `${c.reviewCount || 0} Reviews`,
  //         lastLogin: "—", // backend missing
  //         joined: c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "—",
  //       }));

  //       setTestimonials(mapped);
  //     } catch (err) {
  //       console.error("Failed to fetch customers", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCustomers();
  // }, [page]);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  const filtered = testimonials.filter((c) => {
    const matchSearch =
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.review || "").toLowerCase().includes(search.toLowerCase());

    const matchFilter = !activeFilter || c.type === activeFilter;

    return matchSearch && matchFilter;
  });

  const matchFilter = !activeFilter || c.type === activeFilter;

  const handleReject = (idx) => {
    const real = rows.indexOf(filtered[idx]);
    setRows((prev) => prev.filter((_, i) => i !== real));
  };

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/45 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* <Topbar title="Testimonials" onHamburger={() => setShowSidebar(true)} /> */}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-[22px_26px] md:p-[22px_26px] p-3.5">
          {/* Stat cards */}
          <div className="flex gap-3.5 mb-5 flex-wrap">
            {[
              {
                delay: "0s",
                icon: <ITextReview />,
                iconBg: "bg-[#e8f0ff]",
                num: "18,240",
                label: "Text Reviews",
              },
              {
                delay: "80ms",
                icon: <IAudio />,
                iconBg: "bg-[#fff5e6]",
                num: "3,810",
                label: "Audio",
              },
              {
                delay: "160ms",
                icon: <IVideo />,
                iconBg: "bg-[#f0ecff]",
                num: "3,810",
                label: "Video",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-[14px] px-[22px] py-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.055)] flex-1 min-w-[150px] max-w-[260px] animate-[fadeInUp_0.4s_ease_both] hover:shadow-[0_8px_22px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                style={{ animationDelay: card.delay }}
              >
                <div
                  className={`w-9 h-9 rounded-[9px] ${card.iconBg} flex items-center justify-center mb-2.5`}
                >
                  {card.icon}
                </div>
                <div className="text-[26px] font-extrabold text-[#1a3330] leading-tight">
                  {card.num}
                </div>
                <div className="text-[12px] text-gray-400 mt-[3px] font-medium">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Panel */}
          <div className="bg-white rounded-2xl px-[22px] py-5 shadow-[0_2px_10px_rgba(0,0,0,0.055)] animate-[fadeInUp_0.4s_80ms_ease_both]">
            {/* Panel header */}
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2.5">
              <div className="flex items-center gap-[9px]">
                <div className="w-[26px] h-[26px] rounded-[7px] bg-[#eef4f2] flex items-center justify-center">
                  <IPanelUsers />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#1a3330]">
                    Testimonials Approvals
                  </div>
                  <div className="text-[11px] text-gray-300 mt-px">
                    All reviews are OTP · verified by clients
                  </div>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterButtons.map((btn) => {
                  const isActive = activeFilter === btn.key;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => setActiveFilter(isActive ? null : btn.key)}
                      className={`inline-flex items-center gap-1.5 px-[14px] py-[5px] rounded-full border-[1.5px] text-[12px] font-semibold cursor-pointer transition-all duration-[180ms]
                        ${isActive ? `${btn.active} scale-95 shadow-inner` : `${btn.inactive} scale-100`}`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search bar */}
            <div className="flex gap-3 mb-5 items-center">
              <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
                <ISearch />
                <input
                  className="border-none bg-transparent outline-none text-[14px] text-white flex-1 min-w-0 placeholder:text-white/70"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="text-white/70 text-lg cursor-pointer shrink-0">
                  →
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      "Client",
                      "Advisor",
                      "Type",
                      "Rating",
                      "Review",
                      "OTP",
                      "Submitted",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-semibold text-gray-300 tracking-[0.3px] px-2.5 py-[7px] border-b border-gray-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-gray-300 py-8 text-[12px]"
                      >
                        No testimonials found.
                      </td>
                    </tr>
                  )}
                  {filtered.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-[#f7faf9] transition-colors duration-150"
                    >
                      {/* Client */}
                      <td className="px-2.5 py-3 align-middle">
                        <div className="flex items-center gap-[9px]">
                          <div className="w-[34px] h-[34px] rounded-full overflow-hidden relative shrink-0 bg-gray-200 flex items-center justify-center">
                            <Image
                              src={r.profile_pic || "/default-avatar.png"}
                              alt={r.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-[#1a3330]">
                              {r.name}
                            </div>
                            <div className="text-[11px] text-gray-300 mt-px">
                              {r.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Advisor */}
                      <td className="px-2.5 py-3 align-middle">
                        <span className="text-[12px] font-semibold text-gray-700">
                          {r.advisor}
                        </span>
                      </td>
                      {/* Type */}
                      <td className="px-2.5 py-3 align-middle">
                        <TypeBadge type={r.type} />
                      </td>
                      {/* Rating */}
                      <td className="px-2.5 py-3 align-middle">
                        <Stars count={r.rating} />
                      </td>
                      {/* Review */}
                      <td className="px-2.5 py-3 align-middle">
                        <span className="text-[12px] text-gray-500 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis block">
                          {r.review}
                        </span>
                      </td>
                      {/* OTP */}
                      <td className="px-2.5 py-3 align-middle">
                        {r.otp && (
                          <span className="bg-[#e6f5f0] text-[#1a7a5a] rounded-full px-2.5 py-[3px] text-[11px] font-bold inline-flex items-center gap-1">
                            <IShield />
                            OTP
                          </span>
                        )}
                      </td>
                      {/* Submitted */}
                      <td className="px-2.5 py-3 align-middle">
                        <span className="text-[11px] text-gray-300 whitespace-nowrap">
                          {r.submitted}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-2.5 py-3 align-middle">
                        <div className="flex items-center gap-1.5">
                          <button className="px-[13px] py-[5px] rounded-full text-[11px] font-semibold border-[1.5px] border-[#0A4A4A] bg-white text-[#0A4A4A] cursor-pointer transition-all duration-200 hover:bg-[#0A4A4A] hover:text-white hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_4px_14px_rgba(10,74,74,0.25)]">
                            View
                          </button>
                          <button
                            onClick={() => handleReject(i)}
                            className="px-3 py-[5px] rounded-full text-[11px] font-semibold border-[1.5px] border-[#ffcccc] bg-[#fff5f5] text-[#cc3333] cursor-pointer flex items-center gap-1 transition-all duration-200 hover:bg-[#cc3333] hover:text-white hover:border-[#cc3333] hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_4px_14px_rgba(204,51,51,0.25)]"
                          >
                            <IXSm />
                            Reject
                          </button>
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

      {/* Keyframe animation — defined once in global CSS or tailwind.config; kept here as a one-time <style> only for the animation name reference */}
      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
