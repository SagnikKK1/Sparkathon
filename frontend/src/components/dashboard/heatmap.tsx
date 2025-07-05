import React, { useState } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

const MONTHS = [
  "July", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "June"
];

export const BuzzHeatmap: React.FC = () => {
  // 52 weeks, 1 row (horizontal)
  const weeks = 52;
  // Stable random data for demo (replace with real data)
  const data = React.useMemo(
    () => Array.from({ length: weeks }, () => Math.random()),
    []
  );
  const [hover, setHover] = useState<number | null>(null);

  // Calculate where to place month labels (start of each month)
  const monthLabels = [];
  let week = 0;
  for (let m = 0; m < MONTHS.length; m++) {
    // 4 or 5 weeks per month, for demo purposes
    monthLabels.push({ name: MONTHS[m], week: week });
    week += m === 0 || m === 6 ? 5 : 4; // July/Jan: 5 weeks, others: 4
  }

  return (
    <div className="buzz-heatmap-card">
      <div className="buzz-heatmap-title">Buzz Heatmap</div>
      <div className="buzz-heatmap-months-row">
        {monthLabels.map((m, i) => (
          <span
            key={m.name}
            className="buzz-heatmap-month-label"
            style={{ left: `calc(${(m.week / weeks) * 100}% - 12px)` }}
          >
            {m.name}
          </span>
        ))}
      </div>
      <div className="buzz-heatmap-grid-horizontal">
        {data.map((val, j) => (
          <div
            key={j}
            className="buzz-heatmap-cell"
            style={{
              background: `rgba(151,125,255,${0.15 + 0.75 * val})`,
              border: hover === j ? '2px solid #fff' : '1px solid rgba(151,125,255,0.18)'
            }}
            onMouseEnter={() => setHover(j)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === j && (
              <div className="buzz-heatmap-tooltip">
                {Math.round(val * 100)} comments
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="buzz-heatmap-legend">
        <span>Low</span>
        <div className="buzz-heatmap-legend-bar" />
        <span>High</span>
      </div>
    </div>
  );
};
