import React from 'react';
import { DashboardHeader } from '../components/dashboard/header';
import { DashboardViralityScore } from '../components/dashboard/virality';
import { DashboardFeatureSentimentBarChart } from '../components/dashboard/features';
import { FeatureContributionPieChart } from '../components/dashboard/contribution';
import { DashboardSentimentLineChart } from '../components/dashboard/sentiment';
import { BuzzHeatmap } from '../components/dashboard/heatmap';
import { DashboardChatbotTile } from '../components/dashboard/chatbot';
import '../pages_css/dashboard.css';

export const DashboardPage: React.FC = () => {
  const handleBack = () => window.history.back();
  const handleLogout = () => window.location.href = '/login';

  return (
    <div className="dashboard-outer">
      <div className="blurred-ellipse"></div>
      <DashboardHeader onBack={handleBack} onLogout={handleLogout} />
      <div className="dashboard-grid-6">
        <div className="dashboard-tile dashboard-tile-virality">
          <DashboardViralityScore />
        </div>
        <div className="dashboard-tile dashboard-tile-pie">
          <FeatureContributionPieChart />
        </div>
        <div className="dashboard-tile dashboard-tile-feature-sentiment">
          <DashboardFeatureSentimentBarChart />
        </div>
        <div className="dashboard-tile dashboard-tile-sentiment-time">
          <DashboardSentimentLineChart />
        </div>
        <div className="dashboard-tile dashboard-tile-heatmap">
          <BuzzHeatmap />
        </div>
        <div className="dashboard-tile dashboard-tile-chatbot">
          <DashboardChatbotTile />
        </div>
      </div>
    </div>
  );
};
