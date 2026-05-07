
// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useEffect } from "react";

// // ── Exact colors from CustomersDashboard ──────────────────────────
// const COLORS = {
//   primary: "#0A4A4A",
//   primaryHover: "#155e5e",
//   primaryBorder: "#155e5e",
//   accent: "#8bc34a",
//   gold: "#d4a017",
// };

// // ── Exact navItems from CustomersDashboard ────────────────────────
// const navItems = {
//   MAIN: [
//     {
//       label: "Overview",
//       href: "/admin",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
//           <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
//           <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
//           <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Advisors",
//       href: "/admin/advisors",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="9" cy="7" r="4" strokeWidth="2" />
//           <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
//           <path d="M16 11l2 2 4-4" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Customers",
//       href: "/admin/customers",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="12" cy="8" r="4" strokeWidth="2" />
//           <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
//   APPROVALS: [
//     {
//       label: "IRDAI Approvals",
//       href: "/admin/irdaiapprovals",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="12" cy="12" r="9" strokeWidth="2" />
//           <path d="M9 12l2 2 4-4" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Testimonials",
//       href: "/admin/testimonials",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
//   FINANCE: [
//     {
//       label: "Payments",
//       href: "/admin/payments",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Subscriptions",
//       href: "/admin/subscriptions",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
//   SYSTEM: [
//     {
//       label: "Settings",
//       href: "/admin/settings",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="12" cy="12" r="3" strokeWidth="2" />
//           <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
// };

// // ── Exact Avatar from CustomersDashboard ──────────────────────────
// function Avatar({ initials, size = 40, bg = COLORS.gold }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: bg,
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontWeight: 700,
//         fontSize: size * 0.32,
//         flexShrink: 0,
//       }}
//     >
//       {initials}
//     </div>
//   );
// }

// // ── Sidebar with mobile onClose support (from CustomersDashboard) ─
// function Sidebar({ activeNav, setActiveNav, onClose }) {
//   return (
//     <div style={{ background: COLORS.primary, minHeight: "100vh", width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
//       {/* Logo */}
//      <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
//   <img
//     src="/images/Adivisor/Navbar/navlogo.png"
//     alt="logo"
//     className="h-10 w-auto object-contain"
//   />
// </div>

//       {/* User */}
//       <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.primaryBorder}` }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <Avatar initials="KM" size={40} />
//           <div>
//             <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Admin</div>
//             <div style={{ color: COLORS.accent, fontSize: 10, marginTop: 1 }}>● Super Administrator</div>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <div style={{ flex: 1 }}>
//         {Object.entries(navItems).map(([section, items]) => (
//           <div key={section}>
//             <div style={{ color: "#5fa8a8", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, padding: "14px 16px 4px" }}>
//               {section}
//             </div>
//             {items.map((item) => {
//               const isActive = activeNav === item.label;
//               return (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   style={{ textDecoration: "none" }}
//                   onClick={() => { setActiveNav(item.label); onClose && onClose(); }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 10,
//                       padding: "9px 16px",
//                       cursor: "pointer",
//                       color: isActive ? "#fff" : "#a3d0d0",
//                       background: isActive ? COLORS.primaryHover : "transparent",
//                       borderLeft: isActive
//                         ? `3px solid ${COLORS.accent}`
//                         : "3px solid transparent",
//                     }}
//                   >
//                     {item.icon}
//                     {item.label}
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       {/* Logout */}
//       <div style={{ padding: "16px 0" }}>
//         <div
//           style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", color: "#ef4444", fontSize: 13, cursor: "pointer" }}
//           onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryHover; }}
//           onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
//         >
//           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//             <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeWidth="2" />
//           </svg>
//           Logout
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Subscription data (unchanged) ─────────────────────────────────
// const subscriptions = [
//   {
//     name: "Krishna Mohan", plan: "Gold Plan", date: "Jan 15, 2025", amount: "₹2,999",
//     days: "7 days", initials: "KM", avatarBg: "#e8a020",
//     badgeBg: "#fee2e2", badgeColor: "#b91c1c", remind: true,
//   },
//   {
//     name: "Sunitha Mehta", plan: "Gold Plan", date: "Jan 20, 2026", amount: "₹2,999",
//     days: "12 days", initials: "SM", avatarBg: "#1a5a50",
//     badgeBg: "#ffedd5", badgeColor: "#c2410c", remind: true,
//   },
//   {
//     name: "Rahul Kumar", plan: "Silver Plan", date: "Jan 22, 2026", amount: "₹999",
//     days: "14 days", initials: "RK", avatarBg: "#e8a020",
//     badgeBg: "#fef9c3", badgeColor: "#a16207", remind: true,
//   },
//   {
//     name: "Sunitha Mehta", plan: "Gold Plan", date: "Jan 22, 2026", amount: "₹999",
//     days: "28 days", initials: "SM", avatarBg: "#1a5a50",
//     badgeBg: "#dcfce7", badgeColor: "#166534", remind: false,
//   },
// ];

// // ── Main Component ─────────────────────────────────────────────────
// export default function SubscriptionsPage() {
//   const [activeNav, setActiveNav] = useState("Subscriptions");
//   const [search, setSearch]       = useState("");
//   const [showSidebar, setShowSidebar] = useState(false); 

//   useEffect(() => {
//   if (showSidebar) {
//     document.body.style.overflow = "hidden";
//   } else {
//     document.body.style.overflow = "auto";
//   }

//   return () => {
//     document.body.style.overflow = "auto";
//   };
// }, [showSidebar]);

//   const filtered = subscriptions.filter(s =>
//     s.name.toLowerCase().includes(search.toLowerCase()) ||
//     s.plan.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f3f4f6" }}>

//       {/* ── MOBILE RESPONSIVE STYLES ── */}
//       <style>{`
//         .subs-sidebar-container {
//           position: relative;
//           z-index: 50;
//         }
//         .subs-hamburger-btn {
//           display: none;
//         }
//         .subs-mobile-overlay {
//           display: none;
//         }
//         @media (max-width: 768px) {
//           .subs-sidebar-container {
//             position: fixed !important;
//             top: 0;
//             left: 0;
//             height: 100vh;
//             transform: translateX(-100%);
//             transition: transform 0.25s ease;
//           }
//           .subs-sidebar-container.open {
//             transform: translateX(0);
//           }
//           .subs-mobile-overlay {
//             display: block;
//             position: fixed;
//             inset: 0;
//             background: rgba(0, 0, 0, 0.45);
//             z-index: 40;
//           }
//           .subs-hamburger-btn {
//             display: flex !important;
//             align-items: center;
//             justify-content: center;
//             background: none;
//             border: none;
//             cursor: pointer;
//             padding: 6px;
//             border-radius: 6px;
//             margin-right: 8px;
//           }
//           .subs-main-content-padding {
//             padding: 14px !important;
//           }
//         }
//       `}</style>

//       {/* ── MOBILE: Dark overlay — tap to close sidebar ── */}
//       {showSidebar && (
//         <div
//           className="subs-mobile-overlay"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* ── MOBILE: Sidebar wrapped in slide-in container ── */}
//       <div className={`subs-sidebar-container${showSidebar ? " open" : ""}`}>
//         <Sidebar
//           activeNav={activeNav}
//           setActiveNav={setActiveNav}
//           onClose={() => setShowSidebar(false)}
//         />
//       </div>

//       {/* ── Main ── */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

//         {/* ── Topbar ── */}
//         <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {/* ── MOBILE: Hamburger button ── */}
//             <button
//               className="subs-hamburger-btn"
//               onClick={() => setShowSidebar(true)}
//               aria-label="Open menu"
//             >
//               <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
//                 <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//             </button>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Subscriptions</div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ position: "relative" }}>
//               <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
//                 <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" />
//               </svg>
//               <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", position: "absolute", top: -2, right: -2 }} />
//             </div>
//             <Avatar initials="KM" size={32} />
//           </div>
//         </div>

//         {/* ── Content (unchanged subscription data & UI) ── */}
//         <div className="subs-main-content-padding" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
//           <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.055)" }}>

//             {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
  
//   <span style={{ fontSize: 18 }}>
//     🔄
//   </span>

//   <span style={{ fontSize: 15, fontWeight: 700, color: "#1a3330" }}>
//     Upcoming Renewals
//   </span>
// </div>

//             {/* Search */}
//            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
//   <style>{`
//     .search-wrap {
//       display: flex;
//       align-items: center;
//       background: #0A4A4A;
//       border-radius: 999px;
//       padding: 0 20px 0 24px;
//       gap: 10px;
//       flex: 1;
//       max-width: 100%;
//       height: 48px;
//     }
//     .search-input {
//       border: none;
//       background: transparent;
//       outline: none;
//       font-size: 14px;
//       color: #fff;
//       flex: 1;
//       min-width: 0;
//       font-family: inherit;
//     }
//     .search-input::placeholder { color: rgba(255,255,255,0.7); }
//     .search-arrow {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: #fff;
//       font-size: 18px;
//       cursor: pointer;
//       flex-shrink: 0;
//     }
//   `}</style>

//   <div className="search-wrap">
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2">
//       <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
//     </svg>
//     <input
//       className="search-input"
//       placeholder="Search"
//       value={search}
//       onChange={e => setSearch(e.target.value)}
//     />
//     <div className="search-arrow">→</div>
//   </div>
// </div>

//             {/* Rows */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {filtered.map((item, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex", alignItems: "center", justifyContent: "space-between",
//                     background: "#f5f7f5", borderRadius: 12, padding: "14px 16px",
//                     transition: "background 0.18s, transform 0.18s",
//                   }}
//                   onMouseEnter={(e) => { e.currentTarget.style.background = "#edf0ec"; e.currentTarget.style.transform = "translateX(2px)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f7f5"; e.currentTarget.style.transform = "translateX(0)"; }}
//                 >
//                   {/* Left */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{
//                       width: 40, height: 40, borderRadius: "50%",
//                       background: item.avatarBg, color: "#fff",
//                       fontWeight: 700, fontSize: 12,
//                       display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                     }}>
//                       {item.initials}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3330" }}>{item.name}</div>
//                       <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
//                         {item.plan} &bull; {item.date} &bull; {item.amount}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                     <span style={{
//                       fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
//                       background: item.badgeBg, color: item.badgeColor, whiteSpace: "nowrap",
//                     }}>
//                       {item.days}
//                     </span>
//                     {item.remind && (
//                       <button
//                         style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, background: "none", border: "none", cursor: "pointer" }}
//                         onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.accent; }}
//                         onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.primary; }}
//                       >
//                         Remind
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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
