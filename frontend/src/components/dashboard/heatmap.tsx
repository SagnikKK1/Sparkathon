// heatmap.tsx

import React, { useState } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

const MONTHS = [
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun"
];

export const BuzzHeatmap: React.FC = () => {
  const rows = 4, cols = 12;
  const data = React.useMemo(
    () => Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random())
    ),
    []
  );
  const [hover, setHover] = useState<{ row: number, col: number } | null>(null);

  return (
    <div className="buzz-heatmap-card">
      <div className="buzz-heatmap-title">Buzz Heatmap</div>
      <div className="buzz-heatmap-center-wrapper">
        <div className="buzz-heatmap-grid-12x4">
          {Array.from({ length: rows }).map((_, i) => (
            <React.Fragment key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="buzz-heatmap-cell"
                  style={{
                    background: `rgba(151,125,255,${0.15 + 0.75 * data[i][j]})`,
                    border: hover && hover.row === i && hover.col === j ? '2px solid #fff' : '1px solid rgba(151,125,255,0.18)'
                  }}
                  onMouseEnter={() => setHover({ row: i, col: j })}
                  onMouseLeave={() => setHover(null)}
                >
                  {hover && hover.row === i && hover.col === j && (
                    <div className="buzz-heatmap-tooltip">
                      {Math.round(data[i][j] * 100)} comments
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="buzz-heatmap-months-row">
          {MONTHS.map((month) => (
            <span className="buzz-heatmap-month-col-label" key={month}>{month}</span>
          ))}
        </div>
      </div>
      <div className="buzz-heatmap-legend">
        <span>Low</span>
        <div className="buzz-heatmap-legend-bar" />
        <span>High</span>
      </div>
    </div>
  );
};
