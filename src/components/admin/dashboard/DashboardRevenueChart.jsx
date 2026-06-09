"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function DashboardRevenueChart({ months = [] }) {
  const maxAmount = Math.max(...months.map((m) => m.amount), 1);

  const data = useMemo(
    () => ({
      labels: months.map((m) => m.month),
      datasets: [
        {
          data: months.map((m) => m.amount),
          backgroundColor: months.map((m) =>
            m.highlight
              ? "rgba(245, 158, 11, 0.92)"
              : "rgba(13, 96, 96, 0.82)"
          ),
          hoverBackgroundColor: months.map((m) =>
            m.highlight ? "#D97706" : "#0A4A4A"
          ),
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 34,
        },
      ],
    }),
    [months],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0A4A4A",
          titleFont: { family: "Poppins", size: 12 },
          bodyFont: { family: "Poppins", size: 12 },
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (ctx) => months[ctx.dataIndex]?.label || "",
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#7A928D",
            font: { family: "Poppins", size: 11 },
          },
          border: { display: false },
        },
        y: {
          display: false,
          max: maxAmount * 1.15,
        },
      },
    }),
    [months, maxAmount],
  );

  return (
    <div className="h-[220px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
