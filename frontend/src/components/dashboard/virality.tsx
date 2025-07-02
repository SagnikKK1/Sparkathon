import React from 'react';
import '../../components_css/dashboard_css/virality.css';

export const DashboardViralityScore: React.FC = () => {
  return (
    <div className="virality-card">
      <div className="virality-divider" />
      <div className="virality-left">
        <div className="virality-score">86</div>
        <div className="virality-label">Virality Score</div>
      </div>
      <div className="virality-right">
        <div className="virality-metric">
          <span className="virality-metric-label">Comments:</span>
          <span className="virality-metric-value">350</span>
        </div>
        <div className="virality-metric">
          <span className="virality-metric-label">Searches:</span>
          <span className="virality-metric-value">1200</span>
        </div>
        <div className="virality-metric">
          <span className="virality-metric-label">YouTube Videos:</span>
          <span className="virality-metric-value">16</span>
        </div>
      </div>
    </div>
  );
};
