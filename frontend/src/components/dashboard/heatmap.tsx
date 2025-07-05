import React, { useState } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

const MONTHS = [
  "July", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "June"
];

export const BuzzHeatmap: React.FC = () => {
  // 13 months × 4 weeks = 52 cells
  const rows = 13, cols = 4;
  // Stable random data for demo (replace with real data)
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
      <div className="buzz-heatmap-grid-4x13">
        {data.map((row, i) => (
          <React.Fragment key={i}>
            <div className="buzz-heatmap-month-label">{MONTHS[i]}</div>
            {row.map((val, j) => (
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
            ))}
          </React.Fragment>
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
