
// "use client";
// import { useState } from "react";
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
//         width: size, height: size, borderRadius: "50%",
//         background: bg, color: "#fff",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
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
//       <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
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
//                       display: "flex", alignItems: "center", gap: 10,
//                       padding: "9px 16px", cursor: "pointer",
//                       color: isActive ? "#fff" : "#a3d0d0",
//                       background: isActive ? COLORS.primaryHover : "transparent",
//                       borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
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

// function Toggle({ enabled, onToggle }) {
//   return (
//     <div
//       onClick={onToggle}
//       style={{
//         width: 44, height: 24, borderRadius: 12, cursor: "pointer",
//         background: enabled ? COLORS.primary : "#d1d5db",
//         position: "relative", transition: "background 0.2s", flexShrink: 0,
//       }}
//     >
//       <div
//         style={{
//           width: 18, height: 18, borderRadius: "50%", background: "#fff",
//           position: "absolute", top: 3,
//           left: enabled ? 23 : 3,
//           transition: "left 0.2s",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
//         }}
//       />
//     </div>
//   );
// }

// export default function SettingsPage() {
//   const [activeNav, setActiveNav] = useState("Settings");
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

//   // Platform toggles
//   const [registrationOpen, setRegistrationOpen] = useState(true);
//   const [customerRegistration, setCustomerRegistration] = useState(true);
//   const [profileViews, setProfileViews] = useState(true);

//   // Admin account form
//   const [adminName, setAdminName] = useState("Krishna Mohan");
//   const [email, setEmail] = useState("admin@yvity.in");
//   const [saved, setSaved] = useState(false);

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f3f4f6" }}>

//       {/* ── MOBILE RESPONSIVE STYLES ── */}
//       <style>{`
//         .set-sidebar-container {
//           position: relative;
//           z-index: 50;
//         }
//         .set-hamburger-btn {
//           display: none;
//         }
//         .set-mobile-overlay {
//           display: none;
//         }
//         @media (max-width: 768px) {
//           .set-sidebar-container {
//             position: fixed !important;
//             top: 0;
//             left: 0;
//             height: 100vh;
//             transform: translateX(-100%);
//             transition: transform 0.25s ease;
//           }
//           .set-sidebar-container.open {
//             transform: translateX(0);
//           }
//           .set-mobile-overlay {
//             display: block;
//             position: fixed;
//             inset: 0;
//             background: rgba(0, 0, 0, 0.45);
//             z-index: 40;
//           }
//           .set-hamburger-btn {
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
//           .set-main-content-padding {
//             padding: 14px !important;
//           }
//           .set-top-grid {
//             grid-template-columns: 1fr !important;
//           }
//         }
//       `}</style>

//       {/* ── MOBILE: Dark overlay — tap to close sidebar ── */}
//       {showSidebar && (
//         <div
//           className="set-mobile-overlay"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* ── MOBILE: Sidebar wrapped in slide-in container ── */}
//       <div className={`set-sidebar-container${showSidebar ? " open" : ""}`}>
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
//               className="set-hamburger-btn"
//               onClick={() => setShowSidebar(true)}
//               aria-label="Open menu"
//             >
//               <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
//                 <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//             </button>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Settings</div>
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
//         <div className="set-main-content-padding" style={{ padding: 24, overflowY: "auto", flex: 1 }}>

//           {/* Top Row — Platform Settings + Admin Account */}
//           <div className="set-top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

//             {/* Platform Settings */}
//             <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Platform Settings</div>

//               {/* Registration Open */}
//               <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
//                 <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   <svg width="18" height="18" fill="none" stroke="#16a34a" viewBox="0 0 24 24" strokeWidth="2">
//                     <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M19 8v6M22 11h-6" />
//                   </svg>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Registration Open</div>
//                   <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Allow new advisors to register</div>
//                 </div>
//                 <Toggle enabled={registrationOpen} onToggle={() => setRegistrationOpen(!registrationOpen)} />
//               </div>

//               {/* Customer Registration */}
//               <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
//                 <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   <svg width="18" height="18" fill="none" stroke="#d97706" viewBox="0 0 24 24" strokeWidth="2">
//                     <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
//                     <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
//                   </svg>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Customer Registration</div>
//                   <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Allow customers to register and leave reviews</div>
//                 </div>
//                 <Toggle enabled={customerRegistration} onToggle={() => setCustomerRegistration(!customerRegistration)} />
//               </div>

//               {/* Profile Views */}
//               <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                 <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   <svg width="18" height="18" fill="none" stroke="#2563eb" viewBox="0 0 24 24" strokeWidth="2">
//                     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                     <circle cx="12" cy="12" r="3" />
//                   </svg>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Profile Views</div>
//                   <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Weekly summary of profile visits</div>
//                 </div>
//                 <Toggle enabled={profileViews} onToggle={() => setProfileViews(!profileViews)} />
//               </div>
//             </div>

//             {/* Admin Account */}
//             <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
//                 <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24" strokeWidth="2">
//                   <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                   <circle cx="9" cy="7" r="4" />
//                   <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//                 </svg>
//                 <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Admin Account</div>
//               </div>

//               {/* Admin Name */}
//               <div style={{ marginBottom: 16 }}>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Admin Name</label>
//                 <input
//                   value={adminName}
//                   onChange={(e) => setAdminName(e.target.value)}
//                   style={{
//                     width: "100%", padding: "10px 14px", borderRadius: 8,
//                     border: "1px solid #e5e7eb", fontSize: 13, color: "#111827",
//                     outline: "none", boxSizing: "border-box",
//                     background: "#fff",
//                   }}
//                   onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.primary; }}
//                   onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
//                 />
//               </div>

//               {/* Email */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
//                 <input
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={{
//                     width: "100%", padding: "10px 14px", borderRadius: 8,
//                     border: "1px solid #e5e7eb", fontSize: 13, color: "#111827",
//                     outline: "none", boxSizing: "border-box",
//                     background: "#fff",
//                   }}
//                   onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.primary; }}
//                   onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
//                 />
//               </div>

//               {/* Save Button */}
//               <button
//                 onClick={handleSave}
//                 style={{
//                   background: saved ? "#16a34a" : COLORS.primary,
//                   color: "#fff", padding: "10px 24px", borderRadius: 8,
//                   fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
//                   transition: "background 0.2s",
//                 }}
//                 onMouseEnter={(e) => { if (!saved) e.currentTarget.style.background = COLORS.primaryHover; }}
//                 onMouseLeave={(e) => { if (!saved) e.currentTarget.style.background = COLORS.primary; }}
//               >
//                 {saved ? "✓ Saved!" : "Save Changes"}
//               </button>
//             </div>
//           </div>

//           {/* Danger Zone */}
//           <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
//               <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24" strokeWidth="2">
//                 <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//                 <line x1="12" y1="9" x2="12" y2="13" />
//                 <line x1="12" y1="17" x2="12.01" y2="17" />
//               </svg>
//               <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626" }}>Danger Zone</div>
//             </div>

//             {/* Deactivate Account */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid #fecaca", marginBottom: 16 }}>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Deactivate Account</div>
//                 <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Temporarily hide your profile from public view</div>
//               </div>
//               <button
//                 style={{
//                   background: "#fff", color: "#dc2626", padding: "6px 16px",
//                   borderRadius: 6, fontSize: 12, fontWeight: 600,
//                   cursor: "pointer", border: "1px solid #fca5a5",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
//               >
//                 Deactivate
//               </button>
//             </div>

//             {/* Delete Account */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Delete Account</div>
//                 <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Permanently delete your profile and all data</div>
//               </div>
//               <button
//                 style={{
//                   background: "#dc2626", color: "#fff", padding: "6px 16px",
//                   borderRadius: 6, fontSize: 12, fontWeight: 600,
//                   cursor: "pointer", border: "none",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#b91c1c"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "#dc2626"; }}
//               >
//                 Delete
//               </button>
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
      label: "Overview",
      href: "/admin",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Advisors",
      href: "/admin/advisors",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
          <path d="M16 11l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  APPROVALS: [
    {
      label: "IRDAI Approvals",
      href: "/admin/irdaiapprovals",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  FINANCE: [
    {
      label: "Payments",
      href: "/admin/payments",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  SYSTEM: [
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
};

function Avatar({ initials, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  };
  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-[#d4a017] text-white flex items-center justify-center font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}


function Toggle({ enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors duration-200 shrink-0
        ${enabled ? "bg-[#0A4A4A]" : "bg-gray-300"}`}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-all duration-200 shadow-sm
          ${enabled ? "left-[23px]" : "left-[3px]"}`}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState("Settings");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showSidebar ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showSidebar]);

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [customerRegistration, setCustomerRegistration] = useState(true);
  const [profileViews, setProfileViews] = useState(true);

  const [adminName, setAdminName] = useState("Krishna Mohan");
  const [email, setEmail] = useState("admin@yvity.in");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <div className="p-6 md:p-6 p-3.5 overflow-y-auto flex-1">

          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Platform Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-[15px] font-bold text-gray-900 mb-5">Platform Settings</div>

              {/* Registration Open */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#16a34a" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-gray-900">Registration Open</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Allow new advisors to register</div>
                </div>
                <Toggle enabled={registrationOpen} onToggle={() => setRegistrationOpen(!registrationOpen)} />
              </div>

              {/* Customer Registration */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#d97706" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-gray-900">Customer Registration</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Allow customers to register and leave reviews</div>
                </div>
                <Toggle enabled={customerRegistration} onToggle={() => setCustomerRegistration(!customerRegistration)} />
              </div>

              {/* Profile Views */}
              <div className="flex items-center gap-3.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#2563eb" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-gray-900">Profile Views</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Weekly summary of profile visits</div>
                </div>
                <Toggle enabled={profileViews} onToggle={() => setProfileViews(!profileViews)} />
              </div>
            </div>

            {/* Admin Account */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                <div className="text-[15px] font-bold text-gray-900">Admin Account</div>
              </div>

              {/* Admin Name */}
              <div className="mb-4">
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Admin Name</label>
                <input
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 outline-none bg-white box-border focus:border-[#0A4A4A] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="text-[12px] font-semibold text-gray-700 block mb-1.5">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 outline-none bg-white box-border focus:border-[#0A4A4A] transition-colors"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-lg text-[13px] font-semibold text-white cursor-pointer border-none transition-colors duration-200
                  ${saved ? "bg-green-600" : "bg-[#0A4A4A] hover:bg-[#155e5e]"}`}
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-[18px]">
              <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div className="text-[15px] font-bold text-red-600">Danger Zone</div>
            </div>

            {/* Deactivate */}
            <div className="flex items-center justify-between pb-4 border-b border-red-200 mb-4">
              <div>
                <div className="text-[13px] font-semibold text-gray-900">Deactivate Account</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Temporarily hide your profile from public view</div>
              </div>
              <button className="bg-white text-red-600 px-4 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer border border-red-300 hover:bg-red-50 transition-colors">
                Deactivate
              </button>
            </div>

            {/* Delete */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-gray-900">Delete Account</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Permanently delete your profile and all data</div>
              </div>
              <button className="bg-red-600 text-white px-4 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer border-none hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
