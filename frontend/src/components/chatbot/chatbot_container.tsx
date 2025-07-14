// ChatbotContainer.tsx (with string matching for both "how is the camera?" and "how is the battery life?" placeholder responses)

import React, { useState } from 'react';
import '../../components_css/chatbot_css//chatbot_container.css';
import ChatHistory from './chat_history';
import ChatInputBar from './chat_input_bar';

// Placeholder bot response for "how is the camera?"
const CAMERA_RESPONSE = `🧠 Answer with Sources:
The camera receives generally positive feedback, with many users praising its quality as "best in its price range" and highlighting features like the main sensor, auto-enhance, and pro mode for photography/videography [S1]. However, opinions are mixed—some report stability issues, front camera malfunctions post-updates, or find performance "average" compared to alternatives [S2][S3]. Sentiment analysis shows moderate positivity (avg. 0.26) with notable praise for value but occasional reliability concerns. While ideal for casual users and enthusiasts, those prioritizing advanced features may seek higher-end models.

[S1]
Topic: 16
Comments:
  - "Ihate realmes large camera design this design is good"
  - "no other phone in that price segment offers a main cam with similar stats."
  - "I am using 10 days phone good phone and best camera quality 👍"

[S2]
Topic: 7
Comments:
  - "camera bekar hai radi phone h"
  - "Camera bhi kuch khash nhi hai"
  - "Sar photoshoot karne ke liye phone kaisa hai🤳"

[S3]
Topic: 7
Comments:
  - "Camera ka sound hai😅"
  - "Kya yahi phone 20 thousand ke niche Best Camera 📸 Phone ho sakta hai ?"
  - "Camera bahut badhiya hai iska"
`;

// Placeholder bot response for "how is the battery life?"
const BATTERY_RESPONSE = `🧠 Answer with Sources:
The battery life receives mixed feedback. While some users describe it as "okiesh" with 5-6 hours of screen time on moderate use [S1], others report issues like rapid draining [S3] or express disappointment in its performance [S2]. Sentiment analysis reflects cautious optimism (avg. 0.21), though experiences vary. A few note improvements post-software updates, but overall, it is seen as average for typical use cases rather than exceptional.

[S1]
Topic: 16
Comments:
  - "Ihate realmes large camera design this design is good"
  - "no other phone in that price segment offers a main cam with similar stats."
  - "I am using 10 days phone good phone and best camera quality 👍"

[S3]
Topic: 4
Comments:
  - "Tengo el mismo celular y confirmo que es al agua muy bueno y rapido..."
  - "Estamos comparando dos gamas distintas . No tiene sentido"
  - "Yo lo tengo  pero es algo que mejor prefiero seguir con la duda 😅"

[S2]
Topic: 3
Comments:
  - "Tengo el mismo celular y confirmo que es al agua muy bueno y rapido..."
  - "En el centro clásico se puede apreciar más el color que le puedas poner ,por tanto me gusta más ❤"
  - "Lo que si, obligatorio ponerle una Gcam porque flaquea en fotos con la camara principal, en video y lo demas, las fotos estan muy bien."
`;

const DEFAULT_RESPONSE = "Sorry, I don't have an answer for that. Please try asking about the camera or battery life!";

const ChatbotContainer: React.FC = () => {
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: 'user' | 'bot' }[]
  >([]);

  const handleSend = (userText: string, _botText: string) => {
    // Normalize user input for matching
    const normalized = userText.trim().toLowerCase();

    let botText = DEFAULT_RESPONSE;
    if (normalized === "how is the camera?") {
      botText = CAMERA_RESPONSE;
    } else if (normalized === "how is the battery life?") {
      botText = BATTERY_RESPONSE;
    }

    setMessages(prev => [
      ...prev,
      { id: prev.length, text: userText, sender: 'user' },
      { id: prev.length + 1, text: botText, sender: 'bot' }
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
