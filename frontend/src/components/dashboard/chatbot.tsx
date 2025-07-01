import React from 'react';
import ChatbotImage from '../dashboard/chatBot.png'; // Adjust path if needed
import '../../components_css/dashboard_css/chatbot.css';

export const DashboardChatbotTile: React.FC = () => {
  const handleChatClick = () => {
    window.location.href = '/chatbot';
  };

  return (
    <div className="chatbot-card">
      <div className="chatbot-image-wrapper">
        <img src={ChatbotImage} alt="Chatbot" className="chatbot-image" />
      </div>
      <div className="chatbot-title">Talk to our Chatbot</div>
      <button className="chatbot-btn" onClick={handleChatClick}>
        Chat Now
      </button>
    </div>
  );
};
