import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
  datasets: [
    {
      label: "Charging Issues",
      data: [2, 4, 8, 7, 6],
      borderColor: "#f72c25",
      backgroundColor: "#f72c25",
      tension: 0.4,
    },
    {
      label: "Battery Life",
      data: [6, 9, 12, 11, 10],
      borderColor: "#23F0C7",
      backgroundColor: "#23F0C7",
      tension: 0.4,
    },
    {
      label: "Design",
      data: [3, 5, 4, 6, 7],
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

export default function TopicEvolutionChart() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Topic Evolution
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
