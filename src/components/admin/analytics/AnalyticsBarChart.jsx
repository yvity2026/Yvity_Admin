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

export default function AnalyticsBarChart({
  labels = [],
  values = [],
  valueKey = "count",
  color = "rgba(13, 96, 96, 0.82)",
  hoverColor = "#0A4A4A",
  height = 220,
}) {
  const maxValue = Math.max(...values.map((v) => Number(v[valueKey]) || 0), 1);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values.map((v) => Number(v[valueKey]) || 0),
          backgroundColor: color,
          hoverBackgroundColor: hoverColor,
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 28,
        },
      ],
    }),
    [labels, values, valueKey, color, hoverColor],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0A4A4A",
          titleFont: { family: "Poppins", size: 12 },
          bodyFont: { family: "Poppins", size: 12 },
          padding: 12,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#7A928D", font: { family: "Poppins", size: 10 }, maxRotation: 45 },
          border: { display: false },
        },
        y: { display: false, max: maxValue * 1.2 },
      },
    }),
    [maxValue],
  );

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
