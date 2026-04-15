"use client";

import { motion } from "framer-motion";

export default function Toggle({
  isOn,
  setIsOn,
  onColor = "bg-green-500",
  offColor = "bg-gray-300",
}) {
  return (
    <div
      onClick={() => setIsOn(!isOn)}
      className={`w-[60px] h-[32px] flex items-center rounded-full cursor-pointer p-1 ${
        isOn ? onColor : offColor
      }`}
    >
      <motion.div
        layout
        className="w-[24px] h-[24px] bg-white rounded-full shadow-md"
        animate={{ x: isOn ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}