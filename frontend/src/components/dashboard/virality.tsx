import React from 'react';
import '../../components_css/dashboard_css/virality.css';

export const DashboardViralityScore: React.FC = () => {
  // Example data, replace with real props/data as needed
  const metrics = [
    { label: "Reddit Comments", value: 220, pos: 180, neg: 40 },
    { label: "YouTube Comments", value: 130, pos: 100, neg: 30 },
    { label: "Searches", value: 1200 },
    { label: "Positive:Negative", value: "280:70" }
  ];

  return (
    <div className="virality-card">
      <div className="virality-divider" />
      <div className="virality-left">
        <div className="virality-score">86</div>
        <div className="virality-label">Virality Score</div>
      </div>
      <div className="virality-right">
        {metrics.map((m, i) => (
          <div className="virality-metric" key={i}>
            <span className="virality-metric-label">{m.label}:</span>
            <span className="virality-metric-value">
              {m.value}
              {m.pos !== undefined && m.neg !== undefined && (
                <span className="virality-posneg">
                  &nbsp;(<span className="pos">{m.pos}</span> / <span className="neg">{m.neg}</span>)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
