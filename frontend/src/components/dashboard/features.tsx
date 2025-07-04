import React from 'react';
import '../../components_css/dashboard_css/features.css';

export const DashboardFeatureSentimentBarChart: React.FC = () => {
  // Example data
  const features = [
    { name: "Battery", score: 7.2 },
    { name: "Camera", score: 8.1 },
    { name: "Display", score: 6.8 },
    { name: "Performance", score: 7.5 }
  ];
  const avg = features.reduce((a, b) => a + b.score, 0) / features.length;

  return (
    <div className="feature-bar-chart-premium">
      <div className="feature-bar-chart-title">Feature Sentiment</div>
      <div>
        <div className="feature-bar-row avg-bar">
          <span className="feature-name avg">Avg. Product</span>
          <div className="feature-bar-outer">
            <div className="feature-bar-inner avg" style={{ width: `${(avg/10)*100}%` }} />
          </div>
          <span className="feature-score avg">{avg.toFixed(1)}</span>
        </div>
        {features.map((f, i) => (
          <div className="feature-bar-row" key={f.name}>
            <span className="feature-name">{f.name}</span>
            <div className="feature-bar-outer">
              <div className="feature-bar-inner" style={{ width: `${(f.score/10)*100}%` }} />
            </div>
            <span className="feature-score">{f.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
