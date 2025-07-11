import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import '../../components_css/home_page_css/lottie_carousel.css';

// Import your Lottie JSONs
import opinionsAnim from '../../assets/homepage/opinions.json';
import dashboardAnim from '../../assets/homepage/dashboard.json';
import chatbotAnim from '../../assets/homepage/chatbot.json';
import reportAnim from '../../assets/homepage/report.json';

const lotties = [
  { animation: opinionsAnim, label: "See what real users say" },
  { animation: dashboardAnim, label: "Intuitive Visual Dashboard" },
  { animation: chatbotAnim, label: "Ask our AI Chatbot" },
  { animation: reportAnim, label: "Download Comprehensive Reports" },
];

export const LottieCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalTime = 2500;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lotties.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lottie-carousel-wrapper">
      {lotties.map((item, index) => {
        let positionClass = '';
        if (index === currentIndex) {
          positionClass = 'is-active';
        } else if (index === (currentIndex + 1) % lotties.length) {
          positionClass = 'is-above';
        } else {
          positionClass = 'is-below';
        }
        return (
          <div key={index} className={`carousel-lottie-slide ${positionClass}`}>
            <Lottie
              animationData={item.animation}
              loop
              style={{ width: 180, height: 180, margin: '0 auto' }}
            />
            <div className="carousel-lottie-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};
