import React from 'react';
import '../../components_css/dashboard_css/virality.css';

export const DashboardViralityScore: React.FC = () => {
  // Example data
  const viralityScore = 86;
  const searches = 1243;

  return (
    <div className="virality-score-tile">
      <div className="virality-score-number">{viralityScore}</div>
      <div className="virality-score-label">Virality Score</div>
      <div className="virality-score-searches">{searches} searches</div>
    </div>
  );
};
