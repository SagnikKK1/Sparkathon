import React from 'react';
import '../../components_css/dashboard_css/chatbot.css';

export const DashboardChatbotTile: React.FC = () => {
  const handleChat = () => window.location.href = '/chatbot';
  const handleReport = () => window.location.href = '/generate-report';
  const handleDownload = () => window.location.href = '/download-raw';

  return (
    <div className="chatbot-card">
      <div className="chatbot-title">Actions</div>
      <div className="chatbot-actions">
        <button className="chatbot-action-btn" onClick={handleChat}>
          <span role="img" aria-label="Chat">💬</span> Quick Chat
        </button>
        <button className="chatbot-action-btn" onClick={handleReport}>
          <span role="img" aria-label="Report">📄</span> Generate Report
        </button>
        <button className="chatbot-action-btn" onClick={handleDownload}>
          <span role="img" aria-label="Download">⬇️</span> Download Data
        </button>
      </div>
    </div>
  );
};
