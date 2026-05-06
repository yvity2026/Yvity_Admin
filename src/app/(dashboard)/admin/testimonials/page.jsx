"use client";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .content { flex: 1; padding: 22px 26px; overflow-y: auto; }

  .stat-row { display: flex; gap: 14px; margin-bottom: 20px; flex-wrap: wrap; }
  .stat-card {
    background: #fff; border-radius: 14px; padding: 18px 22px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.055);
    flex: 1; min-width: 150px; max-width: 260px;
    animation: fadeInUp 0.4s ease both;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .stat-card:hover { box-shadow: 0 8px 22px rgba(0,0,0,0.1); transform: translateY(-2px); }
  .stat-icon-wrap {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
  }
  .stat-number { font-size: 26px; font-weight: 800; color: #1a3330; line-height: 1.1; }
  .stat-label  { font-size: 12px; color: #999; margin-top: 3px; font-weight: 500; }

  .panel {
    background: #fff; border-radius: 16px; padding: 20px 22px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.055);
    animation: fadeInUp 0.4s 0.08s ease both;
  }
  .panel-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
  .panel-title-area { display: flex; align-items: center; gap: 9px; }
  .panel-icon { width: 26px; height: 26px; border-radius: 7px; background: #eef4f2; display: flex; align-items: center; justify-content: center; }
  .panel-title    { font-size: 15px; font-weight: 700; color: #1a3330; }
  .panel-subtitle { font-size: 11px; color: #bbb; margin-top: 1px; }

  .legend { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .search-wrap {
    display: flex;
    align-items: center;
    background: #0A4A4A;
    border-radius: 999px;
    padding: 0 20px 0 24px;
    gap: 10px;
    flex: 1;
    max-width: 100%;
    height: 48px;
  }
  .search-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #fff;
    flex: 1;
    min-width: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.7); }
  .search-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    flex-shrink: 0;
  }

  table { width: 100%; border-collapse: collapse; }
  thead th { text-align: left; font-size: 11px; font-weight: 600; color: #bbb; letter-spacing: 0.3px; padding: 7px 10px; border-bottom: 1px solid #f0f0f0; }
  tbody tr { border-bottom: 1px solid #f5f5f5; transition: background 0.15s; }
  tbody tr:hover { background: #f7faf9; }
  tbody td { padding: 12px 10px; vertical-align: middle; font-size: 12px; color: #555; }

  .client-avatar { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .client-name { font-size: 13px; font-weight: 700; color: #1a3330; }
  .client-loc  { font-size: 11px; color: #aaa; margin-top: 1px; }
  .advisor-name { font-size: 12px; font-weight: 600; color: #333; }

  .type-badge { border-radius: 7px; padding: 3px 9px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .type-text  { background: #e8f4ff; color: #2255bb; }
  .type-audio { background: #fff5e6; color: #c57a00; }
  .type-video { background: #f0ecff; color: #6633bb; }

  .stars { display: flex; gap: 2px; }
  .star-filled { color: #e8a020; font-size: 13px; }
  .star-empty  { color: #ddd;    font-size: 13px; }

  .review-text { font-size: 12px; color: #555; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .otp-badge { background: #e6f5f0; color: #1a7a5a; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
  .submitted-text { font-size: 11px; color: #aaa; white-space: nowrap; }

  .actions-cell { display: flex; align-items: center; gap: 6px; }
  .btn-view {
    padding: 5px 13px; border-radius: 999px; font-size: 11px; font-weight: 600;
    border: 1.5px solid #0A4A4A; background: #fff; color: #0A4A4A; cursor: pointer;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-view:hover { background: #0A4A4A; color: #fff; transform: translateY(-2px) scale(1.04); box-shadow: 0 4px 14px rgba(10,74,74,0.25); }
  .btn-reject {
    padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600;
    border: 1.5px solid #ffcccc; background: #fff5f5; color: #cc3333; cursor: pointer;
    display: flex; align-items: center; gap: 4px;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .btn-reject:hover { background: #cc3333; color: #fff; border-color: #cc3333; transform: translateY(-2px) scale(1.04); box-shadow: 0 4px 14px rgba(204,51,51,0.25); }

  .nav-row { transition: background 0.18s; }
  .nav-row:hover { background: rgba(255,255,255,0.07); }

  .test-sidebar-container { position: relative; z-index: 50; }
  .test-hamburger-btn { display: none; }
  .test-mobile-overlay { display: none; }
  @media (max-width: 768px) {
    .test-sidebar-container {
      position: fixed !important; top: 0; left: 0; height: 100vh;
      transform: translateX(-100%); transition: transform 0.25s ease;
    }
    .test-sidebar-container.open { transform: translateX(0); }
    .test-mobile-overlay {
      display: block; position: fixed; inset: 0;
      background: rgba(0,0,0,0.45); z-index: 40;
    }
    .test-hamburger-btn {
      display: flex !important; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer;
      padding: 6px; border-radius: 6px; margin-right: 8px;
    }
    .test-main-content-padding { padding: 14px !important; }
  }
`;

const COLORS = {
  primary:       "#0A4A4A",
  primaryHover:  "#155e5e",
  primaryBorder: "#155e5e",
  accent:        "#8bc34a",
  gold:          "#d4a017",
};

const navItems = {
  MAIN: [
    { label: "Overview",  href: "/admin",           icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg> },
    { label: "Advisors",  href: "/admin/advisors",  icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="9" cy="7" r="4" strokeWidth="2"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2"/><path d="M16 11l2 2 4-4" strokeWidth="2"/></svg> },
    { label: "Customers", href: "/admin/customers", icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="8" r="4" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2"/></svg> },
  ],
  APPROVALS: [
    { label: "IRDAI Approvals", href: "/admin/irdaiapprovals", icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg> },
    { label: "Testimonials",    href: "/admin/testimonials",   icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2"/></svg> },
  ],
  FINANCE: [
    { label: "Payments",      href: "/admin/payments",      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg> },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/></svg> },
  ],
  SYSTEM: [
    { label: "Settings", href: "/admin/settings", icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/></svg> },
  ],
};

function Avatar({ initials, size = 40, bg = COLORS.gold }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Sidebar({ activeNav, setActiveNav, onClose, onLogout }) {
  return (
    <div style={{ background: COLORS.primary, minHeight: "100vh", width: 256, flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
        <img src="/images/Adivisor/Navbar/navlogo.png" alt="logo" className="h-10 w-auto object-contain" />
      </div>

      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.primaryBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials="KM" size={40} />
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Admin</div>
          <div style={{ color: COLORS.accent, fontSize: 10, marginTop: 1 }}>● Super Administrator</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section}>
            <div style={{ color: "#5fa8a8", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, padding: "14px 16px 4px" }}>
              {section}
            </div>
            {items.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none" }} onClick={() => { setActiveNav(item.label); onClose && onClose(); }}>
                  <div className="nav-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", fontSize: 13, color: isActive ? "#fff" : "#a3d0d0", fontWeight: isActive ? 600 : 400, background: isActive ? COLORS.primaryHover : "transparent", borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent" }}>
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 0", borderTop: `1px solid ${COLORS.primaryBorder}` }}>
        <div
          className="nav-row"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", color: "#ef4444", fontSize: 13, cursor: "pointer" }}
          onClick={onLogout}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeWidth="2"/>
          </svg>
          Logout
        </div>
      </div>
    </div>
  );
}

function Topbar({ title, onHamburger }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", height: 60, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={onHamburger} aria-label="Open menu" className="flex md:hidden items-center justify-center p-1 rounded-md mr-2">
          <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2"/>
          </svg>
          <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", position: "absolute", top: -2, right: -2 }} />
        </div>
        <Avatar initials="KM" size={32} />
      </div>
    </div>
  );
}

const ISearch     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IArrow      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ITextReview = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2255bb" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IAudio      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c57a00" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IVideo      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6633bb" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const ITextSm     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>;
const IAudioSm    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/></svg>;
const IVideoSm    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const IShield     = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const IHourglassSm= () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c57a00" strokeWidth="2.5"><path d="M5 22h14M5 2h14M17 22v-4l-5-5-5 5v4M7 2v4l5 5 5-5V2"/></svg>;
const ICheckSm    = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IXSm        = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IPanelUsers = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;

const testimonials = [
  { clientInitials: "RS", clientBg: "#e84040", clientName: "Ravi Shankar", clientLoc: "Nellore, AP", advisor: "Krishna Mohan", type: "text",  rating: 5, review: '"Very trustworthy advisor..."', otp: true, submitted: "2 days ago" },
  { clientInitials: "RS", clientBg: "#e84040", clientName: "Ravi Shankar", clientLoc: "Nellore, AP", advisor: "Krishna Mohan", type: "audio", rating: 5, review: "Audio recording · 1 · 12",        otp: true, submitted: "3 days ago" },
  { clientInitials: "PS", clientBg: "#6633bb", clientName: "Priya Sharma", clientLoc: "Hyderabad",   advisor: "Krishna Mohan", type: "video", rating: 5, review: "Video · 1 · 45 min",              otp: true, submitted: "4 days ago" },
];

const Stars     = ({ count = 5, max = 5 }) => <div className="stars">{Array.from({ length: max }).map((_, i) => <span key={i} className={i < count ? "star-filled" : "star-empty"}>★</span>)}</div>;
const TypeBadge = ({ type }) => {
  if (type === "text")  return <span className="type-badge type-text"><ITextSm />Text</span>;
  if (type === "audio") return <span className="type-badge type-audio"><IAudioSm />Audio</span>;
  return <span className="type-badge type-video"><IVideoSm />Video</span>;
};

// ── Filter button definitions ──
const filterButtons = [
  {
    key: "text",
    label: "Pending",
    icon: <IHourglassSm />,
    activeStyle:  { background: "#fff5e6", borderColor: "#e8a020", color: "#c57a00" },
    defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
  },
  {
    key: "audio",
    label: "Approved",
    icon: (
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a7a5a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <ICheckSm />
      </span>
    ),
    activeStyle:  { background: "#e6f5f0", borderColor: "#1a7a5a", color: "#1a7a5a" },
    defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
  },
  {
    key: "video",
    label: "Rejected",
    icon: <span style={{ color: "#cc3333", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>✕</span>,
    activeStyle:  { background: "#fff0f0", borderColor: "#cc3333", color: "#cc3333" },
    defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
  },
];

export default function Testimonials() {
  const [activeNav, setActiveNav]       = useState("Testimonials");
  const [search, setSearch]             = useState("");
  const [rows, setRows]                 = useState(testimonials);
  const [showSidebar, setShowSidebar]   = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // ← NEW

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/auth/admin/login";
    }
  };

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  // ── Updated filtered logic ──
  const filtered = rows.filter(r => {
    const matchSearch =
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.advisor.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());

    const matchFilter = !activeFilter || r.type === activeFilter;

    return matchSearch && matchFilter;
  });

  const handleReject = (idx) => {
    const real = rows.indexOf(filtered[idx]);
    setRows(prev => prev.filter((_, i) => i !== real));
  };

  return (
    <>
      <style>{styles}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

        {/* Local page sidebar commented out because the dashboard layout now renders the shared responsive sidebar.
        {showSidebar && (
          <div className="test-mobile-overlay" onClick={() => setShowSidebar(false)} />
        )}

        <div className={`test-sidebar-container${showSidebar ? " open" : ""}`}>
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} onClose={() => setShowSidebar(false)} onLogout={handleLogout} />
        </div>
        */}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          <Topbar title="Testimonials" onHamburger={() => window.dispatchEvent(new Event("open-dashboard-sidebar"))} />

          <div className="content test-main-content-padding">

            <div className="stat-row">
              <div className="stat-card" style={{ animationDelay: "0s" }}>
                <div className="stat-icon-wrap" style={{ background: "#e8f0ff" }}><ITextReview /></div>
                <div className="stat-number">18,240</div>
                <div className="stat-label">Text Reviews</div>
              </div>
              <div className="stat-card" style={{ animationDelay: "0.08s" }}>
                <div className="stat-icon-wrap" style={{ background: "#fff5e6" }}><IAudio /></div>
                <div className="stat-number">3,810</div>
                <div className="stat-label">Audio</div>
              </div>
              <div className="stat-card" style={{ animationDelay: "0.16s" }}>
                <div className="stat-icon-wrap" style={{ background: "#f0ecff" }}><IVideo /></div>
                <div className="stat-number">3,810</div>
                <div className="stat-label">Video</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title-area">
                  <div className="panel-icon"><IPanelUsers /></div>
                  <div>
                    <div className="panel-title">Testimonials Approvals</div>
                    <div className="panel-subtitle">All reviews are OTP · verified by clients</div>
                  </div>
                </div>

                {/* ── NEW: Pill filter buttons ── */}
                <div className="legend">
                  {filterButtons.map((btn) => {
                    const isActive = activeFilter === btn.key;
                    return (
                      <button
                        key={btn.key}
                        onClick={() => setActiveFilter(isActive ? null : btn.key)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 14px",
                          borderRadius: "999px",
                          border: "1.5px solid",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                          transform: isActive ? "scale(0.96)" : "scale(1)",
                          boxShadow: isActive ? "inset 0 2px 6px rgba(0,0,0,0.08)" : "none",
                          ...(isActive ? btn.activeStyle : btn.defaultStyle),
                        }}
                      >
                        {btn.icon}
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
                <div className="search-wrap">
                  <input
                    className="search-input"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="search-arrow">→</div>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>{["Client", "Advisor", "Type", "Rating", "Review", "OTP", "Submitted", "Actions"].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} style={{ textAlign: "center", color: "#ccc", padding: "30px 0" }}>No testimonials found.</td></tr>
                    )}
                    {filtered.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div className="client-avatar" style={{ background: r.clientBg }}>{r.clientInitials}</div>
                            <div>
                              <div className="client-name">{r.clientName}</div>
                              <div className="client-loc">{r.clientLoc}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="advisor-name">{r.advisor}</span></td>
                        <td><TypeBadge type={r.type} /></td>
                        <td><Stars count={r.rating} /></td>
                        <td><span className="review-text">{r.review}</span></td>
                        <td>{r.otp && <span className="otp-badge"><IShield />OTP</span>}</td>
                        <td><span className="submitted-text">{r.submitted}</span></td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-view">View</button>
                            <button className="btn-reject" onClick={() => handleReject(i)}><IXSm />Reject</button>
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
      </div>
    </>
  );
}
