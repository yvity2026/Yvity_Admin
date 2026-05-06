
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUsers } from "react-icons/fa6";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ── Sidebar nav items ─────────────────────────────────────────────
const NAV_ITEMS = {
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

const COLORS = {
  primary:       "#0A4A4A",
  primaryHover:  "#155e5e",
  primaryBorder: "#155e5e",
  accent:        "#8bc34a",
  gold:          "#d4a017",
};

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, onClose, showSidebar, onLogout }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
     style={{
  background: COLORS.primary, width: 240,
  display: "flex", flexDirection: "column",
  height: "100vh",        
     
}}
    >
      {/* Logo */}
      {/* <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]"> */}
        {/* <img */}
          {/* // src="/images/Adivisor/Navbar/navlogo.png" */}
          {/* // alt="logo" */}
          {/* // className="h-10 w-auto object-contain" */}
        {/* /> */}
      {/* </div> */}

      {/* User block */}
      {/* <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.primaryBorder}`, display: "flex", alignItems: "center", gap: 10 }}> */}
        {/* <div style={{ */}
          {/* // width: 40, height: 40, borderRadius: "50%", */}
          {/* // background: COLORS.gold, color: "#fff", */}
          {/* // display: "flex", alignItems: "center", justifyContent: "center", */}
          {/* // fontWeight: 700, fontSize: 14, flexShrink: 0, */}
        {/* // }}>KM</div> */}
        {/* <div> */}
          {/* <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Admin</div> */}
          {/* <div style={{ color: COLORS.accent, fontSize: 10, marginTop: 1 }}>● Super Administrator</div> */}
        {/* </div> */}
      {/* </div> */}

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: "auto" , minHeight: 0}}>
        {Object.entries(NAV_ITEMS).map(([section, items]) => (
          <div key={section}>
            <div style={{ color: "#5fa8a8", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, padding: "14px 16px 4px" }}>
              {section}
            </div>
            {items.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                  onClick={() => { setActiveNav(item.label); onClose && onClose(); }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", cursor: "pointer", fontSize: 14,
                    color: isActive ? "#fff" : "#a3d0d0",
                    fontWeight: 600,
                    background: isActive ? COLORS.primaryHover : "transparent",
                    borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                    transition: "background 0.18s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "16px 0", borderTop: `1px solid ${COLORS.primaryBorder}` }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "#ef4444", fontSize: 13, cursor: "pointer", transition: "background 0.18s" }}
          onClick={onLogout}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.primaryHover; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
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

// ── Topbar ────────────────────────────────────────────────────────
// function Topbar({ onHamburger }) {
//   return (
//     <div
//       className="fixed top-0 right-0 left-0 md:left-[240px] flex items-center justify-between bg-white px-6 border-b border-gray-200 z-50"
//       style={{ height: "60px" }}
//     >
//       <div style={{ display: "flex", alignItems: "center" }}>
//         {/* Hamburger — visible on mobile only */}
//       <button
//   onClick={onHamburger}
//   aria-label="Open menu"
//   className="flex md:hidden items-center justify-center p-1 rounded-md mr-2"
// >
//   <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
//     <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// </button>
//         <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Overview</span>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <select style={{ background: "#f3f4f6", fontSize: 13, padding: "6px 12px", borderRadius: 6, border: "none", outline: "none", cursor: "pointer" }}>
//           <option value="day">Day</option>
//           <option value="week">Week</option>
//           <option value="month">Month</option>
//         </select>

//         <div style={{ position: "relative" }}>
//           <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
//             <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2"/>
//           </svg>
//           <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", position: "absolute", top: -2, right: -2 }} />
//         </div>

//         <div style={{
//           width: 36, height: 36, borderRadius: "50%",
//           background: COLORS.gold, color: "#fff",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontWeight: 700, fontSize: 12,
//         }}>KM</div>
//       </div>
//     </div>
//   );
// }

// ── Data ──────────────────────────────────────────────────────────
const CITIES = [
  { name: "Hyderabad",  count: 312, pct: 81, color: "#0f766e" },
  { name: "Nellore",    count: 194, pct: 50, color: "#eab308" },
  { name: "Vijayawada", count: 175, pct: 45, color: "#2563eb" },
  { name: "Vizag",      count: 138, pct: 36, color: "#f97316" },
  { name: "Chennai",    count: 102, pct: 26, color: "#10b981" },
  { name: "Others",     count: 362, pct: 93, color: "#60a5fa" },
];

const SERVICES = [
  { name: "Term Life",         life: "117", health: "—",   total: "303" },
  { name: "ULIP / Investment", life: "224", health: "—",   total: "224" },
  { name: "Critical Illness",  life: "188", health: "334", total: "198", hBlue: true },
  { name: "Pension / Annuity", life: "—",   health: "174", total: "206", hBlue: true },
  { name: "Group Insurance",   life: "113", health: "—",   total: "233" },
];

const COMPANIES = [
  { letter: "H", name: "HDFC Life",    count: 312, pct: 80, bg: "#f0fdfa", border: "#99f6e4", letterBg: "#0f766e", bar: "#0f766e" },
  { letter: "L", name: "LIC of India", count: 194, pct: 50, bg: "#eff6ff", border: "#bfdbfe", letterBg: "#2563eb", bar: "#2563eb" },
  { letter: "S", name: "Star Health",  count: 176, pct: 46, bg: "#fefce8", border: "#fde68a", letterBg: "#ca8a04", bar: "#ca8a04" },
  { letter: "N", name: "New India",    count: 138, pct: 36, bg: "#fef2f2", border: "#fecaca", letterBg: "#dc2626", bar: "#dc2626" },
];

const ROLES = [
  { label: "Senior Advisor",   count: "194",   pct: 55,  color: "#0f766e" },
  { label: "Junior Advisor",   count: "194",   pct: 60,  color: "#ca8a04" },
  { label: "Team Leader",      count: "194",   pct: 65,  color: "#2563eb" },
  { label: "Branch Manager",   count: "194",   pct: 56,  color: "#f97316" },
  { label: "Trailing Advisor", count: "194",   pct: 30,  color: "#16a34a" },
  { label: "LIC of India",     count: "194",   pct: 60,  color: "#7c3aed" },
  { label: "LIC of India",     count: "194",   pct: 65,  color: "#0f766e" },
  { label: "Total Advisor",    count: "1,284", pct: 100, color: "#dc2626" },
];

const BAR_MONTHS = [
  { m: "Oct", val: "₹4.2L", h: 58 },
  { m: "Nov", val: "₹4.3L", h: 62 },
  { m: "Dec", val: "₹4.2L", h: 58 },
  { m: "Jan", val: "₹4.3L", h: 62 },
  { m: "Feb", val: "₹4.1L", h: 56 },
  { m: "Mar", val: "₹4.5L", h: 68, gold: true },
];

// ── Mini Donut (animated) ─────────────────────────────────────────
function MiniDonut({ pct, color, label, count }) {
  const [hovered, setHovered] = useState(false);
  const r = 14, circ = 2 * Math.PI * r;
  const targetDash = (pct / 100) * circ;
  const [animDash, setAnimDash] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 900;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimDash(eased * targetDash);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetDash]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const to = hovered ? circ : targetDash;
    const duration = 400;
    startRef.current = null;
    let startVal = animDash;
    const animate = (ts) => {
      if (!startRef.current) { startRef.current = ts; startVal = animDash; }
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimDash(startVal + (to - startVal) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ cursor: "pointer", transition: "transform 0.25s ease", transform: hovered ? "scale(1.12)" : "scale(1)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth={hovered ? 5 : 4}
            strokeDasharray={`${animDash} ${circ}`}
            style={{ transition: "stroke-width 0.25s ease, filter 0.25s ease", filter: hovered ? `drop-shadow(0 0 4px ${color}88)` : "none" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color }}>{pct}%</div>
      </div>
      <div className="text-xs font-bold text-gray-800">{count}</div>
      <div className="text-[10px] text-gray-400 text-center leading-tight">{label}</div>
    </div>
  );
}

// ── Bar Chart — FIXED: extra top padding so tallest label is never clipped ──
function BarChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  // Added labelPad=18 so labels above the tallest bar are never clipped
  const W = 450, H = 90, bottomPad = 25, labelPad = 18, barW = 28;
  const count = BAR_MONTHS.length;
  const spaceBetween = (W - barW * count) / (count - 1);
  const maxVal = Math.max(...BAR_MONTHS.map(b => b.h));

  return (
    <svg viewBox={`0 0 ${W} ${H + bottomPad + labelPad}`} className="w-full" style={{ height: 120 }}>
      {/* baseline shifted down by labelPad */}
      <line x1="0" y1={H + labelPad} x2={W} y2={H + labelPad} stroke="#e5e7eb" strokeWidth="2" />
      {BAR_MONTHS.map(({ m, val, h, gold }, i) => {
        const x = i * (barW + spaceBetween);
        const barH = (h / maxVal) * (H - 10);
        // y origin now starts from labelPad so bars sit on the shifted baseline
        const y = H + labelPad - barH;
        const isHovered = hoveredIdx === i;
        const scale = isHovered ? 1.12 : 1;
        const cx = x + barW / 2;
        return (
          <g key={m} style={{ cursor: "pointer" }} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
            <rect x={x - 6} y={0} width={barW + 12} height={H + bottomPad + labelPad} fill="transparent" />
            {/* label — always has room above because of labelPad */}
            <text
              x={cx}
              y={isHovered ? y - 6 : y - 4}
              textAnchor="middle"
              fontSize={isHovered ? "11" : "11"}
              fontWeight={isHovered ? "700" : "600"}
              fill={isHovered ? (gold ? "#C9A227" : "#1a5c5a") : "#374151"}
              style={{ transition: "all 0.2s ease" }}
            >
              {val}
            </text>
            <rect
              x={cx - (barW * scale) / 2}
              y={isHovered ? y - (barH * 0.12) : y}
              width={barW * scale}
              height={barH * (isHovered ? 1.12 : 1)}
              rx="6"
              fill={gold ? "#C9A227" : "#1a5c5a"}
              style={{
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                filter: isHovered ? `drop-shadow(0 4px 8px ${gold ? "#C9A22766" : "#1a5c5a66"})` : "none",
              }}
            />
            <text
              x={cx}
              y={H + labelPad + 18}
              textAnchor="middle"
              fontSize="11"
              fill={isHovered ? "#374151" : "#9ca3af"}
              fontWeight={isHovered ? "600" : "400"}
              style={{ transition: "all 0.2s ease" }}
            >
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Plan Split Donut ──────────────────────────────────────────────
function PlanDonut() {
  const [hovered, setHovered] = useState(false);
  const r = 15.9, circ = 2 * Math.PI * r;
  const segments = [
    { pct: 33, color: "#ca8a04", offset: 0 },
    { pct: 17, color: "#93c5fd", offset: -33 },
    { pct: 50, color: "#0f766e", offset: -50 },
  ];
  const [animPcts, setAnimPcts] = useState(segments.map(() => 0));
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 1000;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPcts(segments.map(s => s.pct * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleHover = (isHover) => {
    setHovered(isHover);
    cancelAnimationFrame(rafRef.current);
    const duration = 400;
    startRef.current = null;
    const currentPcts = [...animPcts];
    const targetPcts = isHover ? segments.map(s => s.pct * 1.05) : segments.map(s => s.pct);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPcts(targetPcts.map((t, i) => currentPcts[i] + (t - currentPcts[i]) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  let cumOffset = 0;
  const animSegments = segments.map((s, i) => {
    const dash = (animPcts[i] / 100) * circ;
    const offsetVal = -cumOffset / 100 * circ;
    cumOffset += animPcts[i];
    return { ...s, dash, offsetVal };
  });

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 130, height: 130, cursor: "pointer", transition: "transform 0.3s ease", transform: hovered ? "scale(1.08)" : "scale(1)" }} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {animSegments.map(({ color, dash, offsetVal }, i) => (
            <circle key={i} cx="18" cy="18" r={r} fill="transparent" stroke={color} strokeWidth={hovered ? 5 : 4} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offsetVal} transform="rotate(-90 18 18)" style={{ transition: "stroke-width 0.3s ease, filter 0.3s ease", filter: hovered ? `drop-shadow(0 0 3px ${color}88)` : "none" }} />
          ))}
          <text x="18" y="17" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#1f2937">1,284</text>
         
          <text x="18" y="21.5" textAnchor="middle" fontSize="2.8" fill="#9ca3af">total</text>
        </svg>
      </div>
      <div className="space-y-2">
        {[
          { dot: "#ca8a04", label: "Gold",   val: "412 (33%)" },
          { dot: "#93c5fd", label: "Silver", val: "210 (16%)" },
          { dot: "#0f766e", label: "Free",   val: "662 (51%)" },
        ].map(({ dot, label, val }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }} />
            <span className="text-xs text-gray-700 w-10">{label}</span>
            <span className="text-xs text-gray-400">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ────────────────────────────────────────────────────
function LineChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const W = 400;
  const H = 120;

  const dataX = [50, 110, 170, 230, 290, 350];
  const dataY = [90, 75, 60, 55, 40, 20];

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const yLabels = ["1400", "1200", "1000", "800", "600", "400"];

  const pts = dataX.map((x, i) => `${x},${dataY[i]}`).join(" ");

  // const areaPath =
  //   `M${dataX[0]},${dataY[0]} ` +
  //   dataX.slice(1).map((x, i) => `L${x},${dataY[i + 1]}`).join(" ") +
  //   ` L${dataX[dataX.length - 1]},${H} L${dataX[0]},${H}Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px]">
      
      {/* 🔥 Y AXIS LINE (LIGHT LIKE DESIGN) */}
      <line x1="40" y1="11" x2="40" y2={H} stroke="#e5e7eb" />

      {/* 🔥 X AXIS LINE */}
      <line x1="40" y1={H} x2={W - 10} y2={H} stroke="#e5e7eb" />

      {/* 🔥 Y AXIS VALUES */}
      {yLabels.map((label, i) => (
        <text
          key={i}
          x="5"
          y={15 + i * 18}
          fontSize="9"
          fill="#9ca3af"
        >
          {label}
        </text>
      ))}

      {/* 🔥 AREA */}
      {/* <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
        </linearGradient>
      </defs> */}

      {/* <path d={areaPath} fill="url(#areaFill)" /> */}

      {/* 🔥 LINE */}
      <polyline
        points={pts}
        fill="none"
        stroke="#0f766e"
        strokeWidth="2.5"
      />

      {/* 🔥 POINTS */}
      {dataX.map((x, i) => {
        const isLast = i === dataX.length - 1;

        return (
          <circle
            key={i}
            cx={x}
            cy={dataY[i]}
            r="4"
            fill={isLast ? "#C9A227" : "#0f766e"}
          />
        );
      })}

      {/* 🔥 MONTH LABELS */}
      {months.map((m, i) => (
        <text
          key={m}
          x={dataX[i]}
          y={H - 2}
          textAnchor="middle"
          fontSize="10"
          fill="#9ca3af"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

// ── City Row ──────────────────────────────────────────────────────
function CityRow({ name, count, pct, color }) {
  const [hovered, setHovered] = useState(false);
  const [animPct, setAnimPct] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 800;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(pct * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = animPct;
    const to = hovered ? Math.min(pct * 1.08, 100) : pct;
    const duration = 300;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <div className="flex items-center gap-2" style={{ cursor: "default", padding: "3px 6px", borderRadius: 8, transition: "background 0.2s ease, transform 0.2s ease", background: hovered ? `${color}11` : "transparent", transform: hovered ? "translateX(4px)" : "translateX(0)" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="text-[11px] flex-shrink-0" style={{ width: 76, color: hovered ? color : "#374151", fontWeight: hovered ? 600 : 400, transition: "color 0.2s ease" }}>{name}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${animPct}%`, background: color, transition: "width 0.3s ease", boxShadow: hovered ? `0 0 6px ${color}88` : "none" }} />
      </div>
      <span className="text-[11px] font-semibold w-8 text-right" style={{ color: hovered ? color : "#374151", transition: "color 0.2s ease" }}>{count}</span>
    </div>
  );
}

// ── Company Card ──────────────────────────────────────────────────
function CompanyCard({ letter, name, count, pct, bg, border, letterBg, bar }) {
  const [hovered, setHovered] = useState(false);
  const [animPct, setAnimPct] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 800;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(pct * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = animPct;
    const to = hovered ? Math.min(pct * 1.1, 100) : pct;
    const duration = 300;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <div className="rounded-xl p-3" style={{ background: bg, border: `1px solid ${border}`, transition: "transform 0.25s ease, box-shadow 0.25s ease", transform: hovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)", boxShadow: hovered ? `0 8px 24px ${bar}33` : "none", cursor: "default" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: letterBg }}>{letter}</div>
        <div>
          <div className="text-sm font-bold text-gray-800 leading-none">{count}</div>
          <div className="text-[10px] text-gray-400">{name}</div>
        </div>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${animPct}%`, background: bar, transition: "width 0.3s ease", boxShadow: hovered ? `0 0 6px ${bar}88` : "none" }} />
      </div>
      <div className="text-[10px] text-gray-400 mt-1">{pct}% of max</div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
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

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showSidebar]);

  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className={`${poppins.className} flex min-h-screen text-gray-800`} style={{ backgroundColor: "#EEF2F0" }}>

      {/* Mobile overlay — tapping outside closes sidebar */}
      {/* Page-level sidebar commented out because dashboard layout now owns the shared responsive sidebar.
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onClose={() => setShowSidebar(false)}
        showSidebar={showSidebar}
        onLogout={handleLogout}
      />
      */}

      {/* Main content */}
      <main className="flex-1 flex flex-col md:ml-[240px]" style={{ backgroundColor: "#EEF2F0" }}>

        {/* Topbar */}
        {/* <Topbar onHamburger={() => window.dispatchEvent(new Event("open-dashboard-sidebar"))} /> */}

        {/* Page content */}
        <div className="p-4 space-y-3 mt-[60px]">

          {/* ── ROW 1: 4 Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
            {
              label: "Total Advisors",
                         val: "1,247",
                       badge: "↑ 12%",
                        badgeC: "text-green-700 bg-green-100",
                        iconBg: "#f0fdfa",
                       ic: "#0f766e",
                       icon: "👥"
              },
             {
  label: "Total Customers",
  val: "8,492",
  badge: "↑ 34%",
  badgeC: "text-green-700 bg-green-100",
  iconBg: "#eff6ff",
  ic: "#2563eb",
  icon: <FaUsers />
},
{
  label: "Total Revenue",
  val: "₹12.4L",
  badge: "↑ 59%",
  badgeC: "text-green-700 bg-green-100",
  iconBg: "#f0fdf4",
  ic: "#16a34a",
  icon: "💰"
},
{
  label: "Pending IRDAI Approvals",
  val: "20",
  badge: "20 Pending",
  badgeC: "text-orange-600 bg-orange-100",
  iconBg: "#fff7ed",
  ic: "#ea580c",
  icon: "⏳"
},
            ].map(({ label, val, badge, badgeC, iconBg, ic, icon }) => (
              <div key={label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between"
                style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px #0001"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
                   <div style={{ color: ic, fontSize: "16px" }}>
  {icon}
</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeC}`}>{badge}</span>
                </div>
                <div className="text-xl font-bold text-gray-900 leading-tight">{val}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* ── ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[14px] font-semibold flex items-center gap-1.5">
                  <span className="text-yellow-500">●</span> Subscription Revenue
                </h2>
                <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Last 6 Month ▾</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-sm font-bold text-yellow-700">₹4.2L</div>
                  <div className="text-[11px] text-gray-500">👑 Gold</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">140 advisors</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-sm font-bold text-slate-500">₹2.1L</div>
                  <div className="text-[11px] text-gray-500">🥇 Silver</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">210 advisors</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-sm font-bold text-emerald-600">₹0</div>
                  <div className="text-[11px] text-gray-500">🆓 Free</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">934 advisors</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mb-1">Monthly Revenue Trend</p>
              <div className="mt-16"><BarChart /></div>
            </div>

            <div className="col-span-2 flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col" style={{ padding: "26px 31px 26px 30px", justifyContent: "center", alignItems: "flex-start", gap: "16px" }}>
                <div className="flex justify-between items-start mb-1 w-full">
                  <div>
                    <h2 className="text-[14px] font-semibold flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                      Platform Growth
                    </h2>
                    <p className="text-[11px] text-gray-400">Total advisors registered · Last 6 months</p>
                  </div>
                  <span className="bg-teal-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">1,284</span>
                  
                </div>
                <LineChart />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[14px] font-semibold">🧩 Plan Split</h2>
                  <span className="text-[11px] text-gray-400">Advisor Subscription Tiers</span>
                </div>
                <PlanDonut />
              </div>
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-[14px] font-semibold mb-3">🏙 City – wise Advisors</h2>
              <div className="space-y-2.5">
                {CITIES.map(({ name, count, pct, color }) => (
                  <CityRow key={name} name={name} count={count} pct={pct} color={color} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-[14px] font-semibold mb-3">🛡 Service – wise Advisors</h2>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-gray-400 text-[11px] border-b border-gray-100">
                    <th className="text-left py-1.5 font-semibold">SERVICE</th>
                    <th className="text-left py-1.5 font-semibold">LIFE</th>
                    <th className="text-left py-1.5 font-semibold text-blue-500">HEALTH</th>
                    <th className="text-left py-1.5 font-semibold">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICES.map(({ name, life, health, total, hBlue }) => (
                    <tr key={name} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 text-gray-700">{name}</td>
                      <td className={`py-2 font-semibold ${life === "—" ? "text-gray-300" : "text-gray-700"}`}>{life}</td>
                      <td className={`py-2 font-semibold ${hBlue ? "text-blue-500" : "text-gray-300"}`}>{health}</td>
                      <td className="py-2 font-semibold text-gray-700">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── ROW 4 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-[14px] font-semibold mb-3">🏢 Company – wise Advisors</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {COMPANIES.map(({ letter, name, count, pct, bg, border, letterBg, bar }) => (
                  <CompanyCard key={name} letter={letter} name={name} count={count} pct={pct} bg={bg} border={border} letterBg={letterBg} bar={bar} />
                ))}
              </div>
              <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 20px #0001"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="w-6 h-6 bg-gray-400 rounded-md flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">S</div>
                <div>
                  <div className="text-sm font-bold text-gray-800 leading-none">362</div>
                  <div className="text-[10px] text-gray-400">Others · All other companies combined</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-[14px] font-semibold mb-3">👥 Role – wise Advisors</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {ROLES.map((item, index) => (
                  <MiniDonut key={item.label + index} pct={item.pct} color={item.color} label={item.label} count={item.count} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
