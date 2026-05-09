// "use client";
// import { useState, useEffect } from "react";
// import CustomerProfile from "@/components/CustomerProfile";
// import Link from "next/link";

// function Avatar({ initials, size = "md" }) {
//   const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
//   return (
//     <div
//       className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
//     >
//       {initials}
//     </div>
//   );
// }

// const customers = [
//   {
//     initials: "KM",
//     name: "Krishna Mohan",
//     mobile: "+91 9123456789",
//     email: "Krishna@email.com",
//     city: "Hyderabad, TS",
//     profession: "Teacher",
//     reviews: "3 Reviews",
//     lastLogin: "2 hrs ago",
//     joined: "Jan 2026",
//   },
//   {
//     initials: "KM",
//     name: "Krishna Mohan",
//     mobile: "+91 9876543210",
//     email: "Krishna@email.com",
//     city: "Hyderabad, TS",
//     profession: "Software Eng.",
//     reviews: "5 Reviews",
//     lastLogin: "10 min ago",
//     joined: "Jan 2026",
//   },
//   {
//     initials: "KM",
//     name: "Krishna Mohan",
//     mobile: "+91 9876543210",
//     email: "Krishna@email.com",
//     city: "Hyderabad, TS",
//     profession: "Business Owner",
//     reviews: "1 Review",
//     lastLogin: "Yesterday",
//     joined: "Jan 2026",
//   },
//   {
//     initials: "KM",
//     name: "Krishna Mohan",
//     mobile: "+91 9876543210",
//     email: "Krishna@email.com",
//     city: "Hyderabad, TS",
//     profession: "Govt. Employee",
//     reviews: "2 Reviews",
//     lastLogin: "3 days ago",
//     joined: "Jan 2026",
//   },
//   {
//     initials: "KM",
//     name: "Krishna Mohan",
//     mobile: "+91 9876543210",
//     email: "Krishna@email.com",
//     city: "Hyderabad, TS",
//     profession: "Business Owner",
//     reviews: "1 Review",
//     lastLogin: "Yesterday",
//     joined: "Jan 2026",
//   },
// ];

// export default function CustomersDashboard() {
//   const [activeNav, setActiveNav] = useState("Customers");
//   const [search, setSearch] = useState("");
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const limit = 10;

// //Data fetching  : 
// useEffect(() => {
//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `/api/admin/customers?page=${page}&limit=${limit}`
//       );

//       const json = await res.json();

//       setCustomers(json.data || []);
//     } catch (error) {
//       console.error("Failed to fetch customers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCustomers();
// }, [page]);

// // Filtering data  : 
// const filtered = customers.filter((c) =>
//   (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
//   (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
//   (c.location || "").toLowerCase().includes(search.toLowerCase())
// );

//   return (
// <div className="flex min-h-screen font-sans bg-gray-100">
//     {/* Mobile overlay */}
//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black/45 z-40 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Main */}
// <div className="flex-1 flex flex-col min-w-0">
//         {/* Content */}
// <div className="p-6 max-md:p-3.5 flex-1 min-w-0 overflow-y-auto">

//           {/* Stat Cards */}

// <div className="flex flex-col sm:flex-row gap-4 mb-5 max-w-[280px] sm:max-w-full">

//             {/* Total Customers */}
//            <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">


//               <div className="flex items-start justify-between mb-2">
//                 <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
//                   <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#1a7a5a"
//                     strokeWidth="2"
//                   >
//                     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//                   </svg>
//                 </div>
//                 <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[11px] font-bold rounded-full px-2.5 py-0.5">
//                   ↑ 34%
//                 </span>
//               </div>
//               <div className="text-[28px] font-extrabold text-gray-900 leading-tight">
//                {customers.length}
//               </div>
//               <div className="text-xs text-gray-400 mt-0.5 font-medium">
//                 Total Customers
//               </div>
//             </div>

//             {/* Joined Today */}

// <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">

//                           <div className="flex items-start justify-between mb-2">
//                 <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
//                   <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#2255bb"
//                     strokeWidth="2"
//                   >
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                 </div>
//                 <span className="bg-[#e6f0ff] text-[#2255bb] text-[11px] font-bold rounded-full px-2.5 py-0.5">
//                   +48
//                 </span>
//               </div>
//               <div className="text-[28px] font-extrabold text-gray-900 leading-tight">
//                 48
//               </div>
//               <div className="text-xs text-gray-400 mt-0.5 font-medium">
//                 Joined Today
//               </div>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="flex items-center gap-2 mb-1">
//             <svg
//               width="18"
//               height="18"
//               fill="none"
//               stroke="#374151"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
//                 strokeWidth="2"
//               />
//               <circle cx="9" cy="7" r="4" strokeWidth="2" />
//               <path
//                 d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
//                 strokeWidth="2"
//               />
//             </svg>
//             <span className="text-base font-bold text-gray-900">
//               All Customers
//             </span>
//           </div>
//           <div className="text-xs text-gray-400 mb-4">
//             {`${customers.length} registered users`}
//           </div>

//           {/* Search */}
//           <div className="flex gap-3 mb-5 items-center">
//             <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
//               <input
//                 className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <div className="text-white text-lg cursor-pointer shrink-0">
//                 →
//               </div>
//             </div>
//           </div>

//           {/* Table */}

//           <div className="bg-white rounded-xl shadow-sm">
//             {/* Mobile scroll hint */}
//             <div className="md:hidden text-[11px] text-gray-400 text-right px-3 pt-1.5">
//               ← Scroll to see all columns →
//             </div>

//             <div className="overflow-x-auto max-md:overflow-x-scroll" style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x", msOverflowStyle: "auto" }}>
//               <table className="min-w-[900px] w-full border-collapse">
//                 <thead>
//                   <tr>
//                     {[
//                       "Name",
//                       "Mobile",
//                       "Email",
//                       "City",
//                       "Profession",
//                       "Reviews",
//                       "Last Login",
//                       "Joined",
//                       "Actions",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((c, i) => (
//                     <tr
//                       key={i}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-3 py-3 align-middle">
//                         <div className="flex items-center gap-2.5">
//                           <Avatar initials={c.initials} size="sm" />
//                           <span className="font-semibold text-gray-900 text-[13px]">
//                             {c.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {`+91 ${c.phone}`}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.email}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.location}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.profession || "_"}
//                       </td>
//                       <td className="px-3 py-3 align-middle">
//                         <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
//                           {`${c.reviewCount} review`}
//                         </span>
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-500 align-middle">
//                         {c.lastLogin}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-500 align-middle">
//                         {c.joinedAt}
//                       </td>
//                       <td className="px-3 py-3 align-middle">
//                         <button
//                           onClick={() => setShowCustomerModal(true)}
//                           className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
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



// "use client";
// import { useState, useEffect } from "react";
// import CustomerProfile from "@/components/CustomerProfile";
// import Link from "next/link";

// function Avatar({ initials, size = "md" }) {
//   const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
//   return (
//     <div
//       className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
//     >
//       {initials}
//     </div>
//   );
// }

// export default function CustomersDashboard() {
//   const [activeNav, setActiveNav] = useState("Customers");
//   const [search, setSearch] = useState("");
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // Data fetching
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `/api/admin/customers?page=${page}&limit=${limit}`
//         );
//         const json = await res.json();
//         setCustomers(json.data || []);
//       } catch (error) {
//         console.error("Failed to fetch customers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, [page]);

//   useEffect(() => {
//     document.body.style.overflow = showSidebar ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [showSidebar]);

//   // Filtering data
//   const filtered = customers.filter(
//     (c) =>
//       (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.location || "").toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex min-h-screen font-sans bg-gray-100">
//       {/* Mobile overlay */}
//       {showSidebar && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/45 z-40 md:hidden"
//             onClick={() => setShowSidebar(false)}
//           />
//           <aside className="fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-xl border-l border-gray-200 md:hidden">
//             <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
//               <h2 className="text-sm font-semibold text-gray-900">Menu</h2>
//               <button
//                 type="button"
//                 onClick={() => setShowSidebar(false)}
//                 className="text-gray-600 hover:text-gray-900"
//                 aria-label="Close menu"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="px-4 py-4 overflow-y-auto h-[calc(100%-56px)] space-y-2">
//               <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Overview</Link>
//               <Link href="/admin/advisors" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Advisors</Link>
//               <Link href="/admin/customers" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100">Customers</Link>
//               <Link href="/admin/irdaiapprovals" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">IRDAI Approvals</Link>
//               <Link href="/admin/testimonials" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Testimonials</Link>
//               <Link href="/admin/payments" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Payments</Link>
//               <Link href="/admin/subscriptions" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Subscriptions</Link>
//               <Link href="/admin/settings" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">Settings</Link>
//             </div>
//           </aside>
//         </>
//       )}

//       <button
//         type="button"
//         onClick={() => setShowSidebar(true)}
//         className="fixed top-4 right-4 z-50 md:hidden bg-white border border-gray-200 shadow-sm rounded-full p-2"
//         aria-label="Open menu"
//       >
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
//           <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
//         </svg>
//       </button>

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* ─── SECTION 1: Stat Cards ─────────────────────────────────────────────
//             This div is self-contained on mobile — no horizontal scroll,
//             cards wrap naturally on small screens.                              */}
//         <div className="p-6 max-md:p-3.5 pb-0 max-md:pb-0">
//           <div className="flex flex-col sm:flex-row gap-4 mb-5 max-w-[280px] sm:max-w-full">

//             {/* Total Customers */}
//             <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
//               <div className="flex items-start justify-between mb-2">
//                 <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
//                   <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#1a7a5a"
//                     strokeWidth="2"
//                   >
//                     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//                   </svg>
//                 </div>
//                 <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[11px] font-bold rounded-full px-2.5 py-0.5">
//                   ↑ 34%
//                 </span>
//               </div>
//               <div className="text-[28px] font-extrabold text-gray-900 leading-tight">
//                 {customers.length}
//               </div>
//               <div className="text-xs text-gray-400 mt-0.5 font-medium">
//                 Total Customers
//               </div>
//             </div>

//             {/* Joined Today */}
//             <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
//               <div className="flex items-start justify-between mb-2">
//                 <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center">
//                   <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#2255bb"
//                     strokeWidth="2"
//                   >
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                 </div>
//                 <span className="bg-[#e6f0ff] text-[#2255bb] text-[11px] font-bold rounded-full px-2.5 py-0.5">
//                   +48
//                 </span>
//               </div>
//               <div className="text-[28px] font-extrabold text-gray-900 leading-tight">
//                 48
//               </div>
//               <div className="text-xs text-gray-400 mt-0.5 font-medium">
//                 Joined Today
//               </div>
//             </div>

//           </div>
//         </div>
//         {/* ─── END SECTION 1 ────────────────────────────────────────────────── */}


//         {/* ─── SECTION 2: Table area (header + search + scrollable table) ───────
//             Padding on the sides is kept, but the inner table overflows
//             horizontally on mobile via overflow-x-auto on the table wrapper.   */}
//         <div className="px-6 max-md:px-3.5 pb-6 max-md:pb-3.5 flex-1 min-w-0">

//           {/* Header */}
//           <div className="flex items-center gap-2 mb-1">
//             <svg
//               width="18"
//               height="18"
//               fill="none"
//               stroke="#374151"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
//                 strokeWidth="2"
//               />
//               <circle cx="9" cy="7" r="4" strokeWidth="2" />
//               <path
//                 d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
//                 strokeWidth="2"
//               />
//             </svg>
//             <span className="text-base font-bold text-gray-900">
//               All Customers
//             </span>
//           </div>
//           <div className="text-xs text-gray-400 mb-4">
//             {`${customers.length} registered users`}
//           </div>

//           {/* Search */}
//           <div className="flex gap-3 mb-5 items-center">
//             <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
//               <input
//                 className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
//                 placeholder="Search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <div className="text-white text-lg cursor-pointer shrink-0">
//                 →
//               </div>
//             </div>
//           </div>

//           {/* Table — scrolls horizontally on mobile, fixed on desktop */}
//           <div className="bg-white rounded-xl shadow-sm">
//             {/* Mobile scroll hint */}
//             <div className="md:hidden text-[11px] text-gray-400 text-right px-3 pt-1.5">
//               ← Scroll to see all columns →
//             </div>

//             <div
//               className="overflow-x-auto w-full max-w-full"
//               style={{
//                 WebkitOverflowScrolling: "touch",
//                 touchAction: "pan-x pan-y",
//                 msOverflowStyle: "auto",
//               }}
//             >
//               <table className="min-w-[900px] w-full border-collapse">
//                 <thead>
//                   <tr>
//                     {[
//                       "Name",
//                       "Mobile",
//                       "Email",
//                       "City",
//                       "Profession",
//                       "Reviews",
//                       "Last Login",
//                       "Joined",
//                       "Actions",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((c, i) => (
//                     <tr
//                       key={i}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="px-3 py-3 align-middle">
//                         <div className="flex items-center gap-2.5">
//                           <Avatar
//                             initials={
//                               c.name
//                                 ? c.name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")
//                                     .slice(0, 2)
//                                     .toUpperCase()
//                                 : "??"
//                             }
//                             size="sm"
//                           />
//                           <span className="font-semibold text-gray-900 text-[13px]">
//                             {c.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {`+91 ${c.phone}`}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.email}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.location}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-700 align-middle">
//                         {c.profession || "_"}
//                       </td>
//                       <td className="px-3 py-3 align-middle">
//                         <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
//                           {`${c.reviewCount} review`}
//                         </span>
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-500 align-middle">
//                         {c.lastLogin}
//                       </td>
//                       <td className="px-3 py-3 text-xs text-gray-500 align-middle">
//                         {c.joinedAt}
//                       </td>
//                       <td className="px-3 py-3 align-middle">
//                         <button
//                           onClick={() => setShowCustomerModal(true)}
//                           className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
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
//         {/* ─── END SECTION 2 ────────────────────────────────────────────────── */}

//       </div>

//       {showCustomerModal && (
//         <CustomerProfile onClose={() => setShowCustomerModal(false)} />
//       )}
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import CustomerProfile from "@/components/CustomerProfile";

// function Avatar({ initials, size = "md" }) {
//   const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
//   return (
//     <div
//       className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
//     >
//       {initials}
//     </div>
//   );
// }

// export default function CustomersDashboard() {
//   const [search, setSearch] = useState("");
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // Data fetching
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/admin/customers?page=${page}&limit=${limit}`);
//         const json = await res.json();
//         setCustomers(json.data || []);
//       } catch (error) {
//         console.error("Failed to fetch customers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCustomers();
//   }, [page]);

//   // Filtering data
//   const filtered = customers.filter(
//     (c) =>
//       (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
//       (c.location || "").toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen font-sans bg-gray-100 overflow-hidden">

//       {/* ═══════════════════════════════════════════════════════════════════
//           SECTION 1 — STAT CARDS
//           sticky so they don't scroll away on mobile.
//           The layout's own navbar/sidebar handles all navigation.
//       ═══════════════════════════════════════════════════════════════════ */}
//       <div className="sticky top-0 z-10 bg-gray-100 px-6 max-md:px-3.5 pt-6 max-md:pt-3.5 pb-3 shrink-0">
//         <div className="flex flex-row gap-3 sm:gap-4 max-w-full">

//           {/* Total Customers */}
//           <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-0">
//             <div className="flex items-start justify-between mb-2">
//               <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center shrink-0">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2">
//                   <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                   <circle cx="9" cy="7" r="4" />
//                   <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//                 </svg>
//               </div>
//               <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[11px] font-bold rounded-full px-2.5 py-0.5 shrink-0">
//                 ↑ 34%
//               </span>
//             </div>
//             <div className="text-[28px] max-md:text-2xl font-extrabold text-gray-900 leading-tight">
//               {customers.length}
//             </div>
//             <div className="text-xs text-gray-400 mt-0.5 font-medium">
//               Total Customers
//             </div>
//           </div>

//           {/* Joined Today */}
//           <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-0">
//             <div className="flex items-start justify-between mb-2">
//               <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center shrink-0">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2255bb" strokeWidth="2">
//                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                   <line x1="16" y1="2" x2="16" y2="6" />
//                   <line x1="8" y1="2" x2="8" y2="6" />
//                   <line x1="3" y1="10" x2="21" y2="10" />
//                 </svg>
//               </div>
//               <span className="bg-[#e6f0ff] text-[#2255bb] text-[11px] font-bold rounded-full px-2.5 py-0.5 shrink-0">
//                 +48
//               </span>
//             </div>
//             <div className="text-[28px] max-md:text-2xl font-extrabold text-gray-900 leading-tight">
//               48
//             </div>
//             <div className="text-xs text-gray-400 mt-0.5 font-medium">
//               Joined Today
//             </div>
//           </div>

//         </div>
//       </div>
//       {/* ═══════════════════════════════════════════════════════════════════
//           END SECTION 1
//       ═══════════════════════════════════════════════════════════════════ */}


//       {/* ═══════════════════════════════════════════════════════════════════
//           SECTION 2 — TABLE AREA
//           flex-1 fills remaining height. overflow-hidden prevents this
//           container from growing wider than the viewport, which is what
//           allows the inner overflow-x-auto to actually scroll.
//       ═══════════════════════════════════════════════════════════════════ */}
//       <div className="flex-1 overflow-hidden px-6 max-md:px-3.5 pb-6 max-md:pb-3.5">

//         {/* Sub-header */}
//         <div className="flex items-center gap-2 mb-1 mt-1">
//           <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">
//             <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" />
//             <circle cx="9" cy="7" r="4" strokeWidth="2" />
//             <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" />
//           </svg>
//           <span className="text-base font-bold text-gray-900">All Customers</span>
//         </div>
//         <div className="text-xs text-gray-400 mb-4">
//           {`${customers.length} registered users`}
//         </div>

//         {/* Search */}
//         <div className="mb-5">
//           <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 h-12">
//             <input
//               className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <span className="text-white text-lg cursor-pointer shrink-0">→</span>
//           </div>
//         </div>

//         {/* Table card */}
//         <div className="bg-white rounded-xl shadow-sm">

//           {/* Mobile swipe hint */}
//           <div className="md:hidden text-[10px] text-gray-400 text-center px-3 py-1.5 border-b border-gray-100">
//             ← swipe left / right to see all columns →
//           </div>

//           {/* overflow-x-auto is the ONLY horizontal scroll zone */}
//           <div
//             className="overflow-x-auto w-full"
//             style={{ WebkitOverflowScrolling: "touch" }}
//           >
//             <table className="min-w-[860px] w-full border-collapse">
//               <thead>
//                 <tr>
//                   {["Name","Mobile","Email","City","Profession","Reviews","Last Login","Joined","Actions"].map((h) => (
//                     <th
//                       key={h}
//                       className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((c, i) => (
//                   <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="px-3 py-3 align-middle">
//                       <div className="flex items-center gap-2.5">
//                         <Avatar
//                           initials={
//                             c.name
//                               ? c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
//                               : "??"
//                           }
//                           size="sm"
//                         />
//                         <span className="font-semibold text-gray-900 text-[13px] whitespace-nowrap">
//                           {c.name}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{`+91 ${c.phone}`}</td>
//                     <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.email}</td>
//                     <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.location}</td>
//                     <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.profession || "—"}</td>
//                     <td className="px-3 py-3 align-middle">
//                       <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
//                         {`${c.reviewCount} review`}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{c.lastLogin}</td>
//                     <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{c.joinedAt}</td>
//                     <td className="px-3 py-3 align-middle">
//                       <button
//                         onClick={() => setShowCustomerModal(true)}
//                         className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//       {/* ═══════════════════════════════════════════════════════════════════
//           END SECTION 2
//       ═══════════════════════════════════════════════════════════════════ */}

//       {showCustomerModal && (
//         <CustomerProfile onClose={() => setShowCustomerModal(false)} />
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import CustomerProfile from "@/components/CustomerProfile";

function Avatar({ initials, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function CustomersDashboard() {
  const [search, setSearch] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data fetching
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/customers?page=${page}&limit=${limit}`);
        const json = await res.json();
        setCustomers(json.data || []);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [page]);

  // Filtering data
  const filtered = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — STAT CARDS
          sticky so they don't scroll away on mobile.
          The layout's own navbar/sidebar handles all navigation.
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-10 bg-gray-100 px-6 max-md:px-3.5 pt-6 max-md:pt-3.5 pb-3 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 max-w-[280px] sm:max-w-full">

          {/* Total Customers */}
          <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a7a5a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <span className="bg-[#e6f5f0] text-[#1a7a5a] text-[11px] font-bold rounded-full px-2.5 py-0.5 shrink-0">
                ↑ 34%
              </span>
            </div>
            <div className="text-[28px] max-md:text-2xl font-extrabold text-gray-900 leading-tight">
              {customers.length}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-medium">
              Total Customers
            </div>
          </div>

          {/* Joined Today */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2255bb" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="bg-[#e6f0ff] text-[#2255bb] text-[11px] font-bold rounded-full px-2.5 py-0.5 shrink-0">
                +48
              </span>
            </div>
            <div className="text-[28px] max-md:text-2xl font-extrabold text-gray-900 leading-tight">
              48
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-medium">
              Joined Today
            </div>
          </div>

        </div>
      </div>
      {/* ═══════════════════════════════════════════════════════════════════
          END SECTION 1
      ═══════════════════════════════════════════════════════════════════ */}


      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — TABLE AREA
          flex-1 fills remaining height. overflow-hidden prevents this
          container from growing wider than the viewport, which is what
          allows the inner overflow-x-auto to actually scroll.
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden px-6 max-md:px-3.5 pb-6 max-md:pb-3.5">

        {/* Sub-header */}
        <div className="flex items-center gap-2 mb-1 mt-1">
          <svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" />
            <circle cx="9" cy="7" r="4" strokeWidth="2" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="2" />
          </svg>
          <span className="text-base font-bold text-gray-900">All Customers</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">
          {`${customers.length} registered users`}
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 h-12">
            <input
              className="border-none bg-transparent outline-none text-sm text-white flex-1 min-w-0 placeholder-white/70"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-white text-lg cursor-pointer shrink-0">→</span>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm">

          {/* Mobile swipe hint */}
          <div className="md:hidden text-[10px] text-gray-400 text-center px-3 py-1.5 border-b border-gray-100">
            ← swipe left / right to see all columns →
          </div>

          {/* overflow-x-auto is the ONLY horizontal scroll zone */}
          <div
            className="overflow-x-auto w-full"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="min-w-[860px] w-full border-collapse">
              <thead>
                <tr>
                  {["Name","Mobile","Email","City","Profession","Reviews","Last Login","Joined","Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
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
                        <Avatar
                          initials={
                            c.name
                              ? c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                              : "??"
                          }
                          size="sm"
                        />
                        <span className="font-semibold text-gray-900 text-[13px] whitespace-nowrap">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{`+91 ${c.phone}`}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.email}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.location}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.profession || "—"}</td>
                    <td className="px-3 py-3 align-middle">
                      <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                        {`${c.reviewCount} review`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{c.lastLogin}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{c.joinedAt}</td>
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
      {/* ═══════════════════════════════════════════════════════════════════
          END SECTION 2
      ═══════════════════════════════════════════════════════════════════ */}

      {showCustomerModal && (
        <CustomerProfile onClose={() => setShowCustomerModal(false)} />
      )}
    </div>
  );
}