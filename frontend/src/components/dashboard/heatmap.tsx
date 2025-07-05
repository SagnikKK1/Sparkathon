import React, { useState } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

const MONTHS = [
  "July", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "June"
];

export const BuzzHeatmap: React.FC = () => {
  // 4 rows, 12 columns
  const rows = 4, cols = 12;
  const data = React.useMemo(
    () => Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random())
    ),
    []
  );
  const [hover, setHover] = useState<{ row: number, col: number } | null>(null);

  // Assign months to each row (3 months per row)
  const monthsPerRow = 3;
  const rowMonthLabels = [
    MONTHS.slice(0, 3).join(' / '),
    MONTHS.slice(3, 6).join(' / '),
    MONTHS.slice(6, 9).join(' / '),
    MONTHS.slice(9, 12).join(' / ')
  ];

  return (
    <div className="buzz-heatmap-card">
      <div className="buzz-heatmap-title">Buzz Heatmap</div>
      <div className="buzz-heatmap-grid-12x4">
        {data.map((row, i) => (
          <React.Fragment key={i}>
            <div className="buzz-heatmap-month-label">{rowMonthLabels[i]}</div>
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
