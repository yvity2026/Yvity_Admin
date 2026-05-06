// "use client";
// import { useState } from "react";
// import CustomerProfile from "@/components/CustomerProfile";
// import Link from "next/link";
// import { useEffect } from "react";

// const COLORS = {
//   primary: "#0A4A4A",
//   primaryHover: "#155e5e",
//   primaryBorder: "#155e5e",
//   accent: "#8bc34a",
//   gold: "#d4a017",
// };

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

// function Sidebar({ activeNav, setActiveNav, onClose }) {
//   return (
//     <div style={{ background: COLORS.primary, minHeight: "100vh", width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
//       {/* Logo */}
//     <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
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

// // ── Customer data ──────────────────────────────────────────────────────────
// const customers = [
//   { initials: "KM", bg: "#d4a017", name: "Krishna Mohan", mobile: "+91 9123456789", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Teacher",       reviews: "3 Reviews", lastLogin: "2 hrs ago",  joined: "Jan 2026" },
//   { initials: "KM", bg: "#d4a017", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Software Eng.", reviews: "5 Reviews", lastLogin: "10 min ago", joined: "Jan 2026" },
//   { initials: "KM", bg: "#d4a017", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Business Owner", reviews: "1 Review",  lastLogin: "Yesterday",  joined: "Jan 2026" },
//   { initials: "KM", bg: "#d4a017", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Govt. Employee", reviews: "2 Reviews", lastLogin: "3 days ago", joined: "Jan 2026" },
//   { initials: "KM", bg: "#d4a017", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Business Owner", reviews: "1 Review",  lastLogin: "Yesterday",  joined: "Jan 2026" },
// ];

// export default function CustomersDashboard() {
//   const [activeNav, setActiveNav] = useState("Customers");
//   const [search, setSearch] = useState("");
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
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

//   const filtered = customers.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase()) ||
//     c.email.toLowerCase().includes(search.toLowerCase()) ||
//     c.city.toLowerCase().includes(search.toLowerCase()) ||
//     c.profession.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f3f4f6" }}>

//       {/* ── MOBILE RESPONSIVE STYLES ── */}
//       <style>{`
//         .cust-sidebar-container {
//           position: relative;
//           z-index: 50;
//         }
//         .cust-hamburger-btn {
//           display: none;
//         }
//         .cust-mobile-overlay {
//           display: none;
//         }
//         .cust-table-scroll-hint {
//           display: none;
//         }
//         @media (max-width: 768px) {
//           .cust-sidebar-container {
//             position: fixed !important;
//             top: 0;
//             left: 0;
//             height: 100vh;
//             transform: translateX(-100%);
//             transition: transform 0.25s ease;
//           }
//           .cust-sidebar-container.open {
//             transform: translateX(0);
//           }
//           .cust-mobile-overlay {
//             display: block;
//             position: fixed;
//             inset: 0;
//             background: rgba(0, 0, 0, 0.45);
//             z-index: 40;
//           }
//           .cust-hamburger-btn {
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
//           .cust-table-scroll-hint {
//             display: block;
//             font-size: 11px;
//             color: #9ca3af;
//             text-align: right;
//             padding: 6px 12px 2px;
//           }
//           .cust-main-content-padding {
//             padding: 14px !important;
//           }
//           .cust-stat-cards {
//             flex-direction: column !important;
//           }
//           .cust-stat-cards > div {
//             max-width: 100% !important;
//           }
//         }
//       `}</style>

//       {/* ── MOBILE: Dark overlay — tap to close sidebar ── */}
//       {showSidebar && (
//         <div
//           className="cust-mobile-overlay"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* ── MOBILE: Sidebar wrapped in slide-in container ── */}
//       <div className={`cust-sidebar-container${showSidebar ? " open" : ""}`}>
//         <Sidebar
//           activeNav={activeNav}
//           setActiveNav={setActiveNav}
//           onClose={() => setShowSidebar(false)}
//         />
//       </div>

//       {/* Main */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         {/* Topbar */}
//         <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {/* ── MOBILE: Hamburger button ── */}
//             <button
//               className="cust-hamburger-btn"
//               onClick={() => setShowSidebar(true)}
//               aria-label="Open menu"
//             >
//               <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
//                 <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//             </button>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Customers</div>
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

//         {/* Content */}
//         <div className="cust-main-content-padding" style={{ padding: 24, overflowY: "auto", flex: 1 }}>

//           {/* Stat Cards */}
//           <div className="cust-stat-cards" style={{ display: "flex", gap: 16, marginBottom: 22 }}>
//             {/* Total Customers */}
//             <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.055)", flex: 1, maxWidth: 280 }}>
//               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef4f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2">
//                     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//                   </svg>
//                 </div>
//                 <span style={{ background: "#e6f5f0", color: "#1a7a5a", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px" }}>↑ 34%</span>
//               </div>
//               <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>8,492</div>
//               <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3, fontWeight: 500 }}>Total Customers</div>
//             </div>

//             {/* Joined Today */}
//             <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.055)", flex: 1, maxWidth: 280 }}>
//               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef4f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2255bb" strokeWidth="2">
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                 </div>
//                 <span style={{ background: "#e6f0ff", color: "#2255bb", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px" }}>+48</span>
//               </div>
//               <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>48</div>
//               <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3, fontWeight: 500 }}>Joined Today</div>
//             </div>
//           </div>

//           {/* Header */}
//           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//             <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">
//               <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" />
//               <circle cx="9" cy="7" r="4" strokeWidth="2" />
//               <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" />
//             </svg>
//             <span style={{ fontSize: 16, fontWeight: "bold",  color: "#111827" }}>All Customers</span>
//           </div>
//           <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>8,492 registered users</div>

//           {/* Search */}
//           <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
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
//     <input
//       className="search-input"
//       placeholder="Search"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />
//     <div className="search-arrow">→</div>
//   </div>
// </div>

//           {/* Table */}
//           <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>

//             {/* ── MOBILE: Scroll hint ── */}
//             <div className="cust-table-scroll-hint">← Scroll to see all columns →</div>

//             {/* ── MOBILE: overflowX wrapper correctly wraps the table ── */}
//             <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
//               <table style={{ minWidth: 900, width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {["Name", "Mobile", "Email", "City", "Profession", "Reviews", "Last Login", "Joined", "Actions"].map((h) => (
//                       <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", padding: "10px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((c, i) => (
//                     <tr
//                       key={i}
//                       style={{ borderBottom: "1px solid #f3f4f6" }}
//                       onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
//                     >
//                       <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                           <Avatar initials={c.initials} size={34} bg={c.bg} />
//                           <span style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>{c.name}</span>
//                         </div>
//                       </td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#374151", verticalAlign: "middle" }}>{c.mobile}</td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#374151", verticalAlign: "middle" }}>{c.email}</td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#374151", verticalAlign: "middle" }}>{c.city}</td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#374151", verticalAlign: "middle" }}>{c.profession}</td>
//                       <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
//                         <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
//                           {c.reviews}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#6b7280", verticalAlign: "middle" }}>{c.lastLogin}</td>
//                       <td style={{ padding: "12px 12px", fontSize: 12, color: "#6b7280", verticalAlign: "middle" }}>{c.joined}</td>
//                       <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
//                         <button
//                           onClick={() => setShowCustomerModal(true)}
//                           style={{ background: COLORS.primary, color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none" }}
//                           onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryHover; }}
//                           onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primary; }}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showCustomerModal && (
//         <CustomerProfile onClose={() => setShowCustomerModal(false)} />
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import CustomerProfile from "@/components/CustomerProfile";
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

function Sidebar({ activeNav, setActiveNav, onClose }) {
  return (
    <div className="bg-[#0A4A4A] min-h-screen w-[280px] shrink-0 flex flex-col">
      {/* Logo */}
      <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
        <img src="/images/Adivisor/Navbar/navlogo.png" alt="logo" className="h-10 w-auto object-contain" />
      </div>

      {/* User */}
      <div className="px-4 py-3.5 border-b border-[#155e5e]">
        <div className="flex items-center gap-2.5">
          <Avatar initials="KM" />
          <div>
            <div className="text-white text-[13px] font-semibold">Admin</div>
            <div className="text-[#8bc34a] text-[10px] mt-0.5">● Super Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1">
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section}>
            <div className="text-[#5fa8a8] text-[10px] font-semibold uppercase tracking-widest px-4 pt-3.5 pb-1">
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
                    className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm border-l-[3px] ${
                      isActive
                        ? "text-white bg-[#155e5e] border-[#8bc34a]"
                        : "text-[#a3d0d0] bg-transparent border-transparent hover:bg-[#155e5e]"
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
      <div className="py-4">
        <div className="flex items-center gap-2.5 px-4 py-2.5 text-red-500 text-sm cursor-pointer hover:bg-[#155e5e]">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeWidth="2" />
          </svg>
          Logout
        </div>
      </div>
    </div>
  );
}

const customers = [
  { initials: "KM", name: "Krishna Mohan", mobile: "+91 9123456789", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Teacher",        reviews: "3 Reviews", lastLogin: "2 hrs ago",  joined: "Jan 2026" },
  { initials: "KM", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Software Eng.",   reviews: "5 Reviews", lastLogin: "10 min ago", joined: "Jan 2026" },
  { initials: "KM", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Business Owner",  reviews: "1 Review",  lastLogin: "Yesterday",  joined: "Jan 2026" },
  { initials: "KM", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Govt. Employee",  reviews: "2 Reviews", lastLogin: "3 days ago", joined: "Jan 2026" },
  { initials: "KM", name: "Krishna Mohan", mobile: "+91 9876543210", email: "Krishna@email.com", city: "Hyderabad, TS", profession: "Business Owner",  reviews: "1 Review",  lastLogin: "Yesterday",  joined: "Jan 2026" },
];

export default function CustomersDashboard() {
  const [activeNav, setActiveNav] = useState("Customers");
  const [search, setSearch] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.profession.toLowerCase().includes(search.toLowerCase())
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

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 md:relative md:translate-x-0 md:z-auto md:flex md:shrink-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} onClose={() => setShowSidebar(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center bg-transparent border-none cursor-pointer p-1.5 rounded-md mr-2"
              onClick={() => setShowSidebar(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="text-lg font-bold text-gray-900">Customers</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" />
              </svg>
              <div className="w-2 h-2 bg-amber-400 rounded-full absolute -top-0.5 -right-0.5" />
            </div>
            <Avatar initials="KM" size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-md:p-3.5 overflow-y-auto flex-1">

          {/* Stat Cards */}
          <div className="flex flex-col md:flex-row gap-4 mb-5">

            {/* Total Customers */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 max-w-[280px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[11px] font-bold rounded-full px-2.5 py-0.5">↑ 34%</span>
              </div>
              <div className="text-[28px] font-extrabold text-gray-900 leading-tight">8,492</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Total Customers</div>
            </div>

            {/* Joined Today */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 max-w-[280px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2255bb" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span className="bg-[#e6f0ff] text-[#2255bb] text-[11px] font-bold rounded-full px-2.5 py-0.5">+48</span>
              </div>
              <div className="text-[28px] font-extrabold text-gray-900 leading-tight">48</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Joined Today</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" />
            </svg>
            <span className="text-base font-bold text-gray-900">All Customers</span>
          </div>
          <div className="text-xs text-gray-400 mb-4">8,492 registered users</div>

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
            <div className="md:hidden text-[11px] text-gray-400 text-right px-3 pt-1.5">
              ← Scroll to see all columns →
            </div>

            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr>
                    {["Name", "Mobile", "Email", "City", "Profession", "Reviews", "Last Login", "Joined", "Actions"].map((h) => (
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
                  {filtered.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={c.initials} size="sm" />
                          <span className="font-semibold text-gray-900 text-[13px]">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{c.mobile}</td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{c.email}</td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{c.city}</td>
                      <td className="px-3 py-3 text-xs text-gray-700 align-middle">{c.profession}</td>
                      <td className="px-3 py-3 align-middle">
                        <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                          {c.reviews}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500 align-middle">{c.lastLogin}</td>
                      <td className="px-3 py-3 text-xs text-gray-500 align-middle">{c.joined}</td>
                      <td className="px-3 py-3 align-middle">
                        <button
                          onClick={() => setShowCustomerModal(true)}
                          className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <CustomerProfile onClose={() => setShowCustomerModal(false)} />
      )}
    </div>
  );
}