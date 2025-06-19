import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
  datasets: [
    {
      label: "Very Positive",
      data: [12, 17, 14, 20, 18],
      borderColor: "#23F0C7",
      backgroundColor: "#23F0C7",
      tension: 0.4,
    },
    {
      label: "Positive",
      data: [10, 12, 11, 13, 12],
      borderColor: "#78c3fb",
      backgroundColor: "#78c3fb",
      tension: 0.4,
    },
    {
      label: "Neutral",
      data: [8, 7, 10, 9, 8],
      borderColor: "#f7b32b",
      backgroundColor: "#f7b32b",
      tension: 0.4,
    },
    {
      label: "Negative",
      data: [4, 3, 5, 2, 3],
      borderColor: "#f72c25",
      backgroundColor: "#f72c25",
      tension: 0.4,
    },
    {
      label: "Very Negative",
      data: [2, 1, 2, 1, 2],
      borderColor: "#011627",
      backgroundColor: "#011627",
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

export default function SentimentTimelineChart() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Sentiment Over Time
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
