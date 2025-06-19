import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Battery", "Price", "Weight", "Design", "Delivery"],
  datasets: [
    {
      label: "Mentions",
      data: [30, 24, 16, 22, 19],
      backgroundColor: "#78c3fb",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: "#f7b32b" },
    },
  },
  scales: {
    x: { ticks: { color: "#78c3fb" }, grid: { color: "#222b3f" } },
    y: { ticks: { color: "#78c3fb" }, grid: { color: "#222b3f" } },
  },
};

export default function AspectFrequencyBar() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Aspect Frequency
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}
