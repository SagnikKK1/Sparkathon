import React from 'react';
import '../../components_css/chatbot_css/chat_history.css';
import ChatMessage from './chat_message';

type Message = { id: number; text: string; sender: 'user' | 'bot' };

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => (
  <div className="rag-chat-history">
    {messages.map(msg => (
      <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
    ))}
  </div>
);

export default ChatHistory;
