import React, { useState } from 'react';
import '../../components_css/chatbot_css//chatbot_container.css';
import ChatHistory from './chat_history';
import ChatInputBar from './chat_input_bar';

const ChatbotContainer: React.FC = () => {
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: 'user' | 'bot' }[]
  >([]);

  const handleSend = (userText: string) => {
    setMessages(prev => [
      ...prev,
      { id: prev.length, text: userText, sender: 'user' },
      { id: prev.length + 1, text: 'This is a sample RAG response.', sender: 'bot' }
    ]);
  };

  return (
    <div className="rag-chatbot-main-container">
      <div className="rag-chatbot-chat-box">
        <ChatHistory messages={messages} />
      </div>
      <div className="rag-chatbot-input-box">
        <ChatInputBar onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatbotContainer;
