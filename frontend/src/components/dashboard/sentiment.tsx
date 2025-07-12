import React, { useEffect, useRef, useState } from 'react';
import '../../components_css/dashboard_css/sentiment.css';

const CARD_WIDTH = 580;
const CARD_HEIGHT = 370;
const SVG_WIDTH = 520;
const SVG_HEIGHT = 240;
const PADDING = 40;
const chartW = SVG_WIDTH - PADDING * 2;
const chartH = SVG_HEIGHT - PADDING;
const minScore = 0;
const maxScore = 10;

function getX(i: number, len: number) {
  return PADDING + (i * chartW) / (len > 1 ? len - 1 : 1);
}
function getY(score: number) {
  return PADDING + chartH - ((score - minScore) / (maxScore - minScore)) * chartH;
}

type SentimentPoint = { time: string; score: number };

export const DashboardSentimentLineChart: React.FC = () => {
  const [data, setData] = useState<SentimentPoint[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/card4/latest')
      .then(res => res.json())
      .then(json => {
        if (
          json.success &&
          json.data &&
          json.data.content &&
          typeof json.data.content === 'object'
        ) {
          // Sort time keys chronologically if possible
          const timePoints = Object.entries(json.data.content)
            .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
            .map(([time, score]) => ({
              time,
              score: typeof score === 'number' ? score : parseFloat(score as string)
            }));
          // Try to sort by date inside the label if possible
          const parseMonthYear = (label: string) => {
            // "Week 2 Jul 2025" or "Jul 2025"
            const match = label.match(/([A-Za-z]+)\s+(\d{4})/);
            if (match) {
              const month = match[1];
              const year = match[2];
              const monthIdx = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ].findIndex(m => m.toLowerCase() === month.slice(0,3).toLowerCase());
              return new Date(Number(year), monthIdx === -1 ? 0 : monthIdx);
            }
            return new Date(0);
          };
          timePoints.sort((a, b) => {
            // Try to sort by year and month, then by week number if present
            const weekA = a.time.match(/Week\s*(\d+)/);
            const weekB = b.time.match(/Week\s*(\d+)/);
            const dateA = parseMonthYear(a.time);
            const dateB = parseMonthYear(b.time);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
            if (weekA && weekB) {
              return Number(weekA[1]) - Number(weekB[1]);
            }
            return 0;
          });
          setData(timePoints);
        }
      })
      .catch(() => setData([]));
  }, []);

  useEffect(() => {
    if (pathRef.current && data.length > 1) {
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
  }, [data]);

  const pathD =
    data.length > 0
      ? data.reduce((acc, point, i, arr) => {
          const x = getX(i, arr.length);
          const y = getY(point.score);
          if (i === 0) return `M ${x} ${y}`;
          const prevX = getX(i - 1, arr.length);
          const prevY = getY(arr[i - 1].score);
          const midX = (prevX + x) / 2;
          return `${acc} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
        }, '')
      : '';

  const areaD = (() => {
    if (data.length === 0) return '';
    let d = data.reduce((acc, point, i) => {
      const x = getX(i, data.length);
      const y = getY(point.score);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1, data.length);
      const prevY = getY(data[i - 1].score);
      const midX = (prevX + x) / 2;
      return `${acc} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
    }, '');
    d += ` L ${getX(data.length - 1, data.length)} ${SVG_HEIGHT - PADDING}`;
    d += ` L ${getX(0, data.length)} ${SVG_HEIGHT - PADDING} Z`;
    return d;
  })();

  return (
    <div
      className="sentiment-card"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        boxSizing: 'border-box',
        padding: '32px 24px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      <div className="sentiment-title">
        Sentiment Vs. Time Analysis
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="sentiment-svg"
          style={{ display: 'block' }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <line
              key={t}
              x1={PADDING}
              x2={SVG_WIDTH - PADDING}
              y1={PADDING + chartH * t}
              y2={PADDING + chartH * t}
              stroke="rgba(151,125,255,0.08)"
              strokeWidth={1}
            />
          ))}
          <line
            x1={PADDING}
            x2={PADDING}
            y1={PADDING}
            y2={SVG_HEIGHT - PADDING}
            stroke="rgba(151,125,255,0.25)"
            strokeWidth={2}
          />
          <line
            x1={PADDING}
            x2={SVG_WIDTH - PADDING}
            y1={SVG_HEIGHT - PADDING}
            y2={SVG_HEIGHT - PADDING}
            stroke="rgba(151,125,255,0.25)"
            strokeWidth={2}
          />
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
          {data.map((d, i) => (
            <text
              key={i}
              x={getX(i, data.length)}
              y={SVG_HEIGHT - PADDING + 28}
              fontSize="15"
              fill="var(--cool-gray)"
              textAnchor="middle"
              fontWeight="bold"
            >
              {d.time}
            </text>
          ))}
          <path
            d={areaD}
            fill="url(#area-gradient)"
            opacity="1"
          />
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth={4}
            filter="url(#glow)"
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={getX(i, data.length)}
              cy={getY(d.score)}
              r={4}
              fill="var(--tropical-indigo)"
              stroke="#fff"
              strokeWidth={2}
              filter="url(#point-glow)"
            />
          ))}
          <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2={SVG_WIDTH} y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#977dff" />
              <stop offset="1" stopColor="#b8aaff" />
            </linearGradient>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2={SVG_HEIGHT} gradientUnits="userSpaceOnUse">
              <stop offset="5%" stopColor="#977dff" stopOpacity="0.25" />
              <stop offset="95%" stopColor="#b8aaff" stopOpacity="0.13" />
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
    </div>
  );
};
