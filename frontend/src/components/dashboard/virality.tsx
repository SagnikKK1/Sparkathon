import React, { useEffect, useState } from 'react';
import '../../components_css/dashboard_css/virality.css';

type Card1Content = {
  "Buzz Score": number;
  "Total Comments": number;
  "Neutral Comments": number;
  "Negative Comments": number;
  "Positive Comments": number;
  "Net Sentiment Score": number;
  "Reddit Comments Count": number;
  "YouTube Comments Count": number;
  "Positive to Negative Ratio": number;
};

export const DashboardViralityScore: React.FC = () => {
  const [viralityScore, setViralityScore] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/card1/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.content && data.data.content.content) {
          const content: Card1Content = data.data.content.content;
          setViralityScore(content["Buzz Score"]);
          // Prepare metrics except Buzz Score
          const metricsList = Object.entries(content)
            .filter(([key]) => key !== "Buzz Score")
            .map(([key, value]) => ({
              label: key,
              value: String(value)
            }));
          setMetrics(metricsList);
        }
      })
      .catch(() => {
        setViralityScore(null);
        setMetrics([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="virality-card">
      <div className="virality-left">
        <div className="virality-score">
          {loading ? '--' : viralityScore !== null ? viralityScore : 'N/A'}
        </div>
        <div className="virality-label">Virality Score</div>
      </div>
      <div className="virality-divider"></div>
      <div className="virality-right">
        {loading ? (
          <div>Loading...</div>
        ) : (
          metrics.map((m, i) => (
            <div className="virality-metric" key={i}>
              <span className="virality-metric-label">{m.label}:</span>
              <span className="virality-metric-value">{m.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
