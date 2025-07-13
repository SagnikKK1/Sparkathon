import React, { useState, useEffect, useMemo } from 'react';
import '../../components_css/dashboard_css/heatmap.css';

const MONTHS = [
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun"
];

const ROWS = 4;
const COLS = 12;

function getLast48WeekLabels(): string[] {
  // Generate labels for the latest 48 weeks, oldest to newest, matching "Week X Mon YYYY"
  const labels: string[] = [];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const now = new Date();
  for (let i = 47; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekNum = Math.min(Math.floor((date.getDate() - 1) / 7) + 1, 5);
    const label = `Week ${weekNum} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    labels.push(label);
  }
  return labels;
}

export const BuzzHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<number[][] | null>(null);
  const [hover, setHover] = useState<{ row: number, col: number } | null>(null);

  useEffect(() => {
    // Fetch the latest card6 data
    fetch('http://localhost:3000/api/card6/latest')
      .then(res => res.json())
      .then(json => {
        if (json && json.success && json.data && json.data.content) {
          const content = json.data.content;
          // Get the last 48 week labels (oldest to newest)
          const weekLabels = getLast48WeekLabels();

          // Build a 4x12 grid for the heatmap
          const values: number[] = [];
          for (let i = 0; i < weekLabels.length; i++) {
            const val = content[weekLabels[i]] ?? null;
            values.push(val);
          }
          // Remove leading nulls if less than 48 weeks of data
          let firstValid = values.findIndex(v => v !== null && v !== undefined);
          if (firstValid === -1) firstValid = 0;
          const trimmed = values.slice(firstValid);
          // Fill up to 48 with nulls at the front if needed
          const padded = Array(48 - trimmed.length).fill(null).concat(trimmed);

          // Convert to 4x12 grid
          const grid: number[][] = [];
          for (let r = 0; r < ROWS; r++) {
            grid.push([]);
            for (let c = 0; c < COLS; c++) {
              grid[r].push(padded[r * COLS + c]);
            }
          }
          setHeatmapData(grid);
        }
      });
  }, []);

  // Compute min/max for color scaling
  const { minVal, maxVal } = useMemo(() => {
    if (!heatmapData) return { minVal: 0, maxVal: 1 };
    let min = Infinity, max = -Infinity;
    for (const row of heatmapData) {
      for (const v of row) {
        if (v !== null && v !== undefined) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    if (!isFinite(min) || !isFinite(max) || min === max) {
      return { minVal: 0, maxVal: 1 };
    }
    return { minVal: min, maxVal: max };
  }, [heatmapData]);

  return (
    <div className="buzz-heatmap-card">
      <div className="buzz-heatmap-title">Buzz Heatmap</div>
      <div className="buzz-heatmap-center-wrapper">
        <div className="buzz-heatmap-grid-12x4">
          {heatmapData ? heatmapData.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((val, j) => {
                let alpha = 0.15;
                if (val !== null && val !== undefined && maxVal > minVal) {
                  alpha = 0.15 + 0.75 * ((val - minVal) / (maxVal - minVal));
                }
                return (
                  <div
                    key={`${i}-${j}`}
                    className="buzz-heatmap-cell"
                    style={{
                      background: `rgba(151,125,255,${alpha})`,
                      border: hover && hover.row === i && hover.col === j ? '2px solid #fff' : '1px solid rgba(151,125,255,0.18)'
                    }}
                    onMouseEnter={() => setHover({ row: i, col: j })}
                    onMouseLeave={() => setHover(null)}
                  >
                    {hover && hover.row === i && hover.col === j && (
                      <div className="buzz-heatmap-tooltip">
                        {val !== null && val !== undefined ? `${val} comments` : 'No data'}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          )) : (
            // Loading state: show empty grid
            Array.from({ length: ROWS }).map((_, i) =>
              Array.from({ length: COLS }).map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="buzz-heatmap-cell"
                  style={{
                    background: `rgba(151,125,255,0.15)`,
                    border: '1px solid rgba(151,125,255,0.18)'
                  }}
                />
              ))
            )
          )}
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
