"use client";

import { motion } from "framer-motion";
import { FiTrendingDown, FiTrendingUp, FiUsers, FiBarChart2, FiDollarSign, FiShield } from "react-icons/fi";

const ICONS = {
  users: FiUsers,
  chart: FiBarChart2,
  revenue: FiDollarSign,
  shield: FiShield,
};

const ACCENTS = {
  teal: {
    iconBg: "bg-[#E8F4F3]",
    icon: "text-[#0A4A4A]",
    ring: "ring-[#0A4A4A]/10",
  },
  gold: {
    iconBg: "bg-[#FFF6E8]",
    icon: "text-[#B45309]",
    ring: "ring-[#F59E0B]/20",
  },
  amber: {
    iconBg: "bg-[#FEF3E2]",
    icon: "text-[#D97706]",
    ring: "ring-[#F59E0B]/15",
  },
  coral: {
    iconBg: "bg-[#FFF1F0]",
    icon: "text-[#DC2626]",
    ring: "ring-[#FCA5A5]/30",
  },
};

export default function DashboardStatCard({ stat, index = 0 }) {
  const Icon = ICONS[stat.icon] || FiUsers;
  const accent = ACCENTS[stat.accent] || ACCENTS.teal;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="admin-glass-card group relative overflow-hidden rounded-[22px] p-5 transition-shadow hover:shadow-[0_14px_40px_rgba(10,74,74,0.12)]"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#F59E0B]/8 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${accent.iconBg} ${accent.ring}`}
        >
          <Icon className={`h-5 w-5 ${accent.icon}`} />
        </div>
        <span
          className={`admin-num inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            stat.changeUp
              ? "bg-[#E8F5F0] text-[#1A7A5A]"
              : "bg-[#FFF6E8] text-[#B45309]"
          }`}
        >
          {stat.changeUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {stat.change}
        </span>
      </div>

      <div className="mt-4">
        <p className="font-poppins text-[12px] font-medium text-[#5C7571]">{stat.label}</p>
        <p className="admin-num mt-1 text-[32px] font-bold leading-none tracking-tight text-[#0A4A4A]">
          {stat.value}
        </p>
        <p className="mt-2 font-poppins text-[11px] text-[#7A928D]">{stat.hint}</p>
      </div>
    </motion.article>
  );
}
