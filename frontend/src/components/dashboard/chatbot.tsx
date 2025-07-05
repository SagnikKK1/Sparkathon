import React from 'react';
import '../../components_css/dashboard_css/chatbot.css';
import ChatbotImage from '../../assets/chatbot_illustration.png';
import PdfImage from '../../assets/pdf_icon.png';
import RawDataImage from '../../assets/json_icon.png';

export const DashboardChatbotTile: React.FC = () => {
  const handleChat = () => window.location.href = '/chatbot';
  const handleReport = () => window.location.href = '/generate-report';
  const handleDownload = () => window.location.href = '/download-raw';

  return (
    <div className="chatbot-card">
      <div className="chatbot-title">Actions</div>
      <div className="chatbot-section chatbot-section-hover" onClick={handleChat} tabIndex={0}>
        <div className="chatbot-section-content">
          <img src={ChatbotImage} alt="Chatbot" className="chatbot-section-img" />
          <div className="chatbot-section-text">Ask our chatbot your questions</div>
        </div>
      </div>
      <div className="chatbot-divider" />
      <div className="chatbot-section chatbot-section-hover" onClick={handleDownload} tabIndex={0}>
        <div className="chatbot-section-content reverse">
          <div className="chatbot-section-text">Download raw scrapped data</div>
          <img src={RawDataImage} alt="Raw Data" className="chatbot-section-img" />
        </div>
      </div>
      <div className="chatbot-divider" />
      <div className="chatbot-section chatbot-section-hover" onClick={handleReport} tabIndex={0}>
        <div className="chatbot-section-content">
          <img src={PdfImage} alt="PDF Report" className="chatbot-section-img" />
          <div className="chatbot-section-text">Download detailed report</div>
        </div>
      </div>
    </div>
  );
};
