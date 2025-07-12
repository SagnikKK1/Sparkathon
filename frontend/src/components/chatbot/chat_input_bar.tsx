import React, { useState } from 'react';
import '../../components_css/chatbot_css/chat_input_bar.css';

interface ChatInputBarProps {
  onSend: (text: string) => void;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="rag-chat-input-bar">
      <input
        className="rag-chat-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="Type your question..."
      />
      <button
        className="rag-chat-send-btn"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInputBar;
