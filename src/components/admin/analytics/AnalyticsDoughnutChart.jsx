"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ["#0A4A4A", "#0D6060", "#F59E0B", "#94A3B8", "#1A7A5A", "#7C3AED", "#EC4899"];

export default function AnalyticsDoughnutChart({ items = [], height = 220 }) {
  const data = useMemo(
    () => ({
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.count),
          backgroundColor: items.map((_, index) => PALETTE[index % PALETTE.length]),
          borderWidth: 0,
        },
      ],
    }),
    [items],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#5C7571", font: { family: "Poppins", size: 11 }, boxWidth: 10 },
        },
        tooltip: {
          backgroundColor: "#0A4A4A",
          titleFont: { family: "Poppins", size: 12 },
          bodyFont: { family: "Poppins", size: 12 },
        },
      },
    }),
    [],
  );

  if (!items.length) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-[#E6ECEA] text-sm text-[#7A928D]"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
