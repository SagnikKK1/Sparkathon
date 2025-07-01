import React from 'react';
import '../../components_css/dashboard_css/sentiment.css';

// Dummy data for illustration
const data = [
  { time: 'Jan', score: 4 },
  { time: 'Feb', score: 5 },
  { time: 'Mar', score: 7 },
  { time: 'Apr', score: 6 },
  { time: 'May', score: 8 }
];

export const DashboardSentimentLineChart: React.FC = () => (
  <div className="sentiment-line-chart-tile">
    <div className="sentiment-line-chart-title">Sentiment Over Time</div>
    <svg width="100%" height="140" viewBox="0 0 300 140">
      <polyline
        fill="none"
        stroke="var(--tropical-indigo)"
        strokeWidth="3"
        points={
          data.map((d, i) => `${i * 70},${140 - d.score * 15}`).join(' ')
        }
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={i * 70}
          cy={140 - d.score * 15}
          r="5"
          fill="var(--tropical-indigo)"
        />
      ))}
    </svg>
    <div className="sentiment-line-chart-labels">
      {data.map((d, i) => (
        <span key={i} className="sentiment-label" style={{ left: `${i * 70}px` }}>
          {d.time}
        </span>
      ))}
    </div>
  </div>
);
