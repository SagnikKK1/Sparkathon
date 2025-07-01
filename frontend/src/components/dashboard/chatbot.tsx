import React from 'react';
import '../../components_css/dashboard_css/chatbot.css';

export const DashboardChatbotTile: React.FC = () => {
  const handleChatClick = () => {
    window.location.href = '/chatbot'; // Will navigate to chatbot page (to be created)
  };

  return (
    <div className="chatbot-tile">
      <div className="chatbot-favicon">
        <span role="img" aria-label="Chatbot">🤖</span>
      </div>
      <div className="chatbot-title">Talk to our Chatbot</div>
      <button className="chatbot-button" onClick={handleChatClick}>
        Chat Now
      </button>
    </div>
  );
};
