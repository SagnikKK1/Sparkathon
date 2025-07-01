import React from 'react';
import './sentiment.css';

const data = [
  { time: 'Jan', score: 8 },
  { time: 'Feb', score: 6 },
  { time: 'Mar', score: 7 },
  { time: 'Apr', score: 5 },
  { time: 'May', score: 9 },
  { time: 'Jun', score: 7 }
];

const WIDTH = 540;
const HEIGHT = 260;
const PADDING = 32;
const chartW = WIDTH - PADDING * 2;
const chartH = HEIGHT - PADDING * 2;
const minScore = 0;
const maxScore = 10;

function getX(i: number) {
  return PADDING + (i * chartW) / (data.length - 1);
}
function getY(score: number) {
  return PADDING + chartH - ((score - minScore) / (maxScore - minScore)) * chartH;
}

export const SentimentChart: React.FC = () => {
  // Create a smooth SVG path
  const pathD = data.reduce((acc, point, i, arr) => {
    const x = getX(i);
    const y = getY(point.score);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(arr[i - 1].score);
    const midX = (prevX + x) / 2;
    return `${acc} Q ${prevX} ${prevY}, ${midX} ${(prevY + y) / 2} T ${x} ${y}`;
  }, '');

  return (
    <div className="sentiment-card">
      <div className="sentiment-title">Overall Sentiment Over Time</div>
      <svg width={WIDTH} height={HEIGHT} className="sentiment-svg">
        {/* Glowing line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#sentiment-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={HEIGHT - PADDING + 28}
            fontSize="18"
            fill="#bfc0d1"
            textAnchor="middle"
            fontWeight="bold"
          >
            {d.time}
          </text>
        ))}
        <defs>
          <linearGradient id="sentiment-gradient" x1="0" y1="0" x2={WIDTH} y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d1d1e9" />
            <stop offset="1" stopColor="#bfc0d1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
