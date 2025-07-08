import React from "react";

// 1. Scraping Data: Reddit Logo
export const RedditLogo = ({ glow }: { glow?: boolean }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" className={glow ? "pipeline-glow-red" : ""}>
    <circle cx="32" cy="32" r="28" fill="#fff" stroke="#FF4500" strokeWidth="4" />
    <ellipse cx="32" cy="40" rx="15" ry="10" fill="#FF4500" />
    <circle cx="24" cy="38" r="2.2" fill="#fff" />
    <circle cx="40" cy="38" r="2.2" fill="#fff" />
    <ellipse cx="32" cy="44" rx="7" ry="2" fill="#fff" />
    <line x1="32" y1="18" x2="38" y2="10" stroke="#FF4500" strokeWidth="2" />
    <circle cx="39.5" cy="8.5" r="2" fill="#FF4500" />
  </svg>
);

// 2. Scraping Data: YouTube Logo
export const YoutubeLogo = ({ glow }: { glow?: boolean }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" className={glow ? "pipeline-glow-yt" : ""}>
    <rect x="8" y="20" rx="12" ry="12" width="48" height="24" fill="#fff" stroke="#FF0000" strokeWidth="4" />
    <polygon points="30,28 44,32 30,36" fill="#FF0000" />
  </svg>
);

// 3. NER Neural Net
export const NERSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="80" height="64" viewBox="0 0 80 64" className={glow ? "pipeline-glow-indigo" : ""}>
    <circle cx="16" cy="32" r="10" fill="#977dff" opacity={glow ? 1 : 0.6} />
    <circle cx="40" cy="16" r="10" fill="#b8aaff" opacity={glow ? 1 : 0.6} />
    <circle cx="40" cy="48" r="10" fill="#b8aaff" opacity={glow ? 1 : 0.6} />
    <circle cx="64" cy="32" r="10" fill="#977dff" opacity={glow ? 1 : 0.6} />
    <line x1="16" y1="32" x2="40" y2="16" stroke="#b8aaff" strokeWidth="2" />
    <line x1="16" y1="32" x2="40" y2="48" stroke="#b8aaff" strokeWidth="2" />
    <line x1="40" y1="16" x2="64" y2="32" stroke="#977dff" strokeWidth="2" />
    <line x1="40" y1="48" x2="64" y2="32" stroke="#977dff" strokeWidth="2" />
  </svg>
);

// 4. Sieve / Filtering
export const SieveSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="80" height="64" viewBox="0 0 80 64">
    <ellipse cx="40" cy="32" rx="30" ry="12" fill="#222" stroke="#977dff" strokeWidth="3"
      className={glow ? "pipeline-glow-indigo" : ""} />
    <circle cx="30" cy="32" r="2" fill="#b8aaff" opacity="0.5" />
    <circle cx="40" cy="32" r="2" fill="#b8aaff" opacity="0.5" />
    <circle cx="50" cy="32" r="2" fill="#b8aaff" opacity="0.5" />
    {/* Falling dots */}
    <circle className={glow ? "sieve-dot sieve-dot-1" : "sieve-dot"} cx="30" cy="34" r="1.5" fill="#977dff" />
    <circle className={glow ? "sieve-dot sieve-dot-2" : "sieve-dot"} cx="40" cy="34" r="1.5" fill="#b8aaff" />
    <circle className={glow ? "sieve-dot sieve-dot-3" : "sieve-dot"} cx="50" cy="34" r="1.5" fill="#977dff" />
  </svg>
);

// 5. Grouping Entities
export const GroupSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="80" height="64" viewBox="0 0 80 64" className={glow ? "pipeline-glow-indigo" : ""}>
    <circle cx="20" cy="32" r="6" fill="#977dff" opacity={glow ? 1 : 0.5} />
    <circle cx="30" cy="36" r="5" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <circle cx="28" cy="26" r="4" fill="#977dff" opacity={glow ? 1 : 0.5} />
    <circle cx="60" cy="32" r="10" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <circle cx="68" cy="36" r="6" fill="#977dff" opacity={glow ? 1 : 0.5} />
  </svg>
);

// 6. Metrics/Chart
export const MetricsSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="80" height="64" viewBox="0 0 80 64" className={glow ? "pipeline-glow-indigo" : ""}>
    <rect x="10" y="20" width="60" height="32" rx="8" fill="#222"
      stroke="#b8aaff" strokeWidth="2" />
    <polyline points="18,48 30,40 42,44 54,28 66,36" fill="none" stroke="#977dff" strokeWidth="3" />
    <circle cx="18" cy="48" r="2" fill="#b8aaff" />
    <circle cx="30" cy="40" r="2" fill="#b8aaff" />
    <circle cx="42" cy="44" r="2" fill="#b8aaff" />
    <circle cx="54" cy="28" r="2" fill="#b8aaff" />
    <circle cx="66" cy="36" r="2" fill="#b8aaff" />
  </svg>
);

// 7. Dashboard/Output
export const DashboardSvg = ({ glow }: { glow?: boolean }) => (
  <svg width="80" height="64" viewBox="0 0 80 64" className={glow ? "pipeline-glow-indigo" : ""}>
    <rect x="12" y="16" width="56" height="32" rx="8" fill="#222"
      stroke="#977dff" strokeWidth="3" />
    <rect x="20" y="24" width="16" height="8" rx="2" fill="#977dff" opacity={glow ? 1 : 0.5} />
    <rect x="44" y="24" width="16" height="8" rx="2" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
    <rect x="20" y="36" width="40" height="6" rx="2" fill="#b8aaff" opacity={glow ? 1 : 0.5} />
  </svg>
);
