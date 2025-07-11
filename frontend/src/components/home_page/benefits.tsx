// src/components/home_page/LottieBenefitRow.tsx

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import '../../components_css/home_page_css/lottie_benefit_row.css';

import opinionsAnim from '../../assets/homepage/opinions.json';
import dashboardAnim from '../../assets/homepage/dashboards.json';
import chatbotAnim from '../../assets/homepage/chatbot.json';
import reportAnim from '../../assets/homepage/reports.json';

const lotties = [
  { animation: opinionsAnim, label: "See what real users say" },
  { animation: dashboardAnim, label: "Intuitive Visual Dashboard" },
  { animation: chatbotAnim, label: "Ask our AI Chatbot" },
  { animation: reportAnim, label: "Download Comprehensive Reports" },
];

export const Benefits: React.FC = () => {
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlighted(prev => (prev + 1) % lotties.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="benefits-row">
      {lotties.map((item, idx) => (
        <div
          key={idx}
          className={`benefits-item${highlighted === idx ? ' highlighted' : ''}`}
          onMouseEnter={() => setHighlighted(idx)}
        >
          <div className="benefits-animation">
            <Lottie
              animationData={item.animation}
              loop
              style={{ width: 140, height: 140 }}
            />
          </div>
          <div className="benefits-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};
