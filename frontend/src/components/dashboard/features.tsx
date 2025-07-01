import React from 'react';
import '../../components_css/dashboard_css/features.css';

const features = [
  { name: 'Camera', score: 8 },
  { name: 'Battery', score: 3 },
  { name: 'Display', score: 7 },
  { name: 'Performance', score: 6 }
];

export const DashboardFeatureSentimentBarChart: React.FC = () => (
  <div className="feature-bar-chart-premium">
    <div className="feature-bar-chart-title">Feature Sentiment</div>
    <div className="feature-bars">
      {features.map((feature) => (
        <div className="feature-bar-row" key={feature.name}>
          <span className="feature-name">{feature.name}</span>
          <div className="feature-bar-outer">
            <div
              className="feature-bar-inner"
              style={{ width: `${feature.score * 10}%` }}
            />
          </div>
          <span className="feature-score">{feature.score}/10</span>
        </div>
      ))}
    </div>
  </div>
);
