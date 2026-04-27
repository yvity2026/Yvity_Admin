import { useSidebar } from "@/context/SidebarContext";
import { motion } from "framer-motion";
import { FiChevronLeft } from "react-icons/fi";

export default function CollapseButton({ sidebarWidth }) {
  const { collapsed, toggleCollapse } = useSidebar();

  const SIDEBAR_TRANSITION = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <motion.button
      onClick={toggleCollapse}
      style={{
    left: `calc((100vw - min(1536px, 100vw)) / 2 + ${sidebarWidth}px)`
  }}
      // animate={{ left: sidebarWidth - 20 }}
      // transition={SIDEBAR_TRANSITION}
      className="
        hidden md:flex
        items-center justify-center
        w-10 h-10
        rounded-full
        bg-white
        text-[#0A4A4A]
        fixed top-1/2 -translate-y-1/2 -translate-x-1/2
        z-200
        shadow-lg
        border border-gray-200
        hover:scale-110
        active:scale-95
        transition
        cursor-pointer
      "
    >
      <motion.span
        animate={{ rotate: collapsed ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiChevronLeft className="text-lg" />
      </motion.span>
    </motion.button>
  );
}