import React from "react";

const metrics = [
  { metric: "Hype Score", value: 68 },
  { metric: "Positive Mentions", value: 120 },
  { metric: "Negative Mentions", value: 35 },
  { metric: "Top Aspect", value: "Battery" },
  { metric: "Competitor Mentions", value: 14 },
];

export default function MetricsTable() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Detailed Metrics
      </div>
      <table className="w-full text-blue">
        <tbody>
          {metrics.map((row) => (
            <tr key={row.metric}>
              <td className="py-1 font-semibold">{row.metric}</td>
              <td className="py-1">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
