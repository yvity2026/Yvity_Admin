"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AuthAdminContext";
import { useDashboard } from "@/hooks/TanstankQuery/useDashboard";
import AdminDashboardSkeleton from "./loading";
import RevenueBarChart from "@/components/admin/charts/RevenueBarChart";

const COMPANIES = [
  { letter: "Y", name: "YVITY", count: 145, pct: 35, bg: "#FEF3E2", border: "#FED7AA", letterBg: "#F59E0B", bar: "#F59E0B" },
  { letter: "A", name: "Artisan", count: 89, pct: 21, bg: "#E8F5E9", border: "#A5D6A7", letterBg: "#4CAF50", bar: "#4CAF50" },
  { letter: "T", name: "TechFlow", count: 76, pct: 18, bg: "#E3F2FD", border: "#90CAF9", letterBg: "#2196F3", bar: "#2196F3" },
  { letter: "S", name: "SyncHub", count: 112, pct: 26, bg: "#F3E5F5", border: "#CE93D8", letterBg: "#9C27B0", bar: "#9C27B0" },
];

const ROLE_WISE_COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EC4899", "#6366F1"];

export default function AdminDashboard() {
  const { data: dashdata, isLoading, error } = useDashboard();
  const { admin } = useAdmin();

  const totalRoleWiseCount = (dashdata?.analytics?.roleWise || []).reduce((sum, item) => sum + item.total, 0);
  
  const ADVISORS_DATA = [
    ...(dashdata?.analytics?.roleWise || []).map((item, index) => ({
      label: item.profession,
      count: item.total.toLocaleString(),
      pct: totalRoleWiseCount ? Math.round((item.total / totalRoleWiseCount) * 100) : 0,
      color: ROLE_WISE_COLORS[index % ROLE_WISE_COLORS.length],
    })),
    {
      label: "Total Advisors",
      count: (dashdata?.advisors?.total || 0).toLocaleString(),
      pct: 100,
      color: ROLE_WISE_COLORS[ROLE_WISE_COLORS.length - 1],
    },
  ];

  if (isLoading || !dashdata) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen text-gray-800 bg-[#F8F6F1] font-poppins">
      {/* Main content */}
      <main className="flex-1 flex flex-col bg-[#F8F6F1]">
        {/* Page content */}
        <div className="p-4 space-y-3">
          {/* ── ROW 1: 4 Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Total Advisors",
                val: dashdata?.advisors?.total,
                badge: "↑ 12%",
                badgeC: "text-green-700 bg-green-100",
                iconBg: "#f0fdfa",
                ic: "#0a4a4a",
                icon: "👥",
              },
              {
                label: "Active Subscriptions",
                val: dashdata?.subscriptions?.active || 0,
                badge: "↑ 8%",
                badgeC: "text-blue-700 bg-blue-100",
                iconBg: "#EFF6FF",
                ic: "#0a4a4a",
                icon: "📊",
              },
              {
                label: "Total Revenue",
                val: `₹${(dashdata?.revenue?.total || 0).toLocaleString()}`,
                badge: "↑ 15%",
                badgeC: "text-yellow-700 bg-yellow-100",
                iconBg: "#FEF3E2",
                ic: "#F59E0B",
                icon: "💰",
              },
              {
                label: "Pending Approvals",
                val: dashdata?.approvals?.pending || 0,
                badge: "⏳",
                badgeC: "text-orange-700 bg-orange-100",
                iconBg: "#fff7ed",
                ic: "#ea580c",
                icon: "⏳",
              },
            ].map(({ label, val, badge, badgeC, iconBg, ic, icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                  scale: 1.015,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                }}
                className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[12px] text-gray-500 mb-2 font-medium">{label}</div>
                    <div className="text-2xl font-bold text-gray-900">{val}</div>
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: iconBg }}
                  >
                    <div style={{ color: ic, fontSize: "16px" }}>{icon}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeC}`}>
                  {badge}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ── ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="col-span-2 bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[16px] font-bold flex items-center gap-2 font-cormorant text-[#0a4a4a]">
                  <span className="text-lg">💰</span>
                  <span>Subscription Revenue</span>
                </h2>
              </div>
              <RevenueBarChart />
            </div>

            {/* Gold / Silver Revenue */}
            <div className="col-span-2 flex flex-col gap-3">
              {/* Gold Plan Revenue */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] flex justify-between items-start shadow-sm">
                <div>
                  <div className="text-[18px] font-bold text-[#0a4a4a]">{`₹${(dashdata?.advisors?.gold * 2999 || 0).toLocaleString()}`}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5 font-medium">👑 Gold Plan Revenue</div>
                </div>
                <div className="w-[38px] h-[38px] rounded-xl bg-yellow-50 flex items-center justify-center text-[19px]">🏅</div>
              </div>

              {/* Silver Plan Revenue */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] flex justify-between items-start shadow-sm">
                <div>
                  <div className="text-[18px] font-bold text-[#0a4a4a]">{`₹${(dashdata?.advisors?.silver * 1499 || 0).toLocaleString()}`}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5 font-medium">🥈 Silver Plan Revenue</div>
                </div>
                <div className="w-[38px] h-[38px] rounded-xl bg-slate-50 flex items-center justify-center text-[19px]">🥈</div>
              </div>
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            {/* Company-wise Advisors */}
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
              <h2 className="text-base font-bold mb-4 font-cormorant text-[#0a4a4a]">🏢 Company – wise Advisors</h2>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                  {COMPANIES.map(({ letter, name, count, pct, bg, border: borderColor, letterBg, bar }) => (
                    <div key={name} className={`rounded-xl p-3 flex items-center gap-3 border ${border} bg-${bg}`} style={{ background: bg, borderColor }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: letterBg }}>
                        {letter}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900">{name}</p>
                        <p className="text-[10px] text-gray-600">{count} advisors</p>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-1">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: bar }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service-wise Advisors */}
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
              <h2 className="text-base font-bold mb-4 font-cormorant text-[#0a4a4a]">🛡 Service – wise Advisors</h2>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-gray-500 text-[11px] border-b border-[#E5E7EB]">
                    <th className="text-left py-2 font-semibold">SERVICE</th>
                    <th className="text-left py-2 font-semibold">LIFE</th>
                    <th className="text-left py-2 font-semibold text-[#0a4a4a]">HEALTH</th>
                    <th className="text-left py-2 font-semibold">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dashdata?.analytics?.serviceWise?.map((service) => (
                    <tr key={service.id} className="border-b border-[#E5E7EB]">
                      <td className="py-2 font-medium text-gray-900">{service.name}</td>
                      <td className="py-2 text-gray-700">{service.life}</td>
                      <td className="py-2 text-[#0a4a4a] font-semibold">{service.health}</td>
                      <td className="py-2 font-bold text-gray-900">{service.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── ROW 4: Role-wise Advisors ── */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-base font-bold mb-4 font-cormorant text-[#0a4a4a]">👔 Role – wise Advisors</h2>
            <div className="space-y-3">
              {ADVISORS_DATA.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-600">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: item.color }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 min-w-fit">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
