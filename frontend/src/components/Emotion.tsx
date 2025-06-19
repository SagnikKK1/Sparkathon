import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const data = {
  labels: ["Joy", "Trust", "Anticipation", "Anger", "Disgust"],
  datasets: [
    {
      label: "Emotions",
      data: [12, 9, 7, 3, 2],
      backgroundColor: [
        "#23F0C7",
        "#78c3fb",
        "#f7b32b",
        "#f72c25",
        "#011627",
      ],
      borderColor: "#222b3f",
      borderWidth: 2,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      labels: { color: "#f7b32b" },
    },
  },
};

export default function EmotionDistributionChart() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Emotion Distribution
      </div>
      <Pie data={data} options={options} />
    </div>
  );
}
