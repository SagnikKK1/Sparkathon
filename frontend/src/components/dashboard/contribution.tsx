import React from 'react';
import '../../components_css/dashboard_css/contribution.css';

export const FeatureContributionPieChart: React.FC = () => {
  // Example data
  const features = [
    { name: "Battery", value: 40 },
    { name: "Camera", value: 30 },
    { name: "Display", value: 20 },
    { name: "Performance", value: 10 }
  ];
  const total = features.reduce((a, b) => a + b.value, 0);

  // Pie chart rendering (SVG)
  const radius = 60;
  const cx = 75, cy = 75;
  let cumulative = 0;
  const colors = ["#977dff", "#b8aaff", "#4be04b", "#ff5c5c"];

  const arcs = features.map((f, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += f.value;
    const endAngle = (cumulative / total) * 2 * Math.PI;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const d = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
    return (
      <path key={f.name} d={d} fill={colors[i % colors.length]} opacity="0.85">
        <title>{f.name}: {((f.value/total)*100).toFixed(1)}%</title>
      </path>
    );
  });

  return (
    <div className="feature-pie-card">
      <div className="feature-pie-title">Feature Contribution Chart</div>
      <svg width={150} height={150} className="feature-pie-svg">
        {arcs}
      </svg>
      <div className="feature-pie-legend">
        {features.map((f, i) => (
          <div className="feature-pie-legend-item" key={f.name}>
            <span className="feature-pie-legend-color" style={{ background: colors[i % colors.length] }} />
            <span>{f.name} ({((f.value/total)*100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
