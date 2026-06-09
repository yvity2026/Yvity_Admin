
import { useSidebar } from "@/context/SidebarContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { FiChevronLeft } from "react-icons/fi";

const collapseButtonClass = clsx(
  "admin-glass-card hidden md:flex h-10 w-10 items-center justify-center rounded-full text-[#0A4A4A]",
  "fixed top-1/2 z-200 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-110 active:scale-95",
);

export default function CollapseButton({ sidebarWidth }) {
  const { collapsed, toggleCollapse } = useSidebar();

  const SIDEBAR_TRANSITION = {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <motion.button
      type="button"
      onClick={toggleCollapse}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      style={{
        left: `calc((100vw - min(1536px, 100vw)) / 2 + ${sidebarWidth}px)`,
      }}
      transition={SIDEBAR_TRANSITION}
      className={collapseButtonClass}
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