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
    <div className="feature-sentiment-card">
      <div className="feature-sentiment-title">Feature Sentiment</div>
      <div className="feature-sentiment-bars">
        <div className="feature-bar avg-bar">
          <span className="feature-label">Avg. Product Sentiment</span>
          <div className="feature-bar-bg">
            <div className="feature-bar-fill avg" style={{ width: `${(avg/10)*100}%` }} />
          </div>
          <span className="feature-score">{avg.toFixed(1)}</span>
        </div>
        {features.map((f, i) => (
          <div className="feature-bar" key={f.name}>
            <span className="feature-label">{f.name}</span>
            <div className="feature-bar-bg">
              <div className="feature-bar-fill" style={{ width: `${(f.score/10)*100}%` }} />
            </div>
            <span className="feature-score">{f.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
