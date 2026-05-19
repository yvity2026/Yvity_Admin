"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-pro";

const BAR_MONTHS = [
  { m: "Jan", h: 2400, gold: true, val: "₹2,400" },
  { m: "Feb", h: 1398, gold: false, val: "₹1,398" },
  { m: "Mar", h: 9800, gold: true, val: "₹9,800" },
  { m: "Apr", h: 3908, gold: false, val: "₹3,908" },
  { m: "May", h: 4800, gold: true, val: "₹4,800" },
  { m: "Jun", h: 3800, gold: false, val: "₹3,800" },
];

export default function RevenueBarChart() {
  const data = useMemo(() => {
    return {
      labels: BAR_MONTHS.map((item) => item.m),
      datasets: [
        {
          data: BAR_MONTHS.map((item) => item.h),
          backgroundColor: BAR_MONTHS.map((item) =>
            item.gold ? "#F59E0B" : "#0f766e"
          ),
          hoverBackgroundColor: BAR_MONTHS.map((item) =>
            item.gold ? "#d97706" : "#115e59"
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
