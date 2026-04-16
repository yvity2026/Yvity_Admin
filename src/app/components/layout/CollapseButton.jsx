import { useSidebar } from "@/context/SidebarContext";
import { motion } from "framer-motion";

export default function CollapseButton({ sidebarWidth }) {
  const { collapsed, toggleCollapse } = useSidebar();
  const SIDEBAR_TRANSITION = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1], // smoother than easeInOut
};

  return (
    <motion.button
      onClick={toggleCollapse}
      animate={{ x: sidebarWidth - 16 }}
      transition={SIDEBAR_TRANSITION}
      className="
        hidden md:flex
        items-center justify-center
        w-8 h-16
        bg-[#0A4A4A] text-white
        absolute top-1/2 -translate-y-1/2
        z-[1000]
        rounded-r-lg shadow-lg
      "
    >
      {collapsed ? ">" : "<"}
    </motion.button>
  );
}