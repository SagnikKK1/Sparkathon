import React, { useEffect, useRef } from 'react';
import '../../components_css/dashboard_css/sentiment.css';

const data = [
  { time: 'Jan', score: 4 },
  { time: 'Feb', score: 5 },
  { time: 'Mar', score: 7 },
  { time: 'Apr', score: 6 },
  { time: 'May', score: 8 }
];

const WIDTH = 420;
const HEIGHT = 220;
const PADDING = 48;
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

export const DashboardSentimentLineChart: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
          pathRef.current.style.strokeDashoffset = '0';
        }
      }, 100);
    }
  }, []);

  const pathD = data.reduce((acc, point, i, arr) => {
    const x = getX(i);
    const y = getY(point.score);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(arr[i - 1].score);
    const midX = (prevX + x) / 2;
    return `${acc} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
  }, '');

  return (
    <div className="sentiment-chart-premium">
      <div className="sentiment-title">Sentiment Over Time</div>
      <svg width={WIDTH} height={HEIGHT} className="sentiment-svg">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => (
          <line
            key={idx}
            x1={PADDING}
            x2={WIDTH - PADDING}
            y1={PADDING + chartH * t}
            y2={PADDING + chartH * t}
            stroke="rgba(151,125,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {/* Y axis */}
        <line
          x1={PADDING}
          x2={PADDING}
          y1={PADDING}
          y2={HEIGHT - PADDING}
          stroke="rgba(151,125,255,0.25)"
          strokeWidth={2}
        />
        {/* X axis */}
        <line
          x1={PADDING}
          x2={WIDTH - PADDING}
          y1={HEIGHT - PADDING}
          y2={HEIGHT - PADDING}
          stroke="rgba(151,125,255,0.25)"
          strokeWidth={2}
        />
        {/* Y labels */}
        {[minScore, 5, maxScore].map((v, i) => (
          <text
            key={i}
            x={PADDING - 12}
            y={getY(v) + 6}
            fontSize="13"
            fill="var(--cool-gray)"
            textAnchor="end"
            fontWeight="bold"
          >
            {v}
          </text>
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={HEIGHT - PADDING + 28}
            fontSize="15"
            fill="var(--cool-gray)"
            textAnchor="middle"
            fontWeight="bold"
          >
            {d.time}
          </text>
        ))}
        {/* Line path (with glow) */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#line-gradient)"
          strokeWidth={4}
          filter="url(#glow)"
        />
        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.score)}
            r={8}
            fill="var(--tropical-indigo)"
            stroke="#fff"
            strokeWidth={2}
            filter="url(#point-glow)"
          />
        ))}
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2={WIDTH} y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#977dff" />
            <stop offset="1" stopColor="#b8aaff" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="point-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
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
