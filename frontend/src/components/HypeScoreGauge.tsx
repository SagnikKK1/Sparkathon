// src/components/HypeScoreGauge.tsx
import React from "react";

interface HypeScoreGaugeProps {
  score?: number; // 0 to 100
}

const getColor = (score: number) => {
  if (score > 75) return "text-green-500";
  if (score > 50) return "text-yellow-400";
  if (score > 25) return "text-orange-400";
  return "text-red-500";
};

export default function HypeScoreGauge({ score = 68 }: HypeScoreGaugeProps) {
  // Clamp score between 0 and 100
  const clamped = Math.min(100, Math.max(0, score));
  const angle = (clamped / 100) * 180;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
      <div className="text-lg font-semibold mb-2">Hype Score</div>
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path
          d="M 20 100 A 80 80 0 0 1 160 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 160 100"
          fill="none"
          stroke="#34d399"
          strokeWidth="16"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * clamped) / 100}
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
        {/* Needle */}
        <g transform={`rotate(${angle - 90} 90 100)`}>
          <rect x="87" y="30" width="6" height="70" fill="#374151" rx="3" />
        </g>
        {/* Center circle */}
        <circle cx="90" cy="100" r="10" fill="#374151" />
      </svg>
      <div className={`mt-2 text-3xl font-bold ${getColor(clamped)}`}>
        {clamped}
      </div>
      <div className="text-xs text-gray-400">/ 100</div>
    </div>
  );
}
