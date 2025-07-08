import React from "react";

// All SVGs use a wide aspect ratio for clarity: viewBox="0 0 260 180"
// All are enlarged for prominence

export const RedditLogo = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-red" : ""}>
    <circle cx="130" cy="90" r="80" fill="#fff" stroke="#FF4500" strokeWidth="12" />
    <ellipse cx="130" cy="120" rx="60" ry="40" fill="#FF4500" />
    <circle cx="90" cy="110" r="11" fill="#fff" />
    <circle cx="170" cy="110" r="11" fill="#fff" />
    <ellipse cx="130" cy="140" rx="28" ry="8" fill="#fff" />
    {/* Antenna */}
    <line x1="130" y1="50" x2="155" y2="25" stroke="#FF4500" strokeWidth="5" />
    <circle cx="162" cy="18" r="7" fill="#FF4500" />
  </svg>
);

export const YoutubeLogo = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-yt" : ""}>
    <rect x="40" y="60" rx="36" ry="36" width="180" height="60" fill="#fff" stroke="#FF0000" strokeWidth="12" />
    <polygon points="120,85 180,90 120,95" fill="#FF0000" />
  </svg>
);

export const NERSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-indigo" : ""}>
    <circle cx="50" cy="90" r="32" fill="#977dff" opacity={glow ? 1 : 0.6} />
    <circle cx="130" cy="50" r="32" fill="#b8aaff" opacity={glow ? 1 : 0.6} />
    <circle cx="130" cy="130" r="32" fill="#b8aaff" opacity={glow ? 1 : 0.6} />
    <circle cx="210" cy="90" r="32" fill="#977dff" opacity={glow ? 1 : 0.6} />
    {/* Connections */}
    <line x1="50" y1="90" x2="130" y2="50" stroke="#b8aaff" strokeWidth="8" />
    <line x1="50" y1="90" x2="130" y2="130" stroke="#b8aaff" strokeWidth="8" />
    <line x1="130" y1="50" x2="210" y2="90" stroke="#977dff" strokeWidth="8" />
    <line x1="130" y1="130" x2="210" y2="90" stroke="#977dff" strokeWidth="8" />
  </svg>
);

export const SieveSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180">
    <ellipse cx="130" cy="90" rx="100" ry="40" fill="#222" stroke="#977dff" strokeWidth="9"
      className={glow ? "pipeline-glow-indigo" : ""} />
    {/* Holes */}
    <circle cx="90" cy="90" r="7" fill="#b8aaff" opacity="0.5" />
    <circle cx="130" cy="90" r="7" fill="#b8aaff" opacity="0.5" />
    <circle cx="170" cy="90" r="7" fill="#b8aaff" opacity="0.5" />
    {/* Falling dots */}
    <circle className={glow ? "sieve-dot sieve-dot-1" : "sieve-dot"} cx="90" cy="105" r="5" fill="#977dff" />
    <circle className={glow ? "sieve-dot sieve-dot-2" : "sieve-dot"} cx="130" cy="105" r="5" fill="#b8aaff" />
    <circle className={glow ? "sieve-dot sieve-dot-3" : "sieve-dot"} cx="170" cy="105" r="5" fill="#977dff" />
  </svg>
);

export const GroupSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-indigo" : ""}>
    <circle cx="60" cy="90" r="22" fill="#977dff" opacity={glow ? 1 : 0.5} />
    <circle cx="90" cy="120" r="18" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <circle cx="85" cy="60" r="14" fill="#977dff" opacity={glow ? 1 : 0.5} />
    {/* Clustered group */}
    <circle cx="200" cy="100" r="36" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <circle cx="230" cy="140" r="22" fill="#977dff" opacity={glow ? 1 : 0.5} />
  </svg>
);

export const MetricsSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-indigo" : ""}>
    <rect x="40" y="60" width="180" height="60" rx="20" fill="#222"
      stroke="#b8aaff" strokeWidth="6" />
    <polyline points="58,110 90,90 130,100 170,70 202,90"
      fill="none" stroke="#977dff" strokeWidth="10" />
    {/* Chart dots */}
    <circle cx="58" cy="110" r="7" fill="#b8aaff" />
    <circle cx="90" cy="90" r="7" fill="#b8aaff" />
    <circle cx="130" cy="100" r="7" fill="#b8aaff" />
    <circle cx="170" cy="70" r="7" fill="#b8aaff" />
    <circle cx="202" cy="90" r="7" fill="#b8aaff" />
  </svg>
);

export const DashboardSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="260" height="180" viewBox="0 0 260 180" className={glow ? "pipeline-glow-indigo" : ""}>
    <rect x="40" y="40" width="180" height="100" rx="20" fill="#222"
      stroke="#977dff" strokeWidth="9" />
    {/* Widgets */}
    <rect x="60" y="60" width="50" height="25" rx="6" fill="#977dff" opacity={glow ? 1 : 0.5} />
    <rect x="150" y="60" width="50" height="25" rx="6" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <rect x="60" y="105" width="140" height="18" rx="6" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
  </svg>
);
