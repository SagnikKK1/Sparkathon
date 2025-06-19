import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
  datasets: [
    {
      label: "Airpods",
      data: [2, 3, 5, 4, 6],
      borderColor: "#f72c25",
      backgroundColor: "#f72c25",
      tension: 0.4,
    },
    {
      label: "Galaxy Buds",
      data: [1, 2, 3, 2, 3],
      borderColor: "#78c3fb",
      backgroundColor: "#78c3fb",
      tension: 0.4,
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

export default function CompetitorMentionsChart() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Competitor/Product Mentions
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
