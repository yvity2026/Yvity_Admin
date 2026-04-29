"use client";
import { Eye, MessageSquare, ThumbsUp, Share } from "lucide-react";
import { FaThumbsUp, FaShareSquare, FaRegEye } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaRocketchat } from "react-icons/fa6";

import toast from "react-hot-toast";

const stats1 = [
  {
    label: "Profile Views",
    value: "1,247",
    growth: "12%",
    icon: FaRegEye,
    type: "percent",
  },
  {
    label: "Testimonials",
    value: "50",
    growth: "3",
    icon: FaRocketchat,
    type: "number",
  },
  {
    label: "Recommendations",
    value: "32",
    growth: "2",
    icon: FaThumbsUp,
    type: "number",
  },
  {
    label: "Profile Shares",
    value: "156",
    growth: "8%",
    icon: FaShareSquare,
    type: "percent",
  },
];

export const IconMap = {
  "Profile Views": FaRegEye,
  "Testimonials":FaRocketchat ,
  "Recommendations": FaThumbsUp,
  "Profile Shares": FaShareSquare,

};

export default function StatsCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        const response = await fetch("/api/advisor/stats", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast.error("some thing went wrong please try again");
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        console.log(data);
        setStats(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-3 lg:gap-6">
      {stats?.map((item, i) => {
        const Icon = IconMap[item.label] || null;
        return (
          <div
            key={i}
            className=" p-6 flex flex-col justify-between h-full rounded-2xl border border-[#E2E1DC] bg-white shadow-[0_0_0_0_rgba(0,0,0,0.20)]"
          >
            <div className="mb-1">
              {Icon && (
                <Icon className="w-5 h-5 text-[#E48C15]" strokeWidth={1.5} />
              )}
            </div>

            <div className="flex items-end gap-3 mb-1">
              <span className="text-[clamp(24px,4vw,32px)] font-bold text-[#111827]">
                {item.value}
              </span>
              <span className="flex items-center gap-1 bg-[#D0FAE4] text-[#065F46] px-2 py-0.5 rounded-2xl text-xs font-semibold mb-1.5">
                ↑ {item.growth}
              </span>
            </div>
            <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
