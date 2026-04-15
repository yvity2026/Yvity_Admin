"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiPulse } from "react-icons/bi";
import { FaCrown, FaRegStar } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { GrGallery } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCreditCard } from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { PiEyeBold } from "react-icons/pi";
import { RiHomeLine, RiTimeLine } from "react-icons/ri";
import { RxPeople } from "react-icons/rx";

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
      link: "/advisor/subscription",
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
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const hideSidebarRoutes = ["/advisor/public-view"];
  if (hideSidebarRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR (FULL HEIGHT) */}
      <motion.aside
        className={`
      ${collapsed ? "w-20" : "w-64"}
      h-full sticky top-0
      border-r
      bg-(--primary-900,#0A4A4A)
      transition-all duration-300
    `}
      >
        {/* Website Logo */}
        <div className="h-[60px] bg-white flex justify-center items-center">
          <Image
            src="/images/Adivisor/Navbar/navlogo.png"
            height={100}
            width={100}
            alt="Navbar logo"
          />
        </div>
        {/* Profile Dtails and Logo */}
        <div className="mb-2 flex flex-col pl-10 pt-8 justify-between">
          <div className="w-[142px] h-full">
            <div className="w-[60px] h-[60px] rounded-full bg-white"></div>
            <p className="text-[#F8F6F1] font-poppins text-base font-semibold">
              Krishna Mohan
            </p>
            <button className="flex gap-2 px-4 py-[6px] rounded-2xl bg-[rgba(245,158,11,0.2)]">
              <FaCrown />
              <p className="text-xs"> Gold Member</p>
            </button>
          </div>
        </div>
        <hr className="bg-[#107171] h-px" />
        {/* sidebar content */}
        {menuItems.map((section, i) => (
          <div key={i} className="mb-">
            <h3 className="text-sm font-bold leading-2 tracking-[1.4px] px-[40px] text-left my-4 text-[#53807E] uppercase">
              {section.title}
            </h3>

            {section.navitems.map((item, j) => (
              <div
                key={j}
                className="flex items-center gap-4 font-semibold px-10 py-2 text-[#8BBEBE] cursor-pointer"
              >
                <Link href={item.link || "#"} className="flex items-center justify-center space-x-1">
                  <span className="">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </motion.aside>

      {/* RIGHT SIDE (HEADER + MAIN) */}
      <div className="flex flex-col flex-1 ">
        {/* HEADER (TOP RIGHT) */}
        {/* <header className="h-[60px] flex items-center justify-between border-b px-4">
          
          <h3 className="text-black text-base font-bold">Dashboard</h3>
          <div className="h-10 flex gap-4 py-[10px] items-center">
            <button className="rounded-full h-10 w-10 bg-green-300"></button>
            <button className="rounded-full h-10 w-10 bg-green-300"></button>
          </div>
        </header> */}

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
