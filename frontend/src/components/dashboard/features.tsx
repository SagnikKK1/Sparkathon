import React, { useEffect, useState } from 'react';
import '../../components_css/dashboard_css/features.css';

type Feature = { name: string; score: number };

export const DashboardFeatureSentimentBarChart: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/card3/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.content) {
          const content = data.data.content;
          // Try to identify the product key (e.g., 'Iphone 15') and exclude it
          const productKey = Object.keys(content).find(
            key => key.toLowerCase().includes('iphone') || key.toLowerCase().includes('product')
          );
          const featureList = Object.entries(content)
            .filter(([key]) => key !== productKey)
            .map(([name, score]) => ({
              name,
              score:
                typeof score === 'number'
                  ? score
                  : typeof score === 'string'
                    ? parseFloat(score)
                    : 0
            }));
          setFeatures(featureList);
          setAvg(
            featureList.length
              ? featureList.reduce((a, b) => a + b.score, 0) / featureList.length
              : 0
          );
        }
      })
      .catch(() => {
        setFeatures([]);
        setAvg(0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="feature-bar-chart-premium">
      <div className="feature-bar-chart-title">Feature Sentiment</div>
      <div>
        <div className="feature-bar-row avg-bar">
          <span className="feature-name avg">Avg. Product</span>
          <div className="feature-bar-outer">
            <div
              className="feature-bar-inner avg"
              style={{ width: `${(avg / 10) * 100}%` }}
            />
          </div>
          <span className="feature-score avg">
            {loading ? '--' : avg.toFixed(2)}
          </span>
        </div>
        {loading ? (
          <div style={{ padding: '1rem' }}>Loading...</div>
        ) : (
          features.map(f => (
            <div className="feature-bar-row" key={f.name}>
              <span className="feature-name">{f.name}</span>
              <div className="feature-bar-outer">
                <div
                  className="feature-bar-inner"
                  style={{ width: `${(f.score / 10) * 100}%` }}
                />
              </div>
              <span className="feature-score">{f.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
