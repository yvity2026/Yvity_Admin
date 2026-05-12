"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaMoneyBillWave, FaUsers, FaUserTie } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { useDashboard } from "@/hooks/TanstankQuery/useDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
// import { FaUsers } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Filler,
);

import { Bar } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────
const CITY_COLORS = [
  "#0f766e",
  "#eab308",
  "#2563eb",
  "#f97316",
  "#10b981",
  "#60a5fa",
  "#8b5cf6",
  "#ef4444",
];

const normalizeCompany = (name) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim();

const ROLES = [
  { label: "Senior Advisor", count: "194", pct: 55, color: "#1A6CA2" },
  { label: "Junior Advisor", count: "194", pct: 60, color: "#3B6E10" },
  { label: "Team Leader", count: "194", pct: 65, color: "#844D0A" },
  { label: "Branch Manager", count: "194", pct: 56, color: "#534AB7" },
  { label: "Trailing Advisor", count: "194", pct: 30, color: "#E8971A" },
  { label: "LIC of India", count: "194", pct: 60, color: "#888888" },
  { label: "LIC of India", count: "194", pct: 65, color: "#96C458" },
  { label: "Total Advisor", count: "1,284", pct: 100, color: "#dc2626" },
];

const BAR_MONTHS = [
  { m: "Oct", val: "₹4.2L", h: 42 },
  { m: "Nov", val: "₹4.3L", h: 58 },
  { m: "Dec", val: "₹4.2L", h: 42 },
  { m: "Jan", val: "₹4.3L", h: 58 },
  { m: "Feb", val: "₹4.1L", h: 38 },
  { m: "Mar", val: "₹4.5L", h: 90, gold: true },
];


function AnimatedDonut({ pct, color, label, count, delay = 0 }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        scale: 1.04,
      }}
      className="
        flex flex-col items-center justify-center
        rounded-2xl border border-gray-100
        bg-white p-3 relative overflow-hidden
        transition-all duration-300
        hover:shadow-xl hover:shadow-gray-200/60
        group
      "
    >
      {/* subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />

      {/* Donut */}
      <div className="relative w-20 h-20">
        <svg className="-rotate-90 w-full h-full" viewBox="0 0 60 60">
          {/* background */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="#edf0f2"
            strokeWidth="6"
          />

          {/* animated progress */}
          <motion.circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{
              duration: 1.4,
              delay: delay + 0.2,
              ease: "easeInOut",
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${color}30)`,
            }}
          />
        </svg>

        {/* percentage */}
        <div
          className="absolute inset-0 flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ color }}
        >
          {pct}%
        </div>
      </div>

      {/* count */}
      <div className="mt-3 text-lg font-bold text-gray-900">{count}</div>

      {/* label */}
      <div className="text-[11px] font-medium text-gray-400 text-center leading-tight mt-0.5">
        {label}
      </div>
    </motion.div>
  );
}

// ── Mini Donut ────────────────────────────────────────────────────
function MiniDonut({ pct, color, label, count }) {
  const r = 14,
    circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      {label !== "Total Advisor" && (
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r={r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{ color }}
          >
            {pct}%
          </div>
        </div>
      )}

      <div
        className={`font-poppins text-gray-900 ${
          label === "Total Advisor"
            ? "text-xl font-semibold"
            : "text-sm font-medium"
        }`}
      >
        {count}
      </div>

      <div className="text-[10px] font-medium text-gray-400 text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────
// function BarChart() {
//   const [hoveredIdx, setHoveredIdx] = useState(null);
//   const W = 450,
//     H = 130,
//     bottomPad = 25,
//     labelPad = 18,
//     barW = 28;
//   const count = BAR_MONTHS.length;
//   const spaceBetween = (W - barW * count) / (count - 1);
//   const maxVal = Math.max(...BAR_MONTHS.map((b) => b.h));

//   return (
//     <svg
//       viewBox={`0 0 ${W} ${H + bottomPad + labelPad}`}
//       className="w-full"
//       style={{ height: 180 }}
//     >
//       <line
//         x1="0"
//         y1={H + labelPad}
//         x2={W}
//         y2={H + labelPad}
//         stroke="#e5e7eb"
//         strokeWidth="2"
//       />
//       {BAR_MONTHS.map(({ m, val, h, gold }, i) => {
//         const x = i * (barW + spaceBetween);
//         const barH = (h / maxVal) * (H - 10);
//         const y = H + labelPad - barH;
//         const cx = x + barW / 2;
//         const isHovered = hoveredIdx === i;
//         const scale = isHovered ? 1.15 : 1;
//         return (
//           <g
//             key={m}
//             style={{ cursor: "pointer" }}
//             onMouseEnter={() => setHoveredIdx(i)}
//             onMouseLeave={() => setHoveredIdx(null)}
//           >
//             <rect
//               x={x - 6}
//               y={0}
//               width={barW + 12}
//               height={H + bottomPad + labelPad}
//               fill="transparent"
//             />
//             <text
//               x={cx}
//               y={isHovered ? y - 6 : y - 4}
//               textAnchor="middle"
//               fontSize={isHovered ? "12" : "12"}
//               fontWeight={isHovered ? "700" : "600"}
//               fill={isHovered ? (gold ? "#C9A227" : "#1a5c5a") : "#374151"}
//               style={{ transition: "all 0.2s ease" }}
//             >
//               {val}
//             </text>
//             <rect
//               x={cx - (barW * scale) / 2}
//               y={isHovered ? y - barH * 0.12 : y}
//               width={barW * scale}
//               height={barH * (isHovered ? 1.12 : 1)}
//               rx="6"
//               fill={gold ? "#F59E0B" : "#1a5c5a"}
//               style={{
//                 transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
//                 filter: isHovered
//                   ? `drop-shadow(0 4px 8px ${gold ? "#EBC88D" : "#F59E0B"})`
//                   : "none",
//               }}
//             />
//             <text
//               x={cx}
//               y={H + labelPad + 18}
//               textAnchor="middle"
//               fontSize="12"
//               fill={isHovered ? "#374151" : "#9ca3af"}
//               fontWeight={isHovered ? "600" : "400"}
//               style={{ transition: "all 0.2s ease" }}
//             >
//               {m}
//             </text>
//           </g>
//         );
//       })}
//     </svg>
//   );
// }

function RevenueBarChart() {
  const data = useMemo(() => {
    return {
      labels: BAR_MONTHS.map((item) => item.m),

      datasets: [
        {
          data: BAR_MONTHS.map((item) => item.h),

          backgroundColor: BAR_MONTHS.map((item) =>
            item.gold ? "#F59E0B" : "#0f766e",
          ),

          hoverBackgroundColor: BAR_MONTHS.map((item) =>
            item.gold ? "#d97706" : "#115e59",
          ),

          borderRadius: 10,
          borderSkipped: false,
          barThickness: 28,
          hoverBorderRadius: 12,
        },
      ],
    };
  }, []);

  const options = useMemo(() => {
    return {
      responsive: true,

      maintainAspectRatio: false,

      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#111827",
          padding: 12,
          displayColors: false,

          callbacks: {
            title: (items) => items[0].label,

            label: (context) => {
              return BAR_MONTHS[context.dataIndex].val;
            },
          },
        },
      },

      interaction: {
        mode: "index",
        intersect: false,
      },

      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: "#9ca3af",
            font: {
              size: 12,
              weight: 500,
            },
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            display: false,
            drawBorder: false,
          },

          border: {
            display: false,
          },

          ticks: {
            display: false,
          },
        },
      },

      hover: {
        mode: "nearest",
        intersect: true,
      },
    };
  }, []);

  return (
    <div className="w-full h-[180px]">
      <Bar data={data} options={options} />
    </div>
  );
}

// ── Plan Split Donut ──────────────────────────────────────────────
const PLAN_DATA = [
  {
    label: "Gold",
    value: 412,
    color: "#F59E0B",
  },

  {
    label: "Silver",
    value: 210,
    color: "#0f766e",
  },

  {
    label: "Free",
    value: 662,
    color: "#E8F4F4",
  },
];

function PlanDonut() {
  const total = PLAN_DATA.reduce((sum, item) => sum + item.value, 0);

  const data = useMemo(() => {
    return {
      labels: PLAN_DATA.map((item) => item.label),

      datasets: [
        {
          data: PLAN_DATA.map((item) => item.value),

          backgroundColor: PLAN_DATA.map((item) => item.color),

          hoverBackgroundColor: PLAN_DATA.map((item) => item.color),

          borderWidth: 0,

          hoverOffset: 6,

          cutout: "72%",
        },
      ],
    };
  }, []);

  const options = useMemo(() => {
    return {
      responsive: true,

      maintainAspectRatio: false,

      animation: {
        animateRotate: true,
        duration: 1200,
        easing: "easeOutQuart",
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#111827",

          padding: 12,

          callbacks: {
            label: (context) => {
              const value = context.raw;

              const pct = Math.round((value / total) * 100);

              return `${context.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    };
  }, [total]);

  return (
    <div className="flex items-center gap-5">
      {/* Donut */}
      <div className="relative w-[97px] h-[97px] flex-shrink-0">
        <Doughnut data={data} options={options} />

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[15px] font-bold text-gray-900">
            {total.toLocaleString()}
          </div>

          <div className="text-[10px] text-gray-400 mt-[-2px]">total</div>
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-2 w-full">
        {PLAN_DATA.map((item) => {
          const pct = Math.round((item.value / total) * 100);

          return (
            <div
              key={item.label}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                  style={{
                    background: item.color,
                  }}
                />

                <span className="text-sm text-gray-700 font-medium">
                  {item.label}
                </span>
              </div>

              <span className="text-[12px] text-gray-600 font-medium">
                {item.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// function PlanDonut() {
//   const [hovered, setHovered] = useState(false);
//   const r = 15.9,
//     circ = 2 * Math.PI * r;
//   const segments = [
//     { pct: 25, color: "#F59E0B", offset: 0 },
//     { pct: 50, color: "#E8F4F4", offset: -33 },
//     { pct: 25, color: "#0A4A4A", offset: -50 },
//   ];
//   const [animPcts, setAnimPcts] = useState(segments.map(() => 0));
//   const rafRef = useRef(null);
//   const startRef = useRef(null);

//   useEffect(() => {
//     const duration = 1000;
//     startRef.current = null;
//     const animate = (ts) => {
//       if (!startRef.current) startRef.current = ts;
//       const elapsed = ts - startRef.current;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setAnimPcts(segments.map((s) => s.pct * eased));
//       if (progress < 1) rafRef.current = requestAnimationFrame(animate);
//     };
//     rafRef.current = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, []);

//   const handleHover = (isHover) => {
//     setHovered(isHover);
//     cancelAnimationFrame(rafRef.current);
//     const duration = 400;
//     startRef.current = null;
//     const currentPcts = [...animPcts];
//     const targetPcts = isHover
//       ? segments.map((s) => s.pct * 1.05)
//       : segments.map((s) => s.pct);
//     const animate = (ts) => {
//       if (!startRef.current) startRef.current = ts;
//       const elapsed = ts - startRef.current;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setAnimPcts(
//         targetPcts.map((t, i) => currentPcts[i] + (t - currentPcts[i]) * eased),
//       );
//       if (progress < 1) rafRef.current = requestAnimationFrame(animate);
//     };
//     rafRef.current = requestAnimationFrame(animate);
//   };

//   let cumOffset = 0;
//   const animSegments = segments.map((s, i) => {
//     const dash = (animPcts[i] / 100) * circ;
//     const offsetVal = (-cumOffset / 100) * circ;
//     cumOffset += animPcts[i];
//     return { ...s, dash, offsetVal };
//   });

//   return (
//     <div className="flex items-center gap-5">
//       {/* Circle */}
//       <div className="flex items-center justify-center w-[97px] h-[97px] relative flex-shrink-0">
//         <svg viewBox="0 0 36 36" className="w-full h-full">
//           {segments.map(({ color, pct }, i) => {
//             const dash = (pct / 100) * circ;
//             const offset =
//               i === 0
//                 ? 0
//                 : i === 1
//                   ? -(segments[0].pct / 100) * circ
//                   : -((segments[0].pct + segments[1].pct) / 100) * circ;
//             return (
//               <circle
//                 key={i}
//                 cx="18"
//                 cy="18"
//                 r={r}
//                 fill="transparent"
//                 stroke={color}
//                 strokeWidth="4"
//                 strokeDasharray={`${dash} ${circ}`}
//                 strokeDashoffset={offset}
//                 transform="rotate(-90 18 18)"
//               />
//             );
//           })}
//           <text
//             x="18"
//             y="17"
//             textAnchor="middle"
//             fontSize="6.5"
//             fontWeight="700"
//           >
//             1,284
//           </text>
//           <text
//             x="18"
//             y="21.5"
//             textAnchor="middle"
//             fontSize="3.8"
//             fill="#9ca3af"
//           >
//             total
//           </text>
//         </svg>
//       </div>

//       {/* Labels */}
//       <div className="space-y-2 w-full">
//         {[
//           { dot: "#f59e0b", label: "Gold", val: "412 (32%)" },
//           { dot: "#0f766e", label: "Silver", val: "210 (16%)" },
//           { dot: "#e5e7eb", label: "Free", val: "662 (52%)" },
//         ].map(({ dot, label, val }) => (
//           <div key={label} className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-2">
//               <span
//                 className="w-2.5 h-2.5 rounded-full"
//                 style={{ background: dot }}
//               />
//               <span className="text-sm text-gray-700">{label}</span>
//             </div>
//             <span className="text-[12px] text-#374151 font-normal">{val}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// ── Line Chart ────────────────────────────────────────────────────
// function LineChart() {
//   const W = 400;
//   const H = 130;
//   const paddingLeft = 38;
//   const paddingBottom = 20;
//   const paddingTop = 10;
//   const chartW = W - paddingLeft;
//   const chartH = H - paddingBottom - paddingTop;
//   const yMin = 400;
//   const yMax = 1500;
//   const yLabels = [1400, 1200, 1000, 800, 400];
//   const rawData = [500, 700, 850, 900, 1050, 1400];
//   const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
//   const count = rawData.length;
//   const toX = (i) => paddingLeft + (i / (count - 1)) * chartW;
//   const toY = (val) =>
//     paddingTop + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
//   const pts = rawData.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

//   return (
//     <svg
//       viewBox={`0 0 ${W} ${H + 4}`}
//       className="w-full"
//       style={{ height: 180 }}
//     >
//       {yLabels.map((val) => (
//         <line
//           key={val}
//           x1={paddingLeft}
//           y1={toY(val)}
//           x2={W}
//           y2={toY(val)}
//           stroke="#e5e7eb"
//           strokeWidth="1"
//         />
//       ))}
//       <line
//         x1={paddingLeft}
//         y1={toY(yMin)}
//         x2={W}
//         y2={toY(yMin)}
//         stroke="#e5e7eb"
//         strokeWidth="1"
//       />
//       {yLabels.map((val) => (
//         <text
//           key={val}
//           x={paddingLeft - 4}
//           y={toY(val) + 4}
//           textAnchor="end"
//           fontSize="10"
//           fill="#9ca3af"
//         >
//           {val}
//         </text>
//       ))}
//       <polyline
//         points={pts}
//         fill="none"
//         stroke="#0f766e"
//         strokeWidth="2.5"
//         strokeLinejoin="round"
//         strokeLinecap="round"
//       />
//       {rawData.map((val, i) => (
//         <circle
//           key={i}
//           cx={toX(i)}
//           cy={toY(val)}
//           r="3.5"
//           fill={i === rawData.length - 1 ? "#C9A227" : "#eef1f1"}
//         />
//       ))}
//       {months.map((m, i) => (
//         <text
//           key={m}
//           x={toX(i)}
//           y={H + 2}
//           textAnchor="middle"
//           fontSize="11"
//           fill="#9ca3af"
//         >
//           {m}
//         </text>
//       ))}
//     </svg>
//   );
// }
function GrowthChart() {
  const data = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        data: [500, 700, 850, 900, 1050, 1400],
        borderColor: "#0f766e",
        backgroundColor: "rgba(15,118,110,0.12)",
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        border: {
          display: false,
        },

        grid: {
          color: "#eef2f7",
        },
      },
    },
  };

  return (
    <div className="h-[180px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}

// ── City Row ──────────────────────────────────────────────────────
function CityRow({ name, count, pct, color }) {
  const [hovered, setHovered] = useState(false);
  const [animPct, setAnimPct] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 800;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(pct * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = animPct;
    const to = hovered ? Math.min(pct * 1.08, 100) : pct;
    const duration = 300;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <div
      className="flex items-center gap-2 cursor-default px-1.5 py-[3px] rounded-lg transition-all duration-200"
      style={{
        background: hovered ? `${color}11` : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="text-[12px] flex-shrink-0 w-[76px] transition-all duration-200"
        style={{
          color: hovered ? color : "#374151",
          fontWeight: hovered ? 600 : 400,
        }}
      >
        {name}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${animPct}%`,
            background: color,
            boxShadow: hovered ? `0 0 6px ${color}88` : "none",
          }}
        />
      </div>
      <span
        className="text-[12px] font-semibold w-8 text-right transition-colors duration-200"
        style={{ color: hovered ? color : "#374151" }}
      >
        {count}
      </span>
    </div>
  );
}

// ── Company Card ──────────────────────────────────────────────────
function CompanyCard({ letter, name, count, pct, bg, border, letterBg, bar }) {
  const [hovered, setHovered] = useState(false);
  const [animPct, setAnimPct] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const duration = 800;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(pct * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = animPct;
    const to = hovered ? Math.min(pct * 1.1, 100) : pct;
    const duration = 300;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimPct(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <div
      className="rounded-xl p-3 cursor-default transition-[transform,box-shadow] duration-[250ms]"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        transform: hovered
          ? "translateY(-3px) scale(1.03)"
          : "translateY(0) scale(1)",
        boxShadow: hovered ? `0 8px 24px ${bar}33` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
          style={{ background: letterBg }}
        >
          {letter}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-gray-900 leading-tight">
            {count}
          </div>
          <div className="text-[12px] text-gray-400">{name}</div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${animPct}%`,
                background: bar,
                boxShadow: hovered ? `0 0 6px ${bar}88` : "none",
              }}
            />
          </div>
          <div
            className="text-[10px] mt-0.5 font-semibold"
            style={{ color: bar }}
          >
            {pct}% of max
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
  //  const [dashdata, setDashData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const { data: dashdata, isLoading, error } = useDashboard();
  const [selected, setSelected] = useState("Last 6 Months");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSidebar]);

  // useEffect(() => {
  //   async function load() {
  //     try {
  //       const res = await fetch("/api/admin/overview");
  //       const json = await res.json();
  //       setDashData(json);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   load();
  // }, []);

  const totalCityCount = dashdata?.analytics?.cities?.reduce(
    (sum, c) => sum + c.total,
    0,
  );

  const CITIES = (dashdata?.analytics?.cities || []).map((c, i) => ({
    name: c.city,
    count: c.total,
    pct: totalCityCount ? Math.round((c.total / totalCityCount) * 100) : 0,
    color: CITY_COLORS[i % CITY_COLORS.length],
  }));

  //companies :
  const groupedCompanies = {};

  (dashdata?.analytics?.companies || []).forEach((c) => {
    const key = normalizeCompany(c.company);

    if (!groupedCompanies[key]) {
      groupedCompanies[key] = {
        name: c.company.trim(),
        count: 0,
      };
    }

    groupedCompanies[key].count += c.total;
  });

  const companyList = Object.values(groupedCompanies);

  const maxCompany = Math.max(...companyList.map((c) => c.count));

  const COMPANY_COLORS = [
    "#195FA5",
    "#3B6E10",
    "#824E0E",
    "#993C1D",
    "#0f766e",
  ];

  const COMPANIES = companyList.map((c, i) => ({
    letter: c.name?.[0]?.toUpperCase() || "X",
    name: c.name,
    count: c.count,
    pct: Math.round((c.count / maxCompany) * 100),
    bg: "#f9fafb",
    border: "#e5e7eb",
    letterBg: COMPANY_COLORS[i % COMPANY_COLORS.length],
    bar: COMPANY_COLORS[i % COMPANY_COLORS.length],
  }));

  //Filters :
  const filters = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
    "Last 6 Months",
    "Last 1 Year",
  ];

  // Services :
  const SERVICE_COLORS = {
    "Life Insurance": "#0f766e",
    "Health Insurance": "#2563eb",
    "General Insurance": "#f97316",
    Other: "#9ca3af",
  };

  const SERVICES = (dashdata?.analytics?.services || []).map((s) => ({
    name: s.service_type,
    total: s.total,
    color: SERVICE_COLORS[s.service_type] || "#6b7280",
  }));

  if (isLoading || !dashdata) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen text-gray-800 bg-[#EEF2F0]">
      {/* Mobile overlay */}
      {/* {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )} */}

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-[#EEF2F0]">
        {/* Page content */}
        <div className="p-4 space-y-3">
          {/* ── ROW 1: 4 Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {" "}
            {[
              {
                label: "Total Advisors",
                val: dashdata?.advisors?.total,
                badge: "↑ 12%",
                badgeC: "text-green-700 bg-green-100",
                iconBg: "#f0fdfa",
                ic: "#0f766e",
                icon: "👥",
              },
              {
                label: "Total Customers",
                val: dashdata?.users?.total,
                badge: "↑ 34%",
                badgeC: "text-green-700 bg-green-100",
                iconBg: "#eff6ff",
                ic: "#2563eb",
                icon: <FaUsers />,
              },
              {
                label: "Total Revenue",
                val: dashdata?.totalAdvisors || "500",
                badge: "↑ 18%",
                badgeC: "text-green-700 bg-green-100",
                iconBg: "#f0fdf4",
                ic: "#16a34a",
                icon: "💰",
              },
              {
                label: "Pending IRDAI Approvals",
                val: dashdata?.advisors?.under_review,
                badge: `${dashdata?.advisors?.under_review} Pending`,
                badgeC: "text-orange-600 bg-orange-100",
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
                className="        bg-white rounded-xl p-3 border border-gray-100        shadow-sm flex flex-col justify-between cursor-default        hover:shadow-xl hover:shadow-gray-200/60        transition-all duration-300        relative overflow-hidden      "
              >
                {" "}
                {/* subtle glow */}{" "}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at top right, rgba(255,255,255,0.9), transparent 45%)",
                  }}
                />{" "}
                <div className="flex items-start justify-between mb-2 relative z-10">
                  {" "}
                  <motion.div
                    whileHover={{ rotate: 4, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: iconBg }}
                  >
                    {" "}
                    <div style={{ color: ic, fontSize: "16px" }}>
                      {icon}
                    </div>{" "}
                  </motion.div>{" "}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeC}`}
                  >
                    {" "}
                    {badge}{" "}
                  </span>{" "}
                </div>{" "}
                <motion.div
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-gray-900 leading-tight relative z-10"
                >
                  {" "}
                  {val}{" "}
                </motion.div>{" "}
                <div className="text-[12px] text-gray-400 mt-0.5 relative z-10">
                  {" "}
                  {label}{" "}
                </div>{" "}
              </motion.div>
            ))}
          </div>

          {/* ── ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[16px] font-bold flex items-center gap-1.5">
                  <span className="text-yellow-500">💰</span>
                  <span className="font-bold text-[16px]">
                    Subscription Revenue
                  </span>
                </h2>
                <div className="relative w-full sm:w-auto">
                  {/* Trigger */}
                  <button
                    onClick={() => setOpen(!open)}
                    className="
          w-full sm:w-auto
          min-w-[140px]
          flex items-center justify-between gap-2
          bg-gray-50 hover:bg-gray-100
          border border-gray-200
          rounded-lg
          px-3 py-2
          text-[12px] sm:text-[13px]
          font-medium text-[#0A4A4A]
          transition-all duration-200
        "
                  >
                    <span className="truncate">{selected}</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`
          absolute right-0 mt-2 z-50
          w-full sm:w-52
          bg-white border border-gray-100
          rounded-xl shadow-xl overflow-hidden
          transition-all duration-200 origin-top
          ${
            open
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }
        `}
                  >
                    {filters.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelected(item);
                          setOpen(false);
                        }}
                        className={`
              w-full text-left px-4 py-3
              text-[12px] sm:text-[13px]
              transition-colors duration-150
              hover:bg-gray-50
              ${
                selected === item
                  ? "bg-emerald-50 text-[#0A4A4A] font-semibold"
                  : "text-gray-600"
              }
            `}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div
                  className="
      bg-emerald-50 border border-emerald-200 rounded-lg
      px-2 py-2 text-center relative overflow-hidden
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-100
      group
    "
                >
                  {/* subtle shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />

                  <div className="text-[20px] font-bold text-black-700 transition-transform duration-300 group-hover:scale-[1.03]">
                    {`${dashdata?.advisors?.gold * 2999}`}
                  </div>

                  <div className="text-[12px] text-gray-500 transition-colors duration-300">
                    👑 Gold
                  </div>

                  <div className="text-[#0A4A4A] text-center font-poppins text-[12px] font-semibold leading-4 transition-all duration-300">
                    {`${dashdata?.advisors?.gold} advisors`}
                  </div>
                </div>

                <div
                  className="
      bg-emerald-50 border border-emerald-200 rounded-lg
      px-2 py-2 text-center relative overflow-hidden
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-md hover:shadow-slate-100
      group
    "
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />

                  <div className="text-[20px] font-bold text-black-500 transition-transform duration-300 group-hover:scale-[1.03]">
                    {`${dashdata?.advisors?.silver * 1999}`}
                  </div>

                  <div className="text-[12px] text-gray-500">🥇 Silver</div>

                  <div className="text-[#0A4A4A] text-center text-[12px] font-semibold leading-4 mt-0.5">
                    {`${dashdata?.advisors?.silver} advisors`}
                  </div>
                </div>

                <div
                  className="
      bg-emerald-50 border border-emerald-200 rounded-lg
      px-2 py-2 text-center relative overflow-hidden
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-md hover:shadow-orange-100
      group
    "
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />

                  <div className="text-[20px] font-bold text-black-600 transition-transform duration-300 group-hover:scale-[1.03]">
                    ₹0
                  </div>

                  <div className="text-[12px] text-gray-500">🆓 Free</div>

                  <div className="text-[#0A4A4A] text-center text-[12px] font-semibold leading-4 mt-0.5">
                    {`${dashdata?.advisors?.free} advisors`}
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 mb-1">
                Monthly Revenue Trend
              </p>
              <div className=" mt-10 md:mt-35">
                <RevenueBarChart />
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-3">
              <div
                className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col"
                style={{
                  padding: "26px 31px 26px 30px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div className="flex justify-between items-start mb-1 w-full">
                  <div>
                    <h2 className="text-base font-bold leading-4 text-gray-900 flex items-center gap-1.5">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="2"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                      Platform Growth
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium">
                      Total advisors registered · Last 6 months
                    </p>
                  </div>
                  <span className=" text-[#0A4A4A] text-[14px] font-bold px-2.5 py-0.5 rounded">
                    1,284
                  </span>
                </div>
                <GrowthChart />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-1">
                <div className="mb-3">
                  <h2 className="text-base font-bold mb-1">🧩 Plan Split</h2>
                  <p className="text-[12px] text-gray-400">
                    Advisor Subscription tier
                  </p>
                </div>
                <PlanDonut />
              </div>
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold mb-3">
                📌 City – wise Advisors
              </h2>
              <div className="space-y-2.5 max-h-[234px] overflow-y-auto no-scrollbar">
                {CITIES.map(({ name, count, pct, color }) => (
                  <CityRow
                    key={name}
                    name={name}
                    count={count}
                    pct={pct}
                    color={color}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm ">
              <h2 className="text-base font-bold mb-3">
                🛡 Service – wise Advisors
              </h2>
              <table className="w-full text-[12px] max-h-[234px] overflow-y-auto no-scollbar">
                <thead>
                  <tr className="text-gray-400 text-[11px] border-b border-gray-100">
                    <th className="text-left py-1.5 font-semibold">SERVICE</th>
                    <th className="text-left py-1.5 font-semibold">LIFE</th>
                    <th className="text-left py-1.5 font-semibold text-blue-500">
                      HEALTH
                    </th>
                    <th className="text-left py-1.5 font-semibold">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICES.map(({ name, life, health, total, hBlue }) => (
                    <tr
                      key={name}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-2 text-gray-700">{name}</td>
                      <td
                        className={`py-2 font-semibold ${life === "—" ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {life}
                      </td>
                      <td
                        className={`py-2 font-semibold ${hBlue ? "text-blue-500" : "text-gray-300"}`}
                      >
                        {health}
                      </td>
                      <td className="py-2 font-semibold text-gray-700">
                        {total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── ROW 4 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold mb-3">
                🏢 Company – wise Advisors
              </h2>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {COMPANIES.map(
                    ({
                      letter,
                      name,
                      count,
                      pct,
                      bg,
                      border,
                      letterBg,
                      bar,
                    }) => (
                      <CompanyCard
                        key={name}
                        letter={letter}
                        name={name}
                        count={count}
                        pct={pct}
                        bg={bg}
                        border={border}
                        letterBg={letterBg}
                        bar={bar}
                      />
                    ),
                  )}
                </div>
                <div
                  className="rounded-xl p-3 flex items-center gap-3 cursor-default transition-[transform,box-shadow] duration-200"
                  style={{ background: "#f3f0eb", border: "1px solid #e0d9cf" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 6px 20px #0001";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="w-9 h-9 bg-gray-400 rounded-lg flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-gray-900 leading-tight">
                      362
                    </div>
                    <div className="text-[12px] text-gray-400">Others</div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full bg-gray-400"
                        style={{ width: "93%" }}
                      />
                    </div>
                    <div
                      className="text-[10px] mt-0.5 font-semibold"
                      style={{ color: "#065F46" }}
                    >
                      All other companies combined
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
    bg-white rounded-xl p-4 border border-gray-100 shadow-sm
    transition-all duration-300
    hover:shadow-xl hover:shadow-gray-200/60
  "
            >
              <h2 className="text-base font-bold mb-4">
                👥 Role – wise Advisors
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {ROLES.map((item, index) => (
                  <AnimatedDonut
                    key={item.label + index}
                    pct={item.pct}
                    color={item.color}
                    label={item.label}
                    count={item.count}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
