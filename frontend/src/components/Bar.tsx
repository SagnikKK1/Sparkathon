import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Battery", "Price", "Weight", "Design", "Delivery"],
  datasets: [
    {
      label: "Positive",
      data: [18, 12, 8, 15, 13],
      backgroundColor: "#23F0C7",
    },
    {
      label: "Negative",
      data: [6, 7, 11, 5, 4],
      backgroundColor: "#f72c25",
    },
    {
      label: "Neutral",
      data: [4, 6, 5, 3, 6],
      backgroundColor: "#f7b32b",
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

export default function AspectSentimentBar() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Aspect Sentiment Distribution
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}
