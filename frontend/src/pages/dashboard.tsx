import React from 'react';
import { DashboardHeader } from '../components/dashboard/header';
import { DashboardViralityScore } from '../components/dashboard/virality';
import { DashboardFeatureSentimentBarChart } from '../components/dashboard/features';
import { DashboardSentimentLineChart } from '../components/dashboard/sentiment';
import { DashboardChatbotTile } from '../components/dashboard/chatbot';
import '../pages_css/dashboard.css';

export const DashboardPage: React.FC = () => {
  const handleBack = () => window.history.back();
  const handleLogout = () => window.location.href = '/login';

  return (
    <div className="dashboard-outer">
      <div className="blurred-ellipse"></div>
      <DashboardHeader onBack={handleBack} onLogout={handleLogout} />
      <div className="dashboard-grid">
        <div className="dashboard-tile"><DashboardViralityScore /></div>
        <div className="dashboard-tile"><DashboardFeatureSentimentBarChart /></div>
        <div className="dashboard-tile"><DashboardSentimentLineChart /></div>
        <div className="dashboard-tile"><DashboardChatbotTile /></div>
      </div>
    </div>
  );
};
