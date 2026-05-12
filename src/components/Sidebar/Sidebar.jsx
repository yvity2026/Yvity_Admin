// "use client";
// import { easeInOut, motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { AiOutlineUser } from "react-icons/ai";
// import { BiPulse } from "react-icons/bi";
// import {
//   FaBell,
//   FaCrown,
//   FaMedal,
//   FaRegStar,
//   FaRegUser,
//   FaUser,
// } from "react-icons/fa";
// import { FiShield } from "react-icons/fi";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { LuCreditCard, LuUsersRound } from "react-icons/lu";
// import {
//   MdChatBubbleOutline,
//   MdOutlineLogout,
//   MdOutlinePayment,
// } from "react-icons/md";
// import { FaPlus } from "react-icons/fa6";
// import clsx from "clsx";
// import { useAdmin } from "@/context/AuthAdminContext";
// import { useSidebar } from "@/context/SidebarContext";
// import { useModal } from "@/context/ModalContext";
// import CollapseButton from "../layout/CollapseButton";
// import { TbCategoryPlus } from "react-icons/tb";
// import { BsShield } from "react-icons/bs";
// import { SiWechat } from "react-icons/si";
// import { IoSettingsOutline } from "react-icons/io5";

// // function clearBrowserCookies() {
// //   document.cookie.split(";").forEach((cookie) => {
// //     const name = cookie.split("=")[0]?.trim();
// //     if (!name) return;

// //     document.cookie = `${name}=; Max-Age=0; path=/`;
// //     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
// //   });
// // }

// const menuItems = [
//   {
//     title: "Main",
//     navitems: [
//       {
//         id: 1,
//         label: "overview",
//         icon: <TbCategoryPlus />,
//         link: "/admin",
//       },
//       {
//         id: 2,
//         label: "Advisors",
//         icon: <LuUsersRound />,
//         link: "/admin/advisors",
//       },
//       {
//         id: 3,
//         label: "Customers",
//         icon: <FaUser />,
//         link: "/admin/customers",
//       },
//     ],
//   },
//   {
//     title: "Approvals",
//     navitems: [
//       {
//         id: 1,
//         label: "IRDAI Approvals",
//         icon: <BsShield />,
//         link: "/admin/irdaiapprovals",
//       },
//       {
//         id: 2,
//         label: "Testimonials",
//         icon: <SiWechat />,
//         link: "/admin/testimonials",
//       },
//     ],
//   },
//   {
//     title: "Finance",
//     navitems: [
//       {
//         id: 1,
//         label: "Payments",
//         icon: <MdOutlinePayment />,
//         link: "/admin/payments",
//       },
//       {
//         id: 2,
//         label: "Subscription",
//         icon: <LuCreditCard />,
//         link: "/admin/subscriptions",
//       },
//     ],
//   },
//   {
//     title: "Setting",
//     navitems: [
//       {
//         id: 1,
//         label: "Settings",
//         icon: <IoSettingsOutline />,
//         link: "/admin/settings",
//       },
//     ],
//   },
// ];

// export default function AppShell({ children }) {
//   const { collapsed } = useSidebar();
//   const { openModal } = useModal();
//   const { loading, setLoading, setAdmin, admin } = useAdmin();
//   const [logoutLoading, setLogoutLoading] = useState(false);
//   // const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const headerConfig = {
//     "/admin": {
//       title: "Overview",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/advisors": {
//       title: "Adivisors",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/customers": {
//       title: "Customers",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/irdaiapprovals": {
//       title: "IRDAI Approvals",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/testimonials": {
//       title: "Testimonials",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/payments": {
//       title: "Payments",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/subscriptions": {
//       title: "Subscriptions",
//       actions: ["profile", "notifications"],
//     },
//     "/admin/setting": {
//       title: "Settings",
//       actions: ["profile", "notifications"],
//     },
//   };

//   const normalizedPath = pathname.replace(/\/+$/, "");

//   // 1. EXACT MATCH FIRST (MOST IMPORTANT FIX)
//   let currentHeader = headerConfig[normalizedPath];

//   // 2. PREFIX MATCH ONLY IF NOT EXACT
//   if (!currentHeader) {
//     currentHeader = Object.entries(headerConfig)
//       .filter(([key]) => key !== "/admin" && normalizedPath.startsWith(key))
//       .sort((a, b) => b[0].length - a[0].length)[0]?.[1];
//   }

//   // 3. FINAL FALLBACK
//   if (!currentHeader) {
//     currentHeader = {
//       title: "Overview",
//       actions: [],
//     };
//   }

//   // const hideSidebarRoutes = ["/advisor/public-view"];

//   const sidebarWidth = collapsed ? 80 : 260;

//   const name = "Krishna Mohan";
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("");
//   const SIDEBAR_TRANSITION = {
//     duration: 0.35,
//     ease: [0.4, 0, 0.2, 1], // smoother than easeInOut
//   };

//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     text: "",
//     x: 0,
//     y: 0,
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       // Only fetch user data if we're on an advisor page
//       //   if (!pathname.includes("/admin")) {
//       //     setLoading(false);
//       //     return;
//       //   }
//       try {
//         const res = await fetch("/api/auth/me");

//         const data = await res.json();
//         console.log("API response:", data);

//         if (!res.ok || !data.success) {
//           console.error("API Error:", data.error);
//           return;
//         }
//         setAdmin(data.data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [pathname, setLoading, setAdmin]);

//   useEffect(() => {
//     if (mobileOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   console.log(admin);

//   const handleLogout = async () => {
//     if (logoutLoading) return;

//     try {
//       setLogoutLoading(true);
//       const res = await fetch("/api/auth/logout", { method: "POST" });
//       const data = await res.json().catch(() => ({}));
//     //   clearBrowserCookies();
//       setAdmin(null);
//       window.location.href = data.redirect_url || AUTH_FALLBACK_PATH;
//     } catch (error) {
//       console.error("Logout failed:", error);
//     //   clearBrowserCookies();
//       setAdmin(null);
//       window.location.href = AUTH_FALLBACK_PATH;
//     }
//   };

//   const isDefaultActions =
//     currentHeader.actions.includes("notifications") ||
//     currentHeader.actions.includes("profile");

//   //   if (!pathname.includes("/advisor")) {
//   //     return <>{children}</>;
//   //   }
//   const role = admin?.role === "super_admin" ? "SUPER ADMIN" : "ADMIN";
//   return (
//     <div className="min-h-screen flex">
//       {/* SIDEBAR (FULL HEIGHT) */}
//       <motion.aside
//         animate={{ width: collapsed ? 80 : 260 }}
//         transition={SIDEBAR_TRANSITION}
//         className={clsx(
//           "hidden md:flex flex-col relative h-screen sticky top-0 overflow-visible bg-[#0A4A4A]",
//           collapsed ? "w-20" : "w-[260px]",
//         )}
//       >
//         <div className="flex flex-col h-full">
//           {/* Website Logo */}
//           <div
//             className="h-[60px] bg-[#FAFAFA]  flex justify-center items-center cursor-pointer"
//             // onClick={() => router.push(AUTH_DASHBOARD_PATH)}
//           >
//             <Image
//               src="/images/Adivisor/Navbar/navlogo.png"
//               height={100}
//               width={100}
//               alt="Navbar logo"
//               className="h-10 w-auto object-contain"
//               priority
//             />
//           </div>
//           <hr className="mt-5 border-t border-[#107171]" />
//           {/* Profile Details and Logo */}
//           <div
//             className={`
//     mb-2 pt-4
//     flex flex-col items-center
//     ${collapsed ? "gap-2" : "gap-3 pl-6 items-start"}
//   `}
//           >
//             {/* Avatar */}
//             <div
//               className={`
//     relative rounded-full ring-[2px] ring-[#FEC564] bg-[#F59E0B] 
//     flex items-center justify-center overflow-hidden
//     ${collapsed ? "w-10 h-10" : "w-14 h-14"}
//   `}
//             >
//               {admin?.selfie_url ? (
//                 <Image
//                   src={admin.selfie_url}
//                   alt="admin Image"
//                   fill
//                   className="object-cover"
//                 />
//               ) : (
//                 <span className="text-white font-semibold">KM</span>
//               )}
//             </div>

//             {/* Name */}
//             {!collapsed && (
//               <p className="text-[#F8F6F1] font-poppins text-base font-semibold">
//                 {admin?.name}
//               </p>
//             )}

//             {/* Badge */}
//             <div
//               className={`
//       flex items-center justify-center
//       rounded-2xl bg-[rgba(245,158,11,0.2)]
//       ${collapsed ? "p-2 mt-2 text-[#F59E0B]" : "px-4 py-[6px] gap-2 text-[#F59E0B]"}
//     `}
//             >
//               <FaCrown className={collapsed ? "text-base" : "text-sm"} />

//               {!collapsed && (
//                 <p className="text-accent text-xs font-semibold">{role}</p>
//               )}
//             </div>
//           </div>
//           <hr className="mt-5 border-t border-[#107171]" />
//           {/* sidebar content */}

//           <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overflow-x-visible">
//             {menuItems.map((section, i) => (
//               <div key={i} className="mb-5">
//                 {!collapsed && (
//                   <h3 className=" text-sm font-bold leading-2 tracking-[1.4px] px-6 text-left my-4 text-[#53807E] uppercase ">
//                     {section.title}
//                   </h3>
//                 )}
//                 {section.navitems.map((item, j) => {
//                   const isActive =
//                     item.link === "/admin"
//                       ? pathname === "/admin" // ONLY exact match
//                       : pathname.startsWith(item.link);
//                   return (
//                     <motion.div
//                       key={j}
//                       onMouseEnter={() =>
//                         setTooltip((prev) => ({
//                           ...prev,
//                           visible: true,
//                           text: item.label,
//                         }))
//                       }
//                       onMouseLeave={() =>
//                         setTooltip((prev) => ({ ...prev, visible: false }))
//                       }
//                       onMouseMove={(e) =>
//                         setTooltip((prev) => ({
//                           ...prev,
//                           x: e.clientX + 12, // offset from cursor
//                           y: e.clientY + 12,
//                         }))
//                       }
//                       whileHover={{ scale: 1.01 }}
//                       transition={{ duration: 0.15, ease: "easeOut" }}
//                       className={`text-base relative group flex w-full items-center cursor-pointer rounded-lg
//     ${collapsed ? "justify-center py-3" : "gap-4 pl-6 pr-4 py-2"}
//     font-semibold
//     transition-colors duration-300
//     ${isActive ? "bg-[#107171]" : "hover:bg-[#0f6f6f]"}
//   `}
//                     >
//                       <Link
//                         href={item.link || "#"}
//                         className={`flex items-center w-full transition-colors duration-300
//     ${collapsed ? "justify-center" : "gap-4"}
//   `}
//                       >
//                         <motion.span
//                           className={`text-xl md:text-base transition-colors duration-300
//       ${isActive ? "text-white" : "text-[#8BBEBE] group-hover:text-white"}
//     `}
//                         >
//                           {item.icon}
//                         </motion.span>

//                         {!collapsed && (
//                           <span
//                             className={`text-sm whitespace-nowrap font-semibold font-poppins
//         transition-colors duration-300
//         ${isActive ? "text-white" : "text-[#8BBEBE] group-hover:text-white"}
//       `}
//                           >
//                             {item.label}
//                           </span>
//                         )}
//                       </Link>
//                       {/* {collapsed && hoveredItem === item.label && (
//                         <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
//                           {item.label}
//                         </div>
//                       )} */}
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             ))}

//             <motion.div
//               whileHover={{ scale: 1.05, x: 5, color: "#ff4d4f" }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center gap-4 font-semibold pl-6 pr-4 py-3 text-[#8BBEBE] cursor-pointer border-t border-[#107171]"
//             >
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 disabled={logoutLoading}
//                 className="flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-60 disabled:cursor-wait pb-8"
//               >
//                 <span className="">
//                   <MdOutlineLogout />
//                 </span>
//                 {!collapsed && (
//                   <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
//                 )}
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </motion.aside>

//       {/* Collapse Button */}
//       <CollapseButton sidebarWidth={sidebarWidth} />
//       {/* RIGHT SIDE (HEADER + MAIN) */}
//       <div className="flex flex-col flex-1 ">
//         {/* HEADER (TOP RIGHT) */}
//         <header className="py-[18px] px-4 min-h-[60px] sticky top-0 z-10  flex items-center justify-between md:px-[90px] md:py-[10px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
//           <h3 className="text-black font-poppins text-base font-bold leading-normal">
//             {currentHeader.title}
//           </h3>

//           {currentHeader.actions.length > 0 && (
//             <div className="hidden h-10 md:flex gap-4  items-center">
//               {currentHeader.actions.includes("notifications") && (
//                 <motion.button className="relative rounded-full h-10 w-10 bg-[#F8F6F1] flex items-center justify-center cursor-pointer ring-[2px] ring-[#E4E2DB] ">
//                   <FaBell
//                     className="h-5 w-5"
//                     style={{
//                       fill: "#F59E0B",
//                       stroke: "#E4E2DB",
//                       strokeWidth: 1,
//                     }}
//                   />
//                   <span className="absolute top-2 right-3 w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse"></span>
//                 </motion.button>
//               )}

//               {currentHeader.actions.includes("profile") && (
//                 <motion.button className="rounded-full h-10 w-10 bg-[#F59E0B] cursor-pointer ring-[2px] ring-[#FEC564] overflow-hidden relative flex items-center justify-center">
//                   {admin?.selfie_url ? (
//                     <Image
//                       src={admin.selfie_url}
//                       alt="Profile"
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <p className="font-bold text-sm text-white">
//                       {admin?.name?.charAt(0) || "K"}
//                     </p>
//                   )}
//                 </motion.button>
//               )}

//               {!(
//                 currentHeader.actions.includes("notifications") ||
//                 currentHeader.actions.includes("profile")
//               ) && (
//                 <motion.button
//                   onClick={() => {
//                     if (pathname === "/admin/services")
//                       openModal("ADD_SERVICE");
//                     if (pathname === "/admin/professional-journey")
//                       openModal("ADD_ENTRY");
//                     if (pathname === "/admin/achievements")
//                       openModal("ADD_ACHIEVEMENT");
//                     if (pathname === "/admin/testimonials")
//                       openModal("REQUEST_TESTIMONIAL");
//                     if (pathname === "/admin/gallery") openModal("ADD_PHOTO");
//                     if (pathname === "/admin/professional-journey")
//                       openModal("ADD_PROFESSIONAL_JOURNEY");
//                     if (pathname === "/admin/recommendations")
//                       openModal("ADD_RECOMMENDATION");
//                   }}
//                   className="px-4 py-[10px] bg-[#0A4A4A] text-white font-poppins text-[clamp(10px,1vw,14px)] rounded-md flex gap-2 items-center cursor-pointer"
//                 >
//                   <FaPlus />
//                   {currentHeader.actions[0]}
//                 </motion.button>
//               )}
//             </div>
//           )}
//           <button
//             className="md:hidden text-black"
//             onClick={() => {
//               setMobileOpen((prev) => !prev);
//               console.log(mobileOpen);
//             }}
//           >
//             <GiHamburgerMenu size={26} />
//           </button>
//         </header>

//         {mobileOpen && (
//           <>
//             <motion.aside
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ duration: 0.3, ease: easeInOut }}
//               className="fixed top-0 right-0 h-full bg-[#0A4A4A] z-50 md:hidden flex flex-col"
//             >
//               {/*  HEADER WITH LOGO (REPLACES DASHBOARD TEXT) */}
//               <div className="relative flex items-center justify-end">
//                 <button
//                   className="absolute text-black text-xl top-6 right-8 flex justify-end"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* PROFILE */}
//               <div className="px-6 py-4">
//                 <div className=" relative  rounded-full bg-white mb-2 overflow-hidden">
//                   {admin?.selfie_url ? (
//                     <Image
//                       src={admin.selfie_url}
//                       alt="admin Image"
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <span className="text-white font-semibold">
//                       {admin?.name?.charAt(0).toUpperCase() || "A"}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-[#F8F6F1] font-semibold">{admin?.name}</p>

//                 <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(245,158,11,0.2)] text-[#F59E0B] text-xs font-semibold">
//                   <FaCrown className="text-xs" />
//                   Gold Member
//                 </div>
//               </div>

//               <hr className="mt-5 h-[1px] bg-[#107171] border-0" />

//               {/* MENU */}
//               <div className="flex-1 h-screen overflow-y-auto">
//                 {menuItems.map((section, i) => (
//                   <div key={i} className="mb-4">
//                     <h3 className=" text-xs tracking-widest px-6 mt-4 mb-2 text-[#53807E] uppercase">
//                       {section.title}
//                     </h3>

//                     {section.navitems.map((item, j) => {
//                       const isActive =
//                         item.link === "/admin"
//                           ? pathname === "/admin" // ONLY exact match
//                           : pathname.startsWith(item.link);

//                       return (
//                         <Link
//                           key={j}
//                           href={item.link || "#"}
//                           onClick={() => setMobileOpen(false)}
//                           className={` flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200
//                   ${isActive ? "bg-[#107171] text-white" : "text-[#8BBEBE]"}`}
//                         >
//                           <span className="text-lg">{item.icon}</span>
//                           <span>{item.label}</span>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 ))}

//                 {/* LOGOUT */}
//                 <div className="mt-4 border-t border-[#107171]">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setMobileOpen(false);
//                       handleLogout();
//                     }}
//                     disabled={logoutLoading}
//                     className="flex items-center gap-3 px-6 py-3 text-[#8BBEBE] disabled:opacity-60 disabled:cursor-wait"
//                   >
//                     <MdOutlineLogout />
//                     <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
//                   </button>
//                 </div>
//               </div>
//             </motion.aside>

//             {/* OVERLAY */}
//             <div
//               className="fixed inset-0 bg-black/40 z-40 md:hidden"
//               onClick={() => setMobileOpen(false)}
//             />
//           </>
//         )}

//         {/* MAIN CONTENT */}
//         <main className="flex-1 bg-[#F8F6F1]">{children}</main>
//       </div>
//       {tooltip.visible && collapsed && (
//         <div
//           style={{
//             position: "fixed",
//             top: tooltip.y,
//             left: tooltip.x,
//             zIndex: 99999,
//           }}
//           className="pointer-events-none bg-[#0f6f6f] text-white text-xs px-3 py-1.5 font-poppins rounded-md shadow-lg whitespace-nowrap"
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }






"use client";
import { easeInOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell, FaCrown, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuUsersRound } from "react-icons/lu";
import { MdOutlineLogout, MdOutlinePayment } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import clsx from "clsx";
import {
  canAccessSidebarItem,
  getFirstAccessibleAdminRoute,
} from "@/lib/admin/permissions";
import { useAdmin } from "@/context/AuthAdminContext";
import { useSidebar } from "@/context/SidebarContext";
import { useModal } from "@/context/ModalContext";
import CollapseButton from "../layout/CollapseButton";
import { TbCategoryPlus } from "react-icons/tb";
import { BsShield } from "react-icons/bs";
import { SiWechat } from "react-icons/si";
import { IoSettingsOutline } from "react-icons/io5";

// function clearBrowserCookies() {
//   document.cookie.split(";").forEach((cookie) => {
//     const name = cookie.split("=")[0]?.trim();
//     if (!name) return;

//     document.cookie = `${name}=; Max-Age=0; path=/`;
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
//   });
// }

const menuItems = [
  {
    title: "Main",
    navitems: [
      {
        id: 1,
        label: "Overview",
        icon: <TbCategoryPlus />,
        link: "/admin",
        permissionKey: "overview",
      },
      {
        id: 2,
        label: "Subscribers",
        icon: <LuUsersRound />,
        link: "/admin/subscribers",
        permissionKey: "subscribers",
      },
      {
        id: 3,
        label: "Customers",
        icon: <FaUser />,
        link: "/admin/customers",
        permissionKey: "customers",
      },
    ],
  },
  {
    title: "Approvals",
    navitems: [
      {
        id: 1,
        label: "IRDAI Approvals",
        icon: <BsShield />,
        link: "/admin/irdaiapprovals",
        permissionKey: "irdai_approvals",
      },
      {
        id: 2,
        label: "Testimonials",
        icon: <SiWechat />,
        link: "/admin/testimonials",
        permissionKey: "testimonials",
      },
    ],
  },
  {
    title: "Finance",
    navitems: [
      {
        id: 1,
        label: "Payments",
        icon: <MdOutlinePayment />,
        link: "/admin/payments",
        permissionKey: "payments",
      },
    ],
  },
  {
    title: "Administration",
    navitems: [
      {
        id: 1,
        label: "Roles & Permissions",
        icon: <HiOutlineUserGroup />,
        link: "/admin/roles",
        permissionKey: "roles_permissions",
        alternatePermissionKeys: ["create_admin_user"],
      },
    ],
  },
  {
    title: "Setting",
    navitems: [
      {
        id: 1,
        label: "Settings",
        icon: <IoSettingsOutline />,
        link: "/admin/settings",
        permissionKey: "settings",
      },
    ],
  },
];

export default function AppShell({ children }) {
  const { collapsed } = useSidebar();
  const { openModal } = useModal();
  const { setLoading, setAdmin, admin } = useAdmin();
  const [logoutLoading, setLogoutLoading] = useState(false);
  // const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const headerConfig = {
    "/admin": {
      title: "Overview",
      actions: ["profile", "notifications"],
    },
    "/admin/subscribers": {
      title: "Subscribers",
      actions: ["profile", "notifications"],
    },
    "/admin/advisors": {
      title: "Advisors",
      actions: ["profile", "notifications"],
    },
    "/admin/customers": {
      title: "Customers",
      actions: ["profile", "notifications"],
    },
    "/admin/irdaiapprovals": {
      title: "IRDAI Approvals",
      actions: ["profile", "notifications"],
    },
    "/admin/testimonials": {
      title: "Testimonials",
      actions: ["profile", "notifications"],
    },
    "/admin/payments": {
      title: "Payments",
      actions: ["profile", "notifications"],
    },
    "/admin/roles": {
      title: "Roles & Permissions",
      actions: ["profile", "notifications"],
    },
    "/admin/subscriptions": {
      title: "Subscriptions",
      actions: ["profile", "notifications"],
    },
    "/admin/settings": {
      title: "Settings",
      actions: ["profile", "notifications"],
    },
    "/admin/unauthorized": {
      title: "Access Restricted",
      actions: ["profile", "notifications"],
    },
  };

  const normalizedPath = pathname.replace(/\/+$/, "");

  // 1. EXACT MATCH FIRST (MOST IMPORTANT FIX)
  let currentHeader = headerConfig[normalizedPath];

  // 2. PREFIX MATCH ONLY IF NOT EXACT
  if (!currentHeader) {
    currentHeader = Object.entries(headerConfig)
      .filter(([key]) => key !== "/admin" && normalizedPath.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1];
  }

  // 3. FINAL FALLBACK
  if (!currentHeader) {
    currentHeader = {
      title: "Overview",
      actions: [],
    };
  }

  // const hideSidebarRoutes = ["/advisor/public-view"];

  const sidebarWidth = collapsed ? 80 : 260;
  const SIDEBAR_TRANSITION = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1], // smoother than easeInOut
  };

  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch user data if we're on an advisor page
      //   if (!pathname.includes("/admin")) {
      //     setLoading(false);
      //     return;
      //   }
      try {
        const res = await fetch("/api/auth/me");

        const data = await res.json();
        console.log("API response:", data);

        if (!res.ok || !data.success) {
          console.error("API Error:", data.error);
          return;
        }
        setAdmin(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname, setLoading, setAdmin]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const visibleMenuItems = menuItems
    .map((section) => ({
      ...section,
      navitems: section.navitems.filter((item) =>
        canAccessSidebarItem(
          admin,
          item.permissionKey,
          item.alternatePermissionKeys || [],
        ),
      ),
    }))
    .filter((section) => section.navitems.length > 0);

  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      const res = await fetch("/api/auth/admin/logout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setAdmin(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setAdmin(null);
      window.location.href = "/";
    }
  };

//    const handleLogout = async () => {
//   if (logoutLoading) return;

//   try {
//     setLogoutLoading(true);

//     const res = await fetch("/api/auth/logout", {
//       method: "POST",
//     });

//     await res.json().catch(() => ({}));

//     setAdmin(null);

//     window.location.href = "/login";
//   } catch (error) {
//     console.error("Logout failed:", error);

//     setAdmin(null);

//     window.location.href = "/login";
//   }
// };

// const handleLogout = () => {
//   console.log("LOGOUT CLICKED");
//   window.location.href = "/login";
// };

  const role = admin?.role === "super_admin" ? "SUPER ADMIN" : "ADMIN";
  const fallbackRoute = getFirstAccessibleAdminRoute(admin || {});
  const adminProfileImage = admin?.profile_image_url || admin?.selfie_url || "";
  const adminInitials =
    admin?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "KM";
  return (
    <div className="h-screen flex overflow-hidden">
      {/* SIDEBAR (FULL HEIGHT) */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={SIDEBAR_TRANSITION}
        className={clsx(
          "hidden md:flex flex-col relative h-screen sticky top-0 overflow-visible bg-[#0A4A4A]",
          collapsed ? "w-20" : "w-[260px]",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Website Logo */}
          <div
            className="h-[60px] bg-[#FAFAFA]  flex justify-center items-center cursor-pointer"
            // onClick={() => router.push(AUTH_DASHBOARD_PATH)}
          >
            <Image
              src="/images/Adivisor/Navbar/navlogo.png"
              height={100}
              width={100}
              alt="Navbar logo"
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <hr className="mt-5 border-t border-[#107171]" />
          {/* Profile Details and Logo */}
          <div
            className={`
    mb-2 pt-4
    flex flex-col items-center
    ${collapsed ? "gap-2" : "gap-3 pl-6 items-start"}
  `}
          >
            {/* Avatar */}
            <div
              className={`
    relative rounded-full ring-[2px] ring-[#FEC564] bg-[#F59E0B] 
    flex items-center justify-center overflow-hidden
    ${collapsed ? "w-10 h-10" : "w-14 h-14"}
  `}
            >
              {adminProfileImage ? (
                <Image
                  src={adminProfileImage}
                  alt="admin Image"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white font-semibold">{adminInitials}</span>
              )}
            </div>

            {/* Name */}
            {!collapsed && (
              <p className="text-[#F8F6F1] font-poppins text-base font-semibold">
                {admin?.name}
              </p>
            )}

            {/* Badge */}
            <div
              className={`
      flex items-center justify-center
      rounded-2xl bg-[rgba(245,158,11,0.2)]
      ${collapsed ? "p-2 mt-2 text-[#F59E0B]" : "px-4 py-[6px] gap-2 text-[#F59E0B]"}
    `}
            >
              <FaCrown className={collapsed ? "text-base" : "text-sm"} />

              {!collapsed && (
                <p className="text-accent text-xs font-semibold">{role}</p>
              )}
            </div>
          </div>
          <hr className="mt-5 border-t border-[#107171]" />
          {/* sidebar content */}

          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overflow-x-visible">
            {visibleMenuItems.map((section, i) => (
              <div key={i} className="mb-5">
                {!collapsed && (
                  <h3 className=" text-sm font-bold leading-2 tracking-[1.4px] px-6 text-left my-4 text-[#53807E] uppercase ">
                    {section.title}
                  </h3>
                )}
                {section.navitems.map((item, j) => {
                  const isActive =
                    item.link === "/admin"
                      ? pathname === "/admin" // ONLY exact match
                      : pathname.startsWith(item.link);
                  return (
                    <motion.div
                      key={j}
                      onMouseEnter={() =>
                        setTooltip((prev) => ({
                          ...prev,
                          visible: true,
                          text: item.label,
                        }))
                      }
                      onMouseLeave={() =>
                        setTooltip((prev) => ({ ...prev, visible: false }))
                      }
                      onMouseMove={(e) =>
                        setTooltip((prev) => ({
                          ...prev,
                          x: e.clientX + 12, // offset from cursor
                          y: e.clientY + 12,
                        }))
                      }
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={`text-base relative group flex w-full items-center cursor-pointer rounded-lg
    ${collapsed ? "justify-center py-3" : "gap-4 pl-6 pr-4 py-2"}
    font-semibold
    transition-colors duration-300
    ${isActive ? "bg-[#107171]" : "hover:bg-[#0f6f6f]"}
  `}
                    >
                      <Link
                        href={item.link || fallbackRoute}
                        className={`flex items-center w-full transition-colors duration-300
    ${collapsed ? "justify-center" : "gap-4"}
  `}
                      >
                        <motion.span
                          className={`text-xl md:text-base transition-colors duration-300
      ${isActive ? "text-white" : "text-[#8BBEBE] group-hover:text-white"}
    `}
                        >
                          {item.icon}
                        </motion.span>

                        {!collapsed && (
                          <span
                            className={`text-sm whitespace-nowrap font-semibold font-poppins
        transition-colors duration-300
        ${isActive ? "text-white" : "text-[#8BBEBE] group-hover:text-white"}
      `}
                          >
                            {item.label}
                          </span>
                        )}
                      </Link>
                      {/* {collapsed && hoveredItem === item.label && (
                        <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
                          {item.label}
                        </div>
                      )} */}
                    </motion.div>
                  );
                })}
              </div>
            ))}

            <motion.div
              whileHover={{ scale: 1.05, x: 5, color: "#ff4d4f" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 font-semibold pl-6 pr-4 py-3 text-[#8BBEBE] cursor-pointer border-t border-[#107171]"
            >
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-60 disabled:cursor-wait pb-8"
              >
                <span className="">
                  <MdOutlineLogout />
                </span>
                {!collapsed && (
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Collapse Button */}
      <CollapseButton sidebarWidth={sidebarWidth} />
      {/* RIGHT SIDE (HEADER + MAIN) */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* HEADER (TOP RIGHT) */}
        <header className="py-[18px] px-4 min-h-[60px] sticky top-0 left-0 right-0 z-10 flex items-center justify-between md:px-[90px] md:py-[10px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
          <h3 className="text-black font-poppins text-base font-bold leading-normal">
            {currentHeader.title}
          </h3>

          {currentHeader.actions.length > 0 && (
            <div className="hidden h-10 md:flex gap-4  items-center">
              {currentHeader.actions.includes("notifications") && (
                <motion.button className="relative rounded-full h-10 w-10 bg-[#F8F6F1] flex items-center justify-center cursor-pointer ring-[2px] ring-[#E4E2DB] ">
                  <FaBell
                    className="h-5 w-5"
                    style={{
                      fill: "#F59E0B",
                      stroke: "#E4E2DB",
                      strokeWidth: 1,
                    }}
                  />
                  <span className="absolute top-2 right-3 w-1 h-1 bg-[#F59E0B] rounded-full animate-pulse"></span>
                </motion.button>
              )}

              {currentHeader.actions.includes("profile") && (
                <motion.button className="rounded-full h-10 w-10 bg-[#F59E0B] cursor-pointer ring-[2px] ring-[#FEC564] overflow-hidden relative flex items-center justify-center">
                  {adminProfileImage ? (
                    <Image
                      src={adminProfileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <p className="font-bold text-sm text-white">
                      {adminInitials}
                    </p>
                  )}
                </motion.button>
              )}

              {!(
                currentHeader.actions.includes("notifications") ||
                currentHeader.actions.includes("profile")
              ) && (
                <motion.button
                  onClick={() => {
                    if (pathname === "/admin/services")
                      openModal("ADD_SERVICE");
                    if (pathname === "/admin/professional-journey")
                      openModal("ADD_ENTRY");
                    if (pathname === "/admin/achievements")
                      openModal("ADD_ACHIEVEMENT");
                    if (pathname === "/admin/testimonials")
                      openModal("REQUEST_TESTIMONIAL");
                    if (pathname === "/admin/gallery") openModal("ADD_PHOTO");
                    if (pathname === "/admin/professional-journey")
                      openModal("ADD_PROFESSIONAL_JOURNEY");
                    if (pathname === "/admin/recommendations")
                      openModal("ADD_RECOMMENDATION");
                  }}
                  className="px-4 py-[10px] bg-[#0A4A4A] text-white font-poppins text-[clamp(10px,1vw,14px)] rounded-md flex gap-2 items-center cursor-pointer"
                >
                  <FaPlus />
                  {currentHeader.actions[0]}
                </motion.button>
              )}
            </div>
          )}
          <button
            className="md:hidden text-black"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              console.log(mobileOpen);
            }}
          >
            <GiHamburgerMenu size={26} />
          </button>
        </header>

        {mobileOpen && (
          <>
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: easeInOut }}
              className="fixed top-0 right-0 h-full bg-[#0A4A4A] z-50 md:hidden  flex flex-col"
            >
              {/*  HEADER WITH LOGO (REPLACES DASHBOARD TEXT) */}
              <div className="relative flex items-center justify-end">
                <button
                  className="absolute text-black text-xl top-6 right-8 flex justify-end"
                  onClick={() => setMobileOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* PROFILE */}
              <div className="px-6 py-4">
                <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full bg-[#F59E0B] ring-2 ring-[#FEC564]">
                  {adminProfileImage ? (
                    <Image
                      src={adminProfileImage}
                      alt="admin Image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white font-semibold">
                      {adminInitials}
                    </div>
                  )}
                </div>
                <p className="text-[#F8F6F1] font-semibold">{admin?.name}</p>

                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(245,158,11,0.2)] text-[#F59E0B] text-xs font-semibold">
                  <FaCrown className="text-xs" />
                  {role}
                </div>
              </div>

              <hr className="mt-5 h-[1px] bg-[#107171] border-0" />

              {/* MENU */}
              <div className="flex-1 h-screen overflow-y-auto">
                {visibleMenuItems.map((section, i) => (
                  <div key={i} className="mb-4">
                    <h3 className=" text-xs tracking-widest px-6 mt-4 mb-2 text-[#53807E] uppercase">
                      {section.title}
                    </h3>

                    {section.navitems.map((item, j) => {
                      const isActive =
                        item.link === "/admin"
                          ? pathname === "/admin" // ONLY exact match
                          : pathname.startsWith(item.link);

                      return (
                        <Link
                          key={j}
                          href={item.link || "#"}
                          onClick={() => setMobileOpen(false)}
                          className={` flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200
                  ${isActive ? "bg-[#107171] text-white" : "text-[#8BBEBE]"}`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}

                {/* LOGOUT */}
                <div className="mt-4 border-t border-[#107171]">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    disabled={logoutLoading}
                    className="flex items-center gap-3 px-6 py-3 text-[#8BBEBE] disabled:opacity-60 disabled:cursor-wait"
                  >
                    <MdOutlineLogout />
                    <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            </motion.aside>

            {/* OVERLAY */}
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          </>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 overflow-auto bg-[#F8F6F1]">{children}</main>
      </div>
      {tooltip.visible && collapsed && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            zIndex: 99999,
          }}
          className="pointer-events-none bg-[#0f6f6f] text-white text-xs px-3 py-1.5 font-poppins rounded-md shadow-lg whitespace-nowrap"
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
