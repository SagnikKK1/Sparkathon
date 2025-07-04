import React, { useState } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

export const BuzzHeatmap: React.FC = () => {
  // Example: 13 weeks x 4 rows (months)
  const weeks = 13, rows = 4;
  // Example data: random values between 0 and 1
  const data = Array.from({ length: rows }, () =>
    Array.from({ length: weeks }, () => Math.random())
  );
  const [hover, setHover] = useState<{ row: number, col: number } | null>(null);

  return (
    <div className="buzz-heatmap-card">
      <div className="buzz-heatmap-title">Buzz Heatmap</div>
      <div className="buzz-heatmap-grid">
        {data.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`${i}-${j}`}
              className="buzz-heatmap-cell"
              style={{
                background: `rgba(151,125,255,${0.15 + 0.75 * val})`,
                border: hover && hover.row === i && hover.col === j ? '2px solid #fff' : '1px solid rgba(151,125,255,0.18)'
              }}
              onMouseEnter={() => setHover({ row: i, col: j })}
              onMouseLeave={() => setHover(null)}
            >
              {hover && hover.row === i && hover.col === j && (
                <div className="buzz-heatmap-tooltip">
                  {Math.round(val * 100)} comments
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="buzz-heatmap-legend">
        <span>Low</span>
        <div className="buzz-heatmap-legend-bar" />
        <span>High</span>
      </div>
    </div>
  );
};
