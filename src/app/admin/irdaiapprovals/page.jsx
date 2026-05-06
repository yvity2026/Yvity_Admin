
// "use client";
// import { useState } from "react";
// import IrdaiModal from "@/components/IrdaiModal";
// import RejectModal from "@/components/RejectModal";
// import Link from "next/link";
// import { useEffect } from "react";

// const COLORS = {
//   primary: "#0A4A4A",
//   primaryHover: "#155e5e",
//   primaryBorder: "#155e5e",
//   accent: "#8bc34a",
//   gold: "#d4a017",
// };

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

//   * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

//   @keyframes fadeInUp {
//     from { opacity: 0; transform: translateY(14px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes slideIn {
//     from { opacity: 0; transform: translateX(-10px); }
//     to   { opacity: 1; transform: translateX(0); }
//   }

//   .app-shell { display: flex; min-height: 100vh; background: #f0f2ee; }

//   .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

//   .content { flex: 1; padding: 24px 28px; overflow-y: auto; }

//   .stat-row { display: flex; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
//   .stat-card {
//     background: #fff; border-radius: 14px; padding: 18px 22px;
//     box-shadow: 0 2px 10px rgba(0,0,0,0.055);
//     flex: 1; min-width: 160px; max-width: 240px;
//     position: relative;
//     animation: fadeInUp 0.4s ease both;
//     transition: box-shadow 0.22s, transform 0.22s;
//   }
//   .stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }

//   .stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
//   .stat-icon-wrap {
//     width: 38px; height: 38px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .stat-badge-pending  { background: #fff5e6; color: #c57a00; font-size: 10px; font-weight: 700; border-radius: 20px; padding: 3px 9px; }
//   .stat-badge-approved { background: #e6f5f0; color: #1a7a5a; font-size: 10px; font-weight: 700; border-radius: 20px; padding: 3px 9px; display: flex; align-items: center; gap: 3px; }
//   .stat-badge-rejected { background: #fff0f0; color: #cc3333; font-size: 10px; font-weight: 700; border-radius: 20px; padding: 3px 9px; }
//   .stat-number { font-size: 28px; font-weight: 800; color: #1a3330; line-height: 1.1; }
//   .stat-label  { font-size: 12px; color: #999; margin-top: 3px; font-weight: 500; }

//   .panel {
//     background: #fff; border-radius: 16px; padding: 22px 24px;
//     box-shadow: 0 2px 10px rgba(0,0,0,0.055);
//     animation: fadeInUp 0.4s 0.08s ease both;
//   }

//   .panel-header {
//     display: flex; align-items: center; justify-content: space-between;
//     margin-bottom: 16px; flex-wrap: wrap; gap: 10px;
//   }
//   .panel-title-row { display: flex; align-items: center; gap: 10px; }
//   .panel-icon {
//     width: 26px; height: 26px; border-radius: 7px;
//     background: #eef4f2; display: flex; align-items: center; justify-content: center;
//   }
//   .panel-title { font-size: 15px; font-weight: 700; color: #1a3330; }

//   .legend { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

//   .search-wrap {
//     display: flex;
//     align-items: center;
//     background: #0A4A4A;
//     border-radius: 999px;
//     padding: 0 20px 0 24px;
//     gap: 10px;
//     flex: 1;
//     max-width: 100%;
//     height: 48px;
//   }
//   .search-input {
//     border: none;
//     background: transparent;
//     outline: none;
//     font-size: 14px;
//     color: #fff;
//     flex: 1;
//     min-width: 0;
//     font-family: 'DM Sans', sans-serif;
//   }
//   .search-input::placeholder { color: rgba(255,255,255,0.7); }
//   .search-arrow {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: #fff;
//     font-size: 18px;
//     cursor: pointer;
//     flex-shrink: 0;
//   }

//   .submission-list { display: flex; flex-direction: column; gap: 10px; }

//   .submission-row {
//     background: #f9fbf9; border-radius: 12px; padding: 14px 18px;
//     display: flex; align-items: center; gap: 14px;
//     border: 1px solid #eef0ee;
//     animation: slideIn 0.3s ease both;
//     transition: box-shadow 0.2s, transform 0.2s;
//     flex-wrap: wrap;
//   }
//   .submission-row:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.08); transform: translateY(-1px); background: #fff; }

//   .sub-avatar {
//     width: 40px; height: 40px; border-radius: 50%;
//     color: #fff; font-weight: 700; font-size: 12px;
//     display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//   }
//   .sub-info { flex: 1; min-width: 0; }
//   .sub-name { font-size: 13px; font-weight: 700; color: #1a3330; }
//   .sub-meta { font-size: 11px; color: #999; margin-top: 2px; }

//   .sub-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

//   .day-badge {
//     border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700;
//     display: flex; align-items: center; gap: 4px; white-space: nowrap;
//   }
//   .day-red    { background: #fff0f0; color: #cc3333; }
//   .day-orange { background: #fff5e6; color: #c57a00; }
//   .day-yellow { background: #fffbe6; color: #9a7200; }
//   .day-green  { background: #e6f5f0; color: #1a7a5a; }

//   .btn-link {
//     font-size: 12px; font-weight: 600; color: #0d3330;
//     background: none; border: none; cursor: pointer;
//     text-decoration: underline; text-underline-offset: 2px;
//     padding: 4px 2px; transition: color 0.15s;
//   }
//   .btn-link:hover { color: #1a7a5a; }

//   .btn-approve {
//     padding: 6px 18px; border-radius: 999px; font-size: 12px; font-weight: 600;
//     border: 1.5px solid #b3e0cc; background: #e6f5f0; color: #1a7a5a; cursor: pointer;
//     display: flex; align-items: center; gap: 5px;
//     transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
//   }
//   .btn-approve:hover { background: #1a7a5a; color: #fff; border-color: #1a7a5a; transform: translateY(-2px) scale(1.04); box-shadow: 0 5px 16px rgba(26,122,90,0.28); }

//   .btn-reject {
//     padding: 6px 18px; border-radius: 999px; font-size: 12px; font-weight: 600;
//     border: 1.5px solid #ffcccc; background: #fff5f5; color: #cc3333; cursor: pointer;
//     display: flex; align-items: center; gap: 5px;
//     transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
//   }
//   .btn-reject:hover { background: #cc3333; color: #fff; border-color: #cc3333; transform: translateY(-2px) scale(1.04); box-shadow: 0 5px 16px rgba(204,51,51,0.28); }

//   .irdai-sidebar-container { position: relative; z-index: 50; }
//   .irdai-hamburger-btn { display: none; }
//   .irdai-mobile-overlay { display: none; }

//   @media (max-width: 768px) {
//     .irdai-sidebar-container {
//       position: fixed !important; top: 0; left: 0; height: 100vh;
//       transform: translateX(-100%); transition: transform 0.25s ease;
//     }
//     .irdai-sidebar-container.open { transform: translateX(0); }
//     .irdai-mobile-overlay {
//       display: block; position: fixed; inset: 0;
//       background: rgba(0,0,0,0.45); z-index: 40;
//     }
//     .irdai-hamburger-btn {
//       display: flex !important; align-items: center; justify-content: center;
//       background: none; border: none; cursor: pointer;
//       padding: 6px; border-radius: 6px; margin-right: 8px;
//     }
//     .content { padding: 14px !important; }
//     .stat-row { flex-direction: column; }
//     .stat-card { max-width: 100% !important; }
//     .sub-actions { flex-wrap: wrap; gap: 6px; }
//     .submission-row { flex-wrap: wrap; }
//     .legend { flex-wrap: wrap; gap: 8px; }
//   }
// `;

// const navItems = {
//   MAIN: [
//     {
//       label: "Overview", href: "/admin",
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
//       label: "Advisors", href: "/admin/advisors",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="9" cy="7" r="4" strokeWidth="2" />
//           <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
//           <path d="M16 11l2 2 4-4" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Customers", href: "/admin/customers",
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
//       label: "IRDAI Approvals", href: "/admin/irdaiapprovals",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <circle cx="12" cy="12" r="9" strokeWidth="2" />
//           <path d="M9 12l2 2 4-4" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Testimonials", href: "/admin/testimonials",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
//   FINANCE: [
//     {
//       label: "Payments", href: "/admin/payments",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
//         </svg>
//       ),
//     },
//     {
//       label: "Subscriptions", href: "/admin/subscriptions",
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
//           <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
//         </svg>
//       ),
//     },
//   ],
//   SYSTEM: [
//     {
//       label: "Settings", href: "/admin/settings",
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
//     <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.32, flexShrink: 0 }}>
//       {initials}
//     </div>
//   );
// }

// function Sidebar({ activeNav, setActiveNav, onClose }) {
//     const handleLogout = async () => {
//   try {
//     await fetch("/api/auth/admin/logout", {
//       method: "POST",
//     });

//     window.location.href = "/auth/admin/login";
//   } catch (err) {
//     console.error("Logout failed", err);
//   }
// };
//   return (
//     <div style={{ background: COLORS.primary, minHeight: "100vh", width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
//       <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
//         <img src="/images/Adivisor/Navbar/navlogo.png" alt="logo" className="h-10 w-auto object-contain" />
//       </div>

//       <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.primaryBorder}` }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <Avatar initials="KM" size={40} />
//           <div>
//             <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Admin</div>
//             <div style={{ color: COLORS.accent, fontSize: 10, marginTop: 1 }}>● Super Administrator</div>
//           </div>
//         </div>
//       </div>

//       <div style={{ flex: 1 }}>
//         {Object.entries(navItems).map(([section, items]) => (
//           <div key={section}>
//             <div style={{ color: "#5fa8a8", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, padding: "14px 16px 4px" }}>
//               {section}
//             </div>
//             {items.map((item) => {
//               const isActive = activeNav === item.label;
//               return (
//                 <Link key={item.label} href={item.href} style={{ textDecoration: "none" }} onClick={() => { setActiveNav(item.label); onClose && onClose(); }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", color: isActive ? "#fff" : "#a3d0d0", background: isActive ? COLORS.primaryHover : "transparent", borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent" }}>
//                     {item.icon}
//                     {item.label}
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       <div style={{ padding: "16px 0" }} onClick={handleLogout}>
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

// const IHourglass = ({ color }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
//     <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12m0 0L7 6.172A2 2 0 016.414 4.758 2 2 0 015 4V2h14v2a2 2 0 01-.586 1.414A2 2 0 0117 6.172L12 12z"/>
//   </svg>
// );
// const ICheckCircle = ({ color }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
//     <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
//     <polyline points="22 4 12 14.01 9 11.01"/>
//   </svg>
// );
// const IXCircle = ({ color }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
//     <circle cx="12" cy="12" r="10"/>
//     <line x1="15" y1="9" x2="9" y2="15"/>
//     <line x1="9" y1="9" x2="15" y2="15"/>
//   </svg>
// );
// const ICalendar = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <rect x="3" y="4" width="18" height="18" rx="2"/>
//     <line x1="16" y1="2" x2="16" y2="6"/>
//     <line x1="8" y1="2" x2="8" y2="6"/>
//     <line x1="3" y1="10" x2="21" y2="10"/>
//   </svg>
// );
// const ICheckSm = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//     <polyline points="20 6 9 17 4 12"/>
//   </svg>
// );
// const IXSm = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//     <line x1="18" y1="6" x2="6" y2="18"/>
//     <line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// );
// const IHourglassSm = () => (
//   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//     <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12"/>
//   </svg>
// );
// const ISubmission = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2.5">
//     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
//     <polyline points="14 2 14 8 20 8"/>
//     <line x1="16" y1="13" x2="8" y2="13"/>
//     <line x1="16" y1="17" x2="8" y2="17"/>
//     <polyline points="10 9 9 9 8 9"/>
//   </svg>
// );

// // const submissions = [
// //   { id: "sub-1", initials: "KM", bg: "#e8a020", name: "Rahul Kumar",  location: "Vijayawada, AP",  lic: "LIC-AP-2022-48291", type: "Life Insurance",   plan: "₹999 Silver",  submitted: "Submitted 2 days ago", days: "2 days", dayType: "day-red" },
// //   { id: "sub-2", initials: "KM", bg: "#1a5a50", name: "Sunita Mehta", location: "Hyderabad, TS",  lic: "LIC-AP-2022-48291", type: "Health Insurance", plan: "₹2,999 Gold", submitted: "Submitted 3 days ago", days: "3 days", dayType: "day-red" },
// //   { id: "sub-3", initials: "KM", bg: "#e8a020", name: "Rahul Kumar",  location: "Vijayawada, AP",  lic: "LIC-AP-2022-48291", type: "Life Insurance",   plan: "₹999 Silver",  submitted: "Submitted 4 days ago", days: "4 days", dayType: "day-red" },
// //   { id: "sub-4", initials: "KM", bg: "#1a5a50", name: "Sunita Mehta", location: "Hyderabad, TS",  lic: "LIC-AP-2022-48291", type: "Health Insurance", plan: "₹2,999 Gold", submitted: "Submitted 1 day ago",  days: "1 day",  dayType: "day-yellow" },
// // ];

// export default function IRDAIApprovals() {
//   const [showModal, setShowModal]         = useState(false);
//   const [activeNav, setActiveNav]         = useState("IRDAI Approvals");
//   const [search, setSearch]               = useState("");
//   const [rows, setRows]                   = useState([]);
//   const [showSidebar, setShowSidebar]     = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [openReject, setOpenReject]       = useState(false);
//   const [isProcessing, setIsProcessing]   = useState(false);
//   const [activeFilter, setActiveFilter]   = useState(null);
//   const [stats, setStats] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     pendingPercentage: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (showSidebar) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => { document.body.style.overflow = "auto"; };
//   }, [showSidebar]);

//   useEffect(() => {
//     const loadApprovals = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await fetch("/api/admin/approvals");
//         if (!response.ok) {
//           throw new Error(`Failed to load approvals: ${response.status}`);
//         }

//         const payload = await response.json();
//         const items = payload?.data || [];
//         const nextStats = payload?.stats || {
//           pending: 0,
//           approved: 0,
//           rejected: 0,
//         };
//         const total =
//           nextStats.pending + nextStats.approved + nextStats.rejected;

//         setStats({
//           pending: nextStats.pending || 0,
//           approved: nextStats.approved || 0,
//           rejected: nextStats.rejected || 0,
//           pendingPercentage: total
//             ? ((nextStats.pending / total) * 100).toFixed(2)
//             : 0,
//         });

//         const nextRows = items.map((item, index) => {
//           const name = item.name || "Advisor";
//           const location = item.location || "Unknown, IN";
//           const status = item.status || "pending";
//           const initials =
//             name
//               .split(" ")
//               .filter(Boolean)
//               .slice(0, 2)
//               .map((word) => word[0].toUpperCase())
//               .join("") || "AD";

//           const submittedAt = item.submittedAt ? new Date(item.submittedAt) : new Date();
//           const diffDays = Math.max(1, Math.floor((Date.now() - submittedAt.getTime()) / 86400000));
//           const days = `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
//           const fileName = item.licenseUrl
//             ? item.licenseUrl.split("/").pop()
//             : "certificate.jpg";
//           const dayTypeByStatus = {
//             pending: diffDays > 3 ? "day-red" : "day-yellow",
//             approved: "day-green",
//             rejected: "day-orange",
//           };

//           return {
//             id: item.id,
//             status,
//             initials,
//             bg: index % 2 === 0 ? "#e8a020" : "#1a5a50",
//             name,
//             location,
//             lic: item.licenseUrl ? fileName : "LIC-AP-2022-48291",
//             type: "Life Insurance",
//             plan:
//               status === "approved"
//                 ? "Approved"
//                 : status === "rejected"
//                   ? "Rejected"
//                   : "Pending Review",
//             submitted: `Submitted ${days} ago`,
//             days,
//             dayType: dayTypeByStatus[status] || "day-yellow",
//             certificateName: fileName,
//           };
//         });

//         setRows(nextRows);
//       } catch (fetchError) {
//         console.warn("Unable to load advisor approvals", fetchError);
//         setError("Failed to load approvals");
//         setRows([]);
//         setStats({
//           pending: 0,
//           approved: 0,
//           rejected: 0,
//           pendingPercentage: 0,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadApprovals();
//   }, []);

//   // ── Updated filtered logic with activeFilter ──
//   const updateRowStatus = (id, status) => {
//     setRows((prev) =>
//       prev.map((item) => {
//         if (item.id !== id) {
//           return item;
//         }

//         return {
//           ...item,
//           status,
//           plan:
//             status === "approved"
//               ? "Approved"
//               : status === "rejected"
//                 ? "Rejected"
//                 : "Pending Review",
//           dayType:
//             status === "approved"
//               ? "day-green"
//               : status === "rejected"
//                 ? "day-orange"
//                 : item.dayType,
//         };
//       }),
//     );
//   };

//   const updateStatsForStatusChange = (nextStatus) => {
//     setStats((prev) => {
//       const pending = Math.max(0, prev.pending - 1);
//       const approved =
//         nextStatus === "approved" ? prev.approved + 1 : prev.approved;
//       const rejected =
//         nextStatus === "rejected" ? prev.rejected + 1 : prev.rejected;
//       const total = pending + approved + rejected;

//       return {
//         pending,
//         approved,
//         rejected,
//         pendingPercentage: total ? ((pending / total) * 100).toFixed(2) : 0,
//       };
//     });
//   };

//   const filtered = (rows || []).filter((r) => {
//     const matchSearch =
//       r.name.toLowerCase().includes(search.toLowerCase()) ||
//       r.location.toLowerCase().includes(search.toLowerCase()) ||
//       r.type.toLowerCase().includes(search.toLowerCase());

//     const matchFilter = !activeFilter || r.status === activeFilter;

//     return matchSearch && matchFilter;
//   });


//   const approveSubmission = async (id) => {
//     if (!id || isProcessing) return;
//     setIsProcessing(true);

//     try {
//       const response = await fetch("/api/admin/approvals", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "approve", advisorId: id }),
//       });

//       if (!response.ok) {
//         console.error("Approval failed", await response.text());
//         return;
//       }

//       updateRowStatus(id, "approved");
//       updateStatsForStatusChange("approved");
//       if (selectedSubmission?.id === id) {
//         setSelectedSubmission((prev) =>
//           prev
//             ? { ...prev, status: "approved", dayType: "day-green", plan: "Approved" }
//             : null,
//         );
//         setShowModal(false);
//       }
//     } catch (approvalError) {
//       console.error("Approve submission error", approvalError);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const rejectSubmission = async ({ reason, note }) => {
//     if (!selectedSubmission?.id || isProcessing) return;
//     setIsProcessing(true);

//     try {
//       const response = await fetch("/api/admin/approvals", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "reject",
//           advisorId: selectedSubmission.id,
//           reason,
//           note,
//         }),
//       });

//       if (!response.ok) {
//         console.error("Reject failed", await response.text());
//         return;
//       }

//       updateRowStatus(selectedSubmission.id, "rejected");
//       updateStatsForStatusChange("rejected");
//       setOpenReject(false);
//       setSelectedSubmission(null);
//     } catch (rejectError) {
//       console.error("Reject submission error", rejectError);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ── Filter button definitions ──
//   const filterButtons = [
//     {
//       key: "pending",
//       label: "Pending",
//       icon: <IHourglassSm />,
//       activeStyle:  { background: "#fff5e6", borderColor: "#e8a020", color: "#c57a00" },
//       defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
//     },
//     {
//       key: "approved",
//       label: "Approved",
//       icon: (
//         <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a7a5a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//           <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
//         </span>
//       ),
//       activeStyle:  { background: "#e6f5f0", borderColor: "#1a7a5a", color: "#1a7a5a" },
//       defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
//     },
//     {
//       key: "rejected",
//       label: "Rejected",
//       icon: <span style={{ color: "#cc3333", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>✕</span>,
//       activeStyle:  { background: "#fff0f0", borderColor: "#cc3333", color: "#cc3333" },
//       defaultStyle: { background: "#fff",    borderColor: "#e5e7eb", color: "#6b7280" },
//     },
//   ];

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="app-shell">

//         {showSidebar && (
//           <div className="irdai-mobile-overlay" onClick={() => setShowSidebar(false)} />
//         )}

//         <div className={`irdai-sidebar-container${showSidebar ? " open" : ""}`}>
//           <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} onClose={() => setShowSidebar(false)} />
//         </div>

//         <div className="main-area">

//           {/* Topbar */}
//           <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <button className="irdai-hamburger-btn" onClick={() => setShowSidebar(true)} aria-label="Open menu">
//                 <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
//                   <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
//                 </svg>
//               </button>
//               <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>IRDAI Approvals</div>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div style={{ position: "relative" }}>
//                 <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
//                   <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" />
//                 </svg>
//                 <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", position: "absolute", top: -2, right: -2 }} />
//               </div>
//               <Avatar initials="KM" size={32} />
//             </div>
//           </div>

//           <div className="content">

//             {/* Stat cards */}
//             <div className="stat-row">
//               <div className="stat-card" style={{ animationDelay: "0s" }}>
//                 <div className="stat-top">
//                   <div className="stat-icon-wrap" style={{ background: "#fff5e6" }}>
//                     <IHourglass color="#c57a00" />
//                   </div>
//                   <span className="stat-badge-pending">20 Pending</span>
//                 </div>
//                 <div className="stat-number">{stats?.pending}</div>
//                 <div className="stat-label">Pending Review</div>
//               </div>

//               <div className="stat-card" style={{ animationDelay: "0.08s" }}>
//                 <div className="stat-top">
//                   <div className="stat-icon-wrap" style={{ background: "#e6f5f0" }}>
//                     <ICheckCircle color="#1a7a5a" />
//                   </div>
//                   <span className="stat-badge-approved">↑ 18%</span>
//                 </div>
//                 <div className="stat-number">{stats?.approved}</div>
//                 <div className="stat-label">Approved</div>
//               </div>

//               <div className="stat-card" style={{ animationDelay: "0.16s" }}>
//                 <div className="stat-top">
//                   <div className="stat-icon-wrap" style={{ background: "#fff0f0" }}>
//                     <IXCircle color="#cc3333" />
//                   </div>
//                 </div>
//                 <div className="stat-number">{stats?.rejected}</div>
//                 <div className="stat-label">Rejected</div>
//               </div>
//             </div>

//             {/* Submissions panel */}
//             <div className="panel">
//               <div className="panel-header">
//                 <div className="panel-title-row">
//                   <div className="panel-icon"><ISubmission /></div>
//                   <span className="panel-title">IRDAI Submissions</span>
//                 </div>

//                 {/* ── NEW: Pill filter buttons ── */}
//                 <div className="legend">
//                   {filterButtons.map((btn) => {
//                     const isActive = activeFilter === btn.key;
//                     return (
//                       <button
//                         key={btn.key}
//                         onClick={() => setActiveFilter(isActive ? null : btn.key)}
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: 6,
//                           padding: "5px 14px",
//                           borderRadius: "999px",
//                           border: "1.5px solid",
//                           fontSize: 12,
//                           fontWeight: 600,
//                           cursor: "pointer",
//                           transition: "all 0.18s ease",
//                           transform: isActive ? "scale(0.96)" : "scale(1)",
//                           boxShadow: isActive ? "inset 0 2px 6px rgba(0,0,0,0.08)" : "none",
//                           ...(isActive ? btn.activeStyle : btn.defaultStyle),
//                         }}
//                       >
//                         {btn.icon}
//                         {btn.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Search */}
//               <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
//                 <div className="search-wrap">
//                   <input
//                     className="search-input"
//                     placeholder="Search"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                   <div className="search-arrow">→</div>
//                 </div>
//               </div>

//               {/* Submission rows */}
//               <div className="submission-list">
//                 {filtered.length === 0 && (
//                   <div style={{ textAlign: "center", color: "#bbb", padding: "32px 0", fontSize: 13 }}>
//                     No submissions found.
//                   </div>
//                 )}
//                 {filtered.map((r, i) => (
//                   <div className="submission-row" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
//                     <div className="sub-avatar" style={{ background: r.bg }}>{r.initials}</div>
//                     <div className="sub-info">
//                       <div className="sub-name">{r.name} <span style={{ color: "#999", fontWeight: 500 }}>• {r.location}</span></div>
//                       <div className="sub-meta">{r.lic} &bull; {r.type} &bull; {r.plan} &bull; {r.submitted}</div>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-2 shrink-0 max-sm:w-full">
//                       <div className="flex items-center gap-2 w-full sm:w-auto">
//                         <span className={`day-badge ${r.dayType}`}>
//                           <ICalendar />{r.days}
//                         </span>
//                         <button
//                           onClick={() => {
//                             setSelectedSubmission(r);
//                             setShowModal(true);
//                           }}
//                           className="px-3 py-1 text-teal-700 rounded text-xs font-semibold hover:underline"
//                         >
//                           View
//                         </button>
//                       </div>

//                       {r.status === "pending" && (
//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                           <button
//                             className="btn-approve flex-1 sm:flex-none justify-center"
//                             onClick={() => approveSubmission(r.id)}
//                           >
//                             <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white">
//                               <ICheckSm className="w-3 h-3" />
//                             </span>
//                             Approve
//                           </button>
//                           <button
//                             className="btn-reject flex-1 sm:flex-none justify-center"
//                             onClick={() => {
//                               setSelectedSubmission(r);
//                               setOpenReject(true);
//                             }}
//                           >
//                             <IXSm /> Reject
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <IrdaiModal
//           advisor={selectedSubmission}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedSubmission(null);
//           }}
//           onApprove={() => selectedSubmission && approveSubmission(selectedSubmission.id)}
//           onReject={() => {
//             setShowModal(false);
//             setOpenReject(true);
//           }}
//         />
//       )}
//       {openReject && (
//         <RejectModal
//           open={openReject}
//           setOpen={(value) => {
//             if (!value) {
//               setSelectedSubmission(null);
//             }
//             setOpenReject(value);
//           }}
//           onConfirm={rejectSubmission}
//         />
//       )}
//     </>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import IrdaiModal from "@/components/IrdaiModal";
import RejectModal from "@/components/RejectModal";
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

// ── Icon components ──────────────────────────────────────────────
const IHourglass = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12m0 0L7 6.172A2 2 0 016.414 4.758 2 2 0 015 4V2h14v2a2 2 0 01-.586 1.414A2 2 0 0117 6.172L12 12z" />
  </svg>
);
const ICheckCircle = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IXCircle = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const ICalendar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ICheckSm = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IXSm = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IHourglassSm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12M7 22v-4.172a2 2 0 01.586-1.414L12 12" />
  </svg>
);
const ISubmission = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ── Day badge helper ─────────────────────────────────────────────
function DayBadge({ dayType, days }) {
  const colorMap = {
    "day-red":    "bg-red-50 text-red-600",
    "day-orange": "bg-orange-50 text-[#c57a00]",
    "day-yellow": "bg-yellow-50 text-yellow-700",
    "day-green":  "bg-green-50 text-green-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${colorMap[dayType] || colorMap["day-yellow"]}`}>
      <ICalendar />{days}
    </span>
  );
}

// ── Avatar ───────────────────────────────────────────────────────
function Avatar({ initials, size = "md", bgClass = "bg-yellow-600" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-xs";
  return (
    <div className={`${sizeClass} ${bgClass} rounded-full text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, onClose }) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
      window.location.href = "/auth/admin/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm border-l-[3px] ${isActive ? "text-white bg-[#155e5e] border-[#8bc34a]" : "text-[#a3d0d0] bg-transparent border-transparent hover:bg-[#155e5e]"}`}>
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
      <div className="py-4" onClick={handleLogout}>
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

// ── Main page ────────────────────────────────────────────────────
export default function IRDAIApprovals() {
  const [showModal, setShowModal]       = useState(false);
  const [activeNav, setActiveNav]       = useState("IRDAI Approvals");
  const [search, setSearch]             = useState("");
  const [rows, setRows]                 = useState([]);
  const [showSidebar, setShowSidebar]   = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openReject, setOpenReject]     = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, pendingPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/admin/approvals");
        if (!response.ok) throw new Error(`Failed to load approvals: ${response.status}`);

        const payload = await response.json();
        const items = payload?.data || [];
        const nextStats = payload?.stats || { pending: 0, approved: 0, rejected: 0 };
        const total = nextStats.pending + nextStats.approved + nextStats.rejected;

        setStats({
          pending: nextStats.pending || 0,
          approved: nextStats.approved || 0,
          rejected: nextStats.rejected || 0,
          pendingPercentage: total ? ((nextStats.pending / total) * 100).toFixed(2) : 0,
        });

        const nextRows = items.map((item, index) => {
          const name = item.name || "Advisor";
          const location = item.location || "Unknown, IN";
          const status = item.status || "pending";
          const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "AD";
          const submittedAt = item.submittedAt ? new Date(item.submittedAt) : new Date();
          const diffDays = Math.max(1, Math.floor((Date.now() - submittedAt.getTime()) / 86400000));
          const days = `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
          const fileName = item.licenseUrl ? item.licenseUrl.split("/").pop() : "certificate.jpg";
          const dayTypeByStatus = {
            pending: diffDays > 3 ? "day-red" : "day-yellow",
            approved: "day-green",
            rejected: "day-orange",
          };
          return {
            id: item.id, status, initials,
            bgClass: index % 2 === 0 ? "bg-[#e8a020]" : "bg-[#1a5a50]",
            name, location,
            lic: item.licenseUrl ? fileName : "LIC-AP-2022-48291",
            type: "Life Insurance",
            plan: status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending Review",
            submitted: `Submitted ${days} ago`,
            days, dayType: dayTypeByStatus[status] || "day-yellow",
            certificateName: fileName,
          };
        });
        setRows(nextRows);
      } catch (fetchError) {
        console.warn("Unable to load advisor approvals", fetchError);
        setError("Failed to load approvals");
        setRows([]);
        setStats({ pending: 0, approved: 0, rejected: 0, pendingPercentage: 0 });
      } finally {
        setLoading(false);
      }
    };
    loadApprovals();
  }, []);

  const updateRowStatus = (id, status) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id !== id ? item : {
          ...item, status,
          plan: status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Pending Review",
          dayType: status === "approved" ? "day-green" : status === "rejected" ? "day-orange" : item.dayType,
        }
      )
    );
  };

  const updateStatsForStatusChange = (nextStatus) => {
    setStats((prev) => {
      const pending  = Math.max(0, prev.pending - 1);
      const approved = nextStatus === "approved" ? prev.approved + 1 : prev.approved;
      const rejected = nextStatus === "rejected" ? prev.rejected + 1 : prev.rejected;
      const total    = pending + approved + rejected;
      return { pending, approved, rejected, pendingPercentage: total ? ((pending / total) * 100).toFixed(2) : 0 };
    });
  };

  const filtered = (rows || []).filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !activeFilter || r.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const approveSubmission = async (id) => {
    if (!id || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", advisorId: id }),
      });
      if (!response.ok) { console.error("Approval failed", await response.text()); return; }
      updateRowStatus(id, "approved");
      updateStatsForStatusChange("approved");
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) => prev ? { ...prev, status: "approved", dayType: "day-green", plan: "Approved" } : null);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Approve submission error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectSubmission = async ({ reason, note }) => {
    if (!selectedSubmission?.id || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", advisorId: selectedSubmission.id, reason, note }),
      });
      if (!response.ok) { console.error("Reject failed", await response.text()); return; }
      updateRowStatus(selectedSubmission.id, "rejected");
      updateStatsForStatusChange("rejected");
      setOpenReject(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error("Reject submission error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Filter button definitions ────────────────────────────────
  const filterButtons = [
    {
      key: "pending", label: "Pending",
      icon: <IHourglassSm />,
      activeCls:  "bg-[#fff5e6] border-[#e8a020] text-[#c57a00]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
    {
      key: "approved", label: "Approved",
      icon: (
        <span className="w-3.5 h-3.5 rounded-full bg-[#1a7a5a] flex items-center justify-center shrink-0">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
      ),
      activeCls:  "bg-[#e6f5f0] border-[#1a7a5a] text-[#1a7a5a]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
    {
      key: "rejected", label: "Rejected",
      icon: <span className="text-[#cc3333] font-bold text-sm leading-none">✕</span>,
      activeCls:  "bg-[#fff0f0] border-[#cc3333] text-[#cc3333]",
      defaultCls: "bg-white border-gray-200 text-gray-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f2ee] font-sans">

      {/* Mobile overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/45 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 md:relative md:translate-x-0 md:z-auto md:flex md:shrink-0 ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:block`}>
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} onClose={() => setShowSidebar(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden flex items-center justify-center bg-transparent border-none cursor-pointer p-1.5 rounded-md mr-2"
              onClick={() => setShowSidebar(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="text-lg font-bold text-gray-900">IRDAI Approvals</div>
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
        <div className="flex-1 overflow-y-auto p-6 max-md:p-3.5">

          {/* Stat cards */}
          <div className="flex flex-wrap gap-4 mb-5">

            {/* Pending */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#fff5e6] flex items-center justify-center">
                  <IHourglass color="#c57a00" />
                </div>
                <span className="bg-[#fff5e6] text-[#c57a00] text-[10px] font-bold rounded-full px-2.5 py-0.5">20 Pending</span>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">{stats?.pending}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Pending Review</div>
            </div>

            {/* Approved */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#e6f5f0] flex items-center justify-center">
                  <ICheckCircle color="#1a7a5a" />
                </div>
                <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[10px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1">↑ 18%</span>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">{stats?.approved}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Approved</div>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-[#fff0f0] flex items-center justify-center">
                  <IXCircle color="#cc3333" />
                </div>
              </div>
              <div className="text-[28px] font-extrabold text-[#1a3330] leading-tight">{stats?.rejected}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">Rejected</div>
            </div>
          </div>

          {/* Submissions panel */}
          <div className="bg-white rounded-2xl p-[22px_24px] shadow-sm">

            {/* Panel header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-[26px] h-[26px] rounded-lg bg-[#eef4f2] flex items-center justify-center">
                  <ISubmission />
                </div>
                <span className="text-[15px] font-bold text-[#1a3330]">IRDAI Submissions</span>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterButtons.map((btn) => {
                  const isActive = activeFilter === btn.key;
                  return (
                    <button
                      key={btn.key}
                      onClick={() => setActiveFilter(isActive ? null : btn.key)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer ${isActive ? btn.activeCls : btn.defaultCls}`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  );
                })}
              </div>
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
                <div className="text-white text-lg cursor-pointer shrink-0">→</div>
              </div>
            </div>

            {/* Submission rows */}
            <div className="flex flex-col gap-2.5">
              {filtered.length === 0 && (
                <div className="text-center text-gray-300 py-8 text-sm">No submissions found.</div>
              )}
              {filtered.map((r, i) => (
                <div
                  key={i}
                  className="bg-[#f9fbf9] rounded-xl px-[18px] py-3.5 flex items-center gap-3.5 border border-[#eef0ee] flex-wrap hover:bg-white hover:shadow-md"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${r.bgClass} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {r.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#1a3330]">
                      {r.name} <span className="text-gray-400 font-medium">• {r.location}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {r.lic} &bull; {r.type} &bull; {r.plan} &bull; {r.submitted}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 max-sm:w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <DayBadge dayType={r.dayType} days={r.days} />
                      <button
                        onClick={() => { setSelectedSubmission(r); setShowModal(true); }}
                        className="px-3 py-1 text-[#0d3330] text-xs font-semibold underline underline-offset-2 bg-transparent border-none cursor-pointer hover:text-[#1a7a5a]"
                      >
                        View
                      </button>
                    </div>

                    {r.status === "pending" && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-[18px] py-1.5 rounded-full text-xs font-semibold border-[1.5px] border-[#b3e0cc] bg-[#e6f5f0] text-[#1a7a5a] cursor-pointer hover:bg-[#1a7a5a] hover:text-white hover:border-[#1a7a5a]"
                          onClick={() => approveSubmission(r.id)}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#1a7a5a] flex items-center justify-center shrink-0">
                            <ICheckSm />
                          </span>
                          Approve
                        </button>
                        <button
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-[18px] py-1.5 rounded-full text-xs font-semibold border-[1.5px] border-[#ffcccc] bg-[#fff5f5] text-[#cc3333] cursor-pointer hover:bg-[#cc3333] hover:text-white hover:border-[#cc3333]"
                          onClick={() => { setSelectedSubmission(r); setOpenReject(true); }}
                        >
                          <IXSm /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <IrdaiModal
          advisor={selectedSubmission}
          onClose={() => { setShowModal(false); setSelectedSubmission(null); }}
          onApprove={() => selectedSubmission && approveSubmission(selectedSubmission.id)}
          onReject={() => { setShowModal(false); setOpenReject(true); }}
        />
      )}
      {openReject && (
        <RejectModal
          open={openReject}
          setOpen={(value) => { if (!value) setSelectedSubmission(null); setOpenReject(value); }}
          onConfirm={rejectSubmission}
        />
      )}
    </div>
  );
}