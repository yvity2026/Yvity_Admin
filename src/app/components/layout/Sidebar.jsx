"use client";
import { easeInOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiPulse } from "react-icons/bi";
import { FaBell, FaCrown, FaRegStar } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrGallery } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCreditCard } from "react-icons/lu";
import { MdChatBubbleOutline, MdOutlineLogout } from "react-icons/md";
import { PiEyeBold } from "react-icons/pi";
import { RiHomeLine, RiTimeLine } from "react-icons/ri";
import { RxPeople } from "react-icons/rx";
import CollapseButton from "./CollapseButton";
import { useSidebar } from "@/context/SidebarContext";
import { FaPlus } from "react-icons/fa6";

import { useModal } from "@/context/ModalContext";

const menuItems = [
  {
    title: "Main",
    navitems: [
      {
        id: 1,
        label: "Dashboard",
        icon: <RiHomeLine />,
        link: "/advisor/dashboard",
      },
      {
        id: 2,
        label: "My Profile",
        icon: <AiOutlineUser />,
        link: "/advisor/profile",
      },
      {
        id: 3,
        label: "Public View",
        icon: <PiEyeBold />,
        link: "/advisor/public-view",
      },
    ],
  },
  {
    title: "Content",
    navitems: [
      {
        id: 1,
        label: "Professional Journey",
        icon: <BiPulse />,
        link: "/advisor/professional-journey",
      },
      {
        id: 2,
        label: "Services",
        icon: <FiShield />,
        link: "/advisor/services",
      },
      {
        id: 3,
        label: "Achievements",
        icon: <FaRegStar />,
        link: "/advisor/achievements",
      },
      {
        id: 4,
        label: "Gallery",
        icon: <GrGallery />,
        link: "/advisor/gallery",
      },
      {
        id: 5,
        label: "Testimonials",
        icon: <MdChatBubbleOutline />,
        link: "/advisor/testimonials",
      },
    ],
  },
  {
    title: "Account",
    navitems: [
      {
        id: 1,
        label: "YVITY Score",
        icon: <RiTimeLine />,
        link: "/advisor/yvity-score",
      },
      {
        id: 2,
        label: "My Subscription",
        icon: <LuCreditCard />,
        link: "/advisor/subscriptions",
      },
      {
        id: 3,
        label: "Recommendations",
        icon: <RxPeople />,
        link: "/advisor/recommendations",
      },
      {
        id: 4,
        label: "Settings",
        icon: <IoSettingsOutline />,
        link: "/advisor/settings",
      },
    ],
  },
];

export default function AppShell({ children }) {
  const { openModal } = useModal();
  // const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const headerConfig = {
    "/advisor/dashboard": {
      title: "Dashboard",
      actions: ["profile", "notifications"],
    },
    "/advisor/profile": {
      title: "My Profile",
      actions: ["profile", "notifications"],
    },
    "/advisor/public-view": {
      title: "Public View",
      actions: [],
    },
    "/advisor/professional-journey": {
      title: "Professional Journey",
      actions: ["Add Entry"],
    },
    "/advisor/services": {
      title: "Services",
      actions: ["Add Services"],
    },
    "/advisor/achievements": {
      title: "Achievements",
      actions: ["Add Achievement"],
    },
    "/advisor/testimonials": {
      title: "Testimonials",
      actions: ["Request Testimonials"],
    },
    "/advisor/gallery": {
      title: "Gallery",
      actions: ["Add Photos"],
    },
    "/advisor/yvity-score": {
      title: "YVITY Score",
      actions: [],
    },
    "/advisor/subscriptions": {
      title: "My Subscriptions",
      actions: [],
    },
    "/advisor/recommendations": {
      title: "Recommendations",
      actions: ["Share Profile"],
    },
    "/advisor/settings": {
      title: "Settings",
      actions: [],
    },
  };

  const currentHeader = headerConfig[pathname] || {
    title: "Dashboard",
    actions: [],
  };

  // const hideSidebarRoutes = ["/advisor/public-view"];
  // if (hideSidebarRoutes.includes(pathname)) {
  //   return <>{children}</>;
  // }
  const { collapsed } = useSidebar();

  const sidebarWidth = collapsed ? 80 : 260;

  const name = "Krishna Mohan";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const SIDEBAR_TRANSITION = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1], // smoother than easeInOut
  };

  const isDefaultActions =
    currentHeader.actions.includes("notifications") ||
    currentHeader.actions.includes("profile");

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR (FULL HEIGHT) */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={SIDEBAR_TRANSITION}
        className={`hidden md:flex flex-col relative
      ${collapsed ? "w-20" : "w-65"}
      h-screen sticky top-0
      overflow-hidden
      bg-[#0A4A4A]
    `}
      >
        <div className="flex flex-col h-full">
          {/* Website Logo */}
          <div className="h-[60px] bg-white  flex justify-center items-center ">
            <Image
              src="/images/Adivisor/Navbar/navlogo.png"
              height={100}
              width={100}
              alt="Navbar logo"
            />
          </div>
          <hr className="mt-5 border-t border-[#107171]" />
          {/* Profile Details and Logo */}
          <div
            className={`
    mb-2 pt-4
    flex flex-col items-center
    ${collapsed ? "gap-2" : "gap-3 pl-10 items-start"}
  `}
          >
            {/* Avatar */}
            <div
              className={`
      rounded-full ring-[2px] ring-[#FEC564] bg-[#F59E0B] flex items-center justify-center
      ${collapsed ? "w-10 h-10" : "w-14 h-14"}
    `}
            >
              {collapsed && (
                <span className="text-black font-semibold text-sm">
                  {initials}
                </span>
              )}
            </div>

            {/* Name */}
            {!collapsed && (
              <p className="text-[#F8F6F1] font-poppins text-base font-semibold">
                Krishna Mohan
              </p>
            )}

            {/* Badge */}
            <div
              className={`
      flex items-center justify-center
      rounded-2xl bg-[rgba(245,158,11,0.2)]
      ${collapsed ? "p-2" : "px-4 py-[6px] gap-2 text-[#F59E0B]"}
    `}
            >
              <FaCrown className={collapsed ? "text-base" : "text-sm"} />

              {!collapsed && (
                <p className="text-accent text-xs font-semibold">Gold Member</p>
              )}
            </div>
          </div>
           <hr className="mt-5 border-t border-[#107171]" />
          {/* sidebar content */}
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth overflow-x-hidden">
            {menuItems.map((section, i) => (
              <div key={i} className="mb-4">
                {!collapsed && (
                  <h3 className="text-sm font-bold leading-2 tracking-[1.4px] px-[40px] text-left my-4 text-[#53807E] uppercase ">
                    {section.title}
                  </h3>
                )}
                {section.navitems.map((item, j) => {
                  const isActive =
                    pathname === item.link ||
                    pathname.startsWith(item.link + "/");
                  return (
                    <motion.div
                      key={j}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`group flex w-full items-center cursor-pointer rounded-lg
    ${collapsed ? "justify-center py-3" : "gap-4 px-10 py-2"}
    font-semibold
    transition-colors duration-300
    ${isActive ? "bg-[#107171]" : "hover:bg-[#0f6f6f]"}
  `}
                    >
                      <Link
                        href={item.link || "#"}
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
                    </motion.div>
                  );
                })}
              </div>
            ))}

            <motion.div
              whileHover={{ scale: 1.05, x: 5, color: "#ff4d4f" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 font-semibold px-10 py-3 text-[#8BBEBE] cursor-pointer border-t border-[#107171]"
            >
              <Link
                href="/login"
                className="flex items-center justify-center space-x-1"
              >
                <span className="">
                  <MdOutlineLogout />
                </span>
                {!collapsed && <span>Logout</span>}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Collapse Button */}
      <CollapseButton sidebarWidth={sidebarWidth} />
      {/* RIGHT SIDE (HEADER + MAIN) */}
      <div className="flex flex-col flex-1 ">
        {/* HEADER (TOP RIGHT) */}
        <header className=" py-[18px] max-h-[60px] sticky top-0 z-10  flex items-center justify-between px-[90px] py-[10px] bg-white shadow-[0_0_4px_0_rgba(0, 0, 0, 0.25)]">
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
                <motion.button className="rounded-full h-10 w-10 bg-[#F59E0B] cursor-pointer ring-[2px] ring-[#FEC564] ">
                  <p className="font-bold text-sm">KM</p>
                </motion.button>
              )}

              {!(
                currentHeader.actions.includes("notifications") ||
                currentHeader.actions.includes("profile")
              ) && (
                <motion.button
                  onClick={() => {
                    if (pathname === "/advisor/services")
                      openModal("ADD_SERVICE");
                    if (pathname === "/advisor/professional-journey")
                      openModal("ADD_ENTRY");
                    if (pathname === "/advisor/achievements")
                      openModal("ADD_ACHIEVEMENT");
                    if (pathname === "/advisor/testimonials")
                      openModal("REQUEST_TESTIMONIAL");
                    if (pathname === "/advisor/gallery") openModal("ADD_PHOTO");
                  }}
                  className="px-4 py-[10px] bg-[#0A4A4A] text-white font-poppins text-[clamp(10px,1vw,14px)] rounded-md flex gap-2 items-center"
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
            <GiHamburgerMenu />
          </button>
        </header>

        {mobileOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: easeInOut }}
              className="fixed top-0 right-0 h-full  bg-[#0A4A4A] z-[9999] md:hidden flex flex-col"
            >
              {/* ✅ HEADER WITH LOGO (REPLACES DASHBOARD TEXT) */}
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
                <div className="w-[50px] h-[50px] rounded-full bg-white mb-2"></div>
                <p className="text-[#F8F6F1] font-semibold">Krishna Mohan</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(245,158,11,0.2)] text-xs">
                  <FaCrown />
                  Gold Member
                </div>
              </div>

              <hr className="mt-5 h-[1px] bg-[#107171] border-0" />

              {/* MENU */}
              <div className="flex-1 overflow-y-auto">
                {menuItems.map((section, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="text-xs tracking-widest px-6 mt-4 mb-2 text-[#53807E] uppercase">
                      {section.title}
                    </h3>

                    {section.navitems.map((item, j) => {
                      const isActive =
                        pathname === item.link ||
                        pathname.startsWith(item.link + "/");

                      return (
                        <Link
                          key={j}
                          href={item.link || "#"}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200
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
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-[#8BBEBE]"
                  >
                    <MdOutlineLogout />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* OVERLAY */}
            <div
              className="fixed inset-0 bg-black/40 z-[9998] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          </>
        )}

        {/* {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-[9998] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )} */}

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-[#F8F6F1]">{children}</main>
      </div>
    </div>
  );
}
