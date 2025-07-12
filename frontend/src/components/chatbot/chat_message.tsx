import React from 'react';
import '../../components_css/chatbot_css/chat_message.css';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'bot';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender }) => (
  <div
    className={`rag-chat-message ${sender}`}
    style={{
      background: sender === 'user' ? 'var(--tropical-indigo)' : 'var(--eerie-black)',
      color: 'var(--white)',
      alignSelf: sender === 'user' ? 'flex-end' : 'flex-start'
    }}
  >
    {text}
  </div>
);

export default ChatMessage;
