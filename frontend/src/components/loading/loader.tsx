import React from 'react';

interface CircularLoaderProps {
  progress: number; // 0 to 100
  size?: number;    // px, default 120
  strokeWidth?: number; // px, default 10
}

export const CircularLoader: React.FC<CircularLoaderProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-loader-wrapper" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="circular-loader-svg"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(151,125,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#loader-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="circular-loader-arc"
        />
        <defs>
          <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#977dff" />
            <stop offset="100%" stopColor="#b8aaff" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centered Percentage */}
      <div className="circular-loader-label">
        {Math.floor(progress)}%
      </div>
    </div>
  );
};
