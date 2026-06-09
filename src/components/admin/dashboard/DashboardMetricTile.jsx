"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ACCENTS = {
  teal: {
    ring: "ring-[#0A4A4A]/10",
    bg: "bg-[#E8F4F3]",
    value: "text-[#0A4A4A]",
  },
  gold: {
    ring: "ring-[#F59E0B]/20",
    bg: "bg-[#FFF6E8]",
    value: "text-[#B45309]",
  },
  coral: {
    ring: "ring-[#FCA5A5]/40",
    bg: "bg-[#FFF1F0]",
    value: "text-[#DC2626]",
  },
  slate: {
    ring: "ring-[#CBD5E1]/60",
    bg: "bg-[#F8FAFC]",
    value: "text-[#334155]",
  },
  success: {
    ring: "ring-[#86EFAC]/40",
    bg: "bg-[#E8F5F0]",
    value: "text-[#1A7A5A]",
  },
};

function TileContent({ metric, accent }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        {metric.emoji ? (
          <span className="text-[22px] leading-none" aria-hidden>
            {metric.emoji}
          </span>
        ) : (
          <span className="h-[22px] w-[22px]" />
        )}
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-medium leading-snug text-[#5C7571]">{metric.label}</p>
        <p className={`admin-num mt-1.5 text-[26px] font-bold leading-none ${accent.value}`}>
          {metric.value}
        </p>
        {metric.hint && (
          <p className="mt-2 text-[10px] leading-snug text-[#9AB0AB]">{metric.hint}</p>
        )}
      </div>
    </>
  );
}

export default function DashboardMetricTile({ metric, index = 0 }) {
  const accent = ACCENTS[metric.accent] || ACCENTS.teal;
  const className = `admin-glass-card rounded-[20px] p-4 ring-1 ${accent.ring} transition-shadow hover:shadow-[0_12px_32px_rgba(10,74,74,0.1)]`;

  if (metric.href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <Link href={metric.href} className={`group block ${className}`}>
          <TileContent metric={metric} accent={accent} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={className}
    >
      <TileContent metric={metric} accent={accent} />
    </motion.article>
  );
}
