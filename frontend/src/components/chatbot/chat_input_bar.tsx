import React, { useState } from 'react';
import '../../components_css/chatbot_css/chat_input_bar.css';

interface ChatInputBarProps {
  onSend: (userText: string, botText: string) => void; // Parent will handle botText
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);

    // No backend call, just notify parent
    onSend(trimmed, ''); // Parent will decide the botText based on userText

    setInput('');
    setLoading(false);
  };

  return (
    <div className="rag-chat-input-bar">
      <input
        className="rag-chat-input"
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
        placeholder="Type your question..."
        disabled={loading}
      />
      <button
        className="rag-chat-send-btn"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default ChatInputBar;
