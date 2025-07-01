import React, { useState, useEffect } from 'react';
import '../../components_css/home_page_css/carousel.css';

interface TextCarouselProps {}

export const TextCarousel: React.FC<TextCarouselProps> = () => {
  const texts = ["Graphical Analysis", "Report Generation", "RAG Chatbot"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // The total time for one text to be displayed and then transition out:
    // 2000ms (hold duration) + 500ms (transition duration) = 2500ms
    const intervalTime = 2000 + 500; 

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [texts.length]);

  return (
    <div className="text-carousel-wrapper">
      {texts.map((text, index) => {
        let positionClass = '';

        if (index === currentIndex) {
          positionClass = 'is-active';
        } 
        else if (index === (currentIndex + 1) % texts.length) {
          positionClass = 'is-above';
        } 
        else {
          positionClass = 'is-below';
        }

        return (
          <p key={index} className={`carousel-text ${positionClass}`}>
            {text}
          </p>
        );
      })}
    </div>
  );
};