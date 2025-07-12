import React from 'react';
import '.././pages_css/chatbot.css';
import ChatbotContainer from '../components/chatbot/chatbot_container';

const ChatbotPage: React.FC = () => (
  <div className="chatbot-page-root">
    <ChatbotContainer />
  </div>
);

export default ChatbotPage;
