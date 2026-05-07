
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUsers } from "react-icons/fa6";
import { GoHome } from "react-icons/go";

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

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, onClose, showSidebar }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 w-[240px] flex flex-col h-screen bg-[#0A4A4A]
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
    >
      {/* Logo */}
      <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
        <img
          src="/images/Adivisor/Navbar/navlogo.png"
          alt="logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* User block */}
      <div className="px-4 py-[14px] border-b border-[#155e5e] flex items-center gap-[10px]">
        <div className="w-10 h-10 rounded-full bg-[#d4a017] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          KM
        </div>
        <div>
          <div className="text-white text-base font-semibold">Admin</div>
          <div className="text-[#8bc34a] text-[10px] mt-[1px]">● Super Administrator</div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {Object.entries(NAV_ITEMS).map(([section, items]) => (
          <div key={section}>
            <div className="text-[#5fa8a8] text-[9px] font-bold uppercase tracking-[1.5px] px-4 pt-[14px] pb-1">
              {section}
            </div>
            {items.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="no-underline"
                  onClick={() => { setActiveNav(item.label); onClose && onClose(); }}
                >
                  <div
                    className={`flex items-center gap-[10px] px-4 py-[10px] cursor-pointer text-sm font-semibold transition-colors duration-[180ms]
                      ${isActive
                        ? "bg-[#155e5e] text-white border-l-[3px] border-[#8bc34a]"
                        : "text-[#a3d0d0] border-l-[3px] border-transparent hover:bg-white/[0.07]"
                      }`}
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
      <div className="py-4 border-t border-[#155e5e]">
        <div className="flex items-center gap-[10px] px-4 py-[10px] text-red-500 text-[13px] cursor-pointer transition-colors duration-[180ms] hover:bg-[#155e5e]">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeWidth="2"/>
          </svg>
          Logout
        </div>
      </div>
    </div>
  );
}



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
  { letter: "H", name: "HDFC Life",    count: 312, pct: 88, bg: "#f0fdfa", border: "#99f6e4", letterBg: "#195FA5", bar: "#195FA5" },
  { letter: "L", name: "LIC of India", count: 194, pct: 55, bg: "#eff6ff", border: "#bfdbfe", letterBg: "#3B6E10", bar: "#3B6E10" },
  { letter: "S", name: "Star Health",  count: 176, pct: 50, bg: "#fefce8", border: "#fde68a", letterBg: "#824E0E", bar: "#824E0E" },
  { letter: "N", name: "New India",    count: 138, pct: 39, bg: "#fef2f2", border: "#fecaca", letterBg: "#993C1D", bar: "#993C1D" },
];

const ROLES = [
  { label: "Senior Advisor",   count: "194",   pct: 55,  color: "#1A6CA2" },
  { label: "Junior Advisor",   count: "194",   pct: 60,  color: "#3B6E10" },
  { label: "Team Leader",      count: "194",   pct: 65,  color: "#844D0A" },
  { label: "Branch Manager",   count: "194",   pct: 56,  color: "#534AB7" },
  { label: "Trailing Advisor", count: "194",   pct: 30,  color: "#E8971A" },
  { label: "LIC of India",     count: "194",   pct: 60,  color: "#888888" },
  { label: "LIC of India",     count: "194",   pct: 65,  color: "#96C458" },
  { label: "Total Advisor",    count: "1,284", pct: 100, color: "#dc2626" },
];

const BAR_MONTHS = [
  { m: "Oct", val: "₹4.2L", h: 42 },
  { m: "Nov", val: "₹4.3L", h: 58 },
  { m: "Dec", val: "₹4.2L", h: 42 },
  { m: "Jan", val: "₹4.3L", h: 58 },
  { m: "Feb", val: "₹4.1L", h: 38 },
  { m: "Mar", val: "₹4.5L", h: 90, gold: true },
];

// ── Mini Donut ────────────────────────────────────────────────────
function MiniDonut({ pct, color, label, count }) {
  const r = 14, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      {label !== "Total Advisor" && (
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="18" cy="18" r={r}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{ color }}
          >
            {pct}%
          </div>
        </div>
      )}

      <div
        className={`font-poppins text-gray-900 ${
          label === "Total Advisor"
            ? "text-xl font-semibold"
            : "text-sm font-medium"
        }`}
      >
        {count}
      </div>

      <div className="text-[10px] font-medium text-gray-400 text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────
function BarChart() {
  const W = 450, H = 130, bottomPad = 25, labelPad = 18, barW = 28;
  const count = BAR_MONTHS.length;
  const spaceBetween = (W - barW * count) / (count - 1);
  const maxVal = Math.max(...BAR_MONTHS.map(b => b.h));

  return (
    <svg viewBox={`0 0 ${W} ${H + bottomPad + labelPad}`} className="w-full" style={{ height: 180 }}>
      <line x1="0" y1={H + labelPad} x2={W} y2={H + labelPad} stroke="#e5e7eb" strokeWidth="2" />
      {[0.25, 0.5, 0.75, 1].map(ratio => {
  const y = H + labelPad - ratio * (H - 10);
  return (
    <line
      key={ratio}
      x1="0" y1={y}
      x2={W} y2={y}
      stroke="#e5e7eb"
      strokeWidth="1"
      strokeDasharray="0"
    />
  );
})}
      {BAR_MONTHS.map(({ m, val, h, gold }, i) => {
        const x = i * (barW + spaceBetween);
        const barH = (h / maxVal) * (H - 10);
        const y = H + labelPad - barH;
        const cx = x + barW / 2;
        return (
          <g key={m}>
           <text x={cx} y={y - 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">
              {val}
            </text>
           <rect
  x={cx - barW / 2}
  y={y}
  width={barW}
  height={barH}
  rx="6"
  fill={gold ? "#F59E0B" : "#1a5c5a"}
/>
            <text x={cx} y={H + labelPad + 18} textAnchor="middle" fontSize="12" fill="#9ca3af" fontWeight="400">
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
    { pct: 25, color: "#F59E0B", offset: 0 },
    { pct: 50, color: "#E8F4F4", offset: -33 },
    { pct: 25, color: "#0A4A4A", offset: -50 },
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
      {/* Circle */}
      <div className="flex items-center justify-center w-[97px] h-[97px] relative flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {segments.map(({ color, pct }, i) => {
            const dash = (pct / 100) * circ;
            const offset =
              i === 0 ? 0 :
              i === 1 ? -(segments[0].pct / 100) * circ :
              -((segments[0].pct + segments[1].pct) / 100) * circ;
            return (
              <circle
                key={i}
                cx="18" cy="18" r={r}
                fill="transparent"
                stroke={color}
                strokeWidth="4"
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={offset}
                transform="rotate(-90 18 18)"
              />
            );
          })}
          <text x="18" y="17" textAnchor="middle" fontSize="6.5" fontWeight="700">
            1,284
          </text>
          <text x="18" y="21.5" textAnchor="middle" fontSize="3.8" fill="#9ca3af">
            total
          </text>
          
        </svg>
      </div>

      {/* Labels */}
      <div className="space-y-2 w-full">
        {[
          { dot: "#f59e0b", label: "Gold",   val: "412 (32%)" },
          { dot: "#0f766e", label: "Silver", val: "210 (16%)" },
          { dot: "#e5e7eb", label: "Free",   val: "662 (52%)" },
        ].map(({ dot, label, val }) => (
          <div key={label} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
            <span className="text-[12px] text-#374151 font-normal">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ────────────────────────────────────────────────────
function LineChart() {
  const W = 400;
  const H = 130;
  const paddingLeft = 38;
  const paddingBottom = 20;
  const paddingTop = 10;
  const chartW = W - paddingLeft;
  const chartH = H - paddingBottom - paddingTop;
  const yMin = 400;
  const yMax = 1500;
  const yLabels = [1400, 1200, 1000, 800, 400];
  const rawData = [500, 700, 850, 900, 1050, 1400];
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const count = rawData.length;
  const toX = (i) => paddingLeft + (i / (count - 1)) * chartW;
  const toY = (val) =>
    paddingTop + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
  const pts = rawData.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H + 4}`} className="w-full" style={{ height: 180 }}>
      {yLabels.map((val) => (
        <line key={val} x1={paddingLeft} y1={toY(val)} x2={W} y2={toY(val)} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      <line x1={paddingLeft} y1={toY(yMin)} x2={W} y2={toY(yMin)} stroke="#e5e7eb" strokeWidth="1" />
      {yLabels.map((val) => (
        <text key={val} x={paddingLeft - 4} y={toY(val) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
          {val}
        </text>
      ))}
      <polyline points={pts} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {rawData.map((val, i) => (
        <circle key={i} cx={toX(i)} cy={toY(val)} r="3.5" fill={i === rawData.length - 1 ? "#C9A227" : "#eef1f1"} />
      ))}
      {months.map((m, i) => (
        <text key={m} x={toX(i)} y={H + 2} textAnchor="middle" fontSize="11" fill="#9ca3af">
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
    <div
      className="flex items-center gap-2 cursor-default px-1.5 py-[3px] rounded-lg transition-all duration-200"
      style={{
        background: hovered ? `${color}11` : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="text-[12px] flex-shrink-0 w-[76px] transition-all duration-200"
        style={{ color: hovered ? color : "#374151", fontWeight: hovered ? 600 : 400 }}
      >
        {name}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${animPct}%`,
            background: color,
            boxShadow: hovered ? `0 0 6px ${color}88` : "none",
          }}
        />
      </div>
      <span
        className="text-[12px] font-semibold w-8 text-right transition-colors duration-200"
        style={{ color: hovered ? color : "#374151" }}
      >
        {count}
      </span>
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
    <div
      className="rounded-xl p-3 cursor-default transition-[transform,box-shadow] duration-[250ms]"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        transform: hovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 8px 24px ${bar}33` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
          style={{ background: letterBg }}
        >
          {letter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-gray-900 leading-tight">{count}</div>
          <div className="text-[12px] text-gray-400">{name}</div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${animPct}%`,
                background: bar,
                boxShadow: hovered ? `0 0 6px ${bar}88` : "none",
              }}
            />
          </div>
          <div className="text-[10px] mt-0.5 font-semibold" style={{ color: "#065F46" }}>
            {pct}% of max
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

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
    <div className="flex min-h-screen text-gray-800 bg-[#EEF2F0]">

      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}



      {/* Main content */}
      <main className="flex-1 flex flex-col bg-[#EEF2F0]">

        {/* Page content */}
        <div className="p-4 space-y-3">

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
                badge: "↑ 18%",
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
              <div
                key={label}
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between cursor-default transition-[transform,box-shadow] duration-200"
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px #0001"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
                    <div style={{ color: ic, fontSize: "16px" }}>{icon}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeC}`}>{badge}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 leading-tight">{val}</div>
                <div className="text-[12px] text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* ── ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold flex items-center gap-1.5">  
                  <span>    💰 <span className="text-black">Subscription Revenue</span>  
                  </span>
                  </h2>
                <span className="text-[12px] font-medium bg-gray-50 px-2 py-0.5 rounded text-[#0A4A4A]">
                  Last 6 Month ▾
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-[20px] font-bold text-black-700">₹4.2L</div>
                  <div className="text-[12px] text-gray-500">👑 Gold</div>
                  <div className="text-[#0A4A4A] text-center font-poppins text-[12px] font-semibold leading-4">140 advisors</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-[20px] font-bold text-black-500">₹2.1L</div>
                  <div className="text-[12px] text-gray-500">🥇 Silver</div>
                  <div className="text-[#0A4A4A] text-center text-[12px] font-semibold leading-4 mt-0.5">210 advisors</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                  <div className="text-[20px] font-bold text-black-600">₹0</div>
                  <div className="text-[12px] text-gray-500">🆓 Free</div>
                  <div className="text-[#0A4A4A] text-center text-[12px] font-semibold leading-4 mt-0.5">934 advisors</div>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 mb-1">Monthly Revenue Trend</p>
              <div className="mt-35"><BarChart /></div>
            </div>

            <div className="col-span-2 flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col" style={{ padding: "26px 31px 26px 30px", justifyContent: "center", alignItems: "flex-start", gap: "16px" }}>
               <div className="flex items-start mb-1 w-full">
          <div className="w-full">
  <h2 className="text-base font-bold leading-4 text-gray-900 flex items-center gap-1.5">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
    Platform Growth
  </h2>
  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
    <p className="text-[12px] text-gray-400 font-medium">Total advisors registered · Last 6 months</p>
    <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>current</span>
  </div>
</div>         
  <span className=" text-[#0A4A4A] text-[14px] font-bold px-2.5 py-0.5 rounded">1,284</span>
                  
                </div>
                <LineChart />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <h2 className="text-base font-bold mb-1">🧩 Plan Split</h2>
                  <p className="text-[12px] text-gray-400">Advisor Subscription tier</p>
                </div>
                <PlanDonut />
              </div>
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold mb-3">📌 City – wise Advisors</h2>
              <div className="space-y-2.5">
                {CITIES.map(({ name, count, pct, color }) => (
                  <CityRow key={name} name={name} count={count} pct={pct} color={color} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold mb-3">🛡 Service – wise Advisors</h2>
              <table className="w-full text-[12px]">
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
              <h2 className="text-base font-bold mb-3 flex items-center gap-1.5">
  <GoHome size={22} strokeWidth={1} /> Company – wise Advisors
</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {COMPANIES.map(({ letter, name, count, pct, bg, border, letterBg, bar }) => (
                  <CompanyCard key={name} letter={letter} name={name} count={count} pct={pct} bg={bg} border={border} letterBg={letterBg} bar={bar} />
                ))}
              </div>
              <div
                className="rounded-xl p-3 flex items-center gap-3 cursor-default transition-[transform,box-shadow] duration-200"
                style={{ background: "#f3f0eb", border: "1px solid #e0d9cf" }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 20px #0001";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="w-9 h-9 bg-gray-400 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-gray-900 leading-tight">362</div>
                  <div className="text-[12px] text-gray-400">Others</div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full rounded-full bg-gray-400" style={{ width: "93%" }} />
                  </div>
                  <div className="text-[10px] mt-0.5 font-semibold" style={{ color: "#065F46" }}>
  All other companies combined
</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold mb-3">👥 Role – wise Advisors</h2>
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
