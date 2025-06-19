import React from "react";

export default function RiskAlertCard() {
  const riskDetected = true; // Example: always show alert

  if (!riskDetected) return null;

  return (
    <div className="bg-negative/20 border-l-4 border-negative text-negative p-4 mb-4 rounded">
      <div className="font-bold">Risk Alert!</div>
      <div>
        Hype score is low and negative trends detected. Investigate immediately.
      </div>
    </div>
  );
}
