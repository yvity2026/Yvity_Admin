"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ value = 87 }) {
  return (
    <div className="w-full h-[8px] bg-gray-200 rounded-full overflow-hidden mt-3">
      <motion.div
        className="h-full bg-teal-700 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}