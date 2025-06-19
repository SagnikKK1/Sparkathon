import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Battery", "Price", "Weight", "Design", "Delivery"],
  datasets: [
    {
      label: "Positive",
      data: [20, 15, 10, 14, 16],
      backgroundColor: "#23F0C7",
    },
    {
      label: "Negative",
      data: [5, 7, 12, 6, 4],
      backgroundColor: "#f72c25",
    },
  ],
};

const options = {
  indexAxis: "y" as const,
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

export default function AspectSentimentHeatmap() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Aspect Sentiment Heatmap
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}
