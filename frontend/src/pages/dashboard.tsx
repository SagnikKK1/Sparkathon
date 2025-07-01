import React from 'react';
import { DashboardViralityScore } from '../components/dashboard/virality';
import { DashboardFeatureSentimentBarChart } from '../components/dashboard/features';
import { DashboardSentimentLineChart } from '../components/dashboard/sentiment';
import { DashboardChatbotTile } from '../components/dashboard/chatbot';
import '../pages_css/dashboard_page.css';

export const DashboardPage: React.FC = () => {
  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    // Implement logout logic here
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="dashboard-title">
          <span className="project-name">Project Name</span>
          <span className="dashboard-label">Dashboard</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="dashboard-grid">
        <div className="dashboard-tile"><DashboardViralityScore /></div>
        <div className="dashboard-tile"><DashboardFeatureSentimentBarChart /></div>
        <div className="dashboard-tile"><DashboardSentimentLineChart /></div>
        <div className="dashboard-tile"><DashboardChatbotTile /></div>
      </div>
    </div>
  );
};
