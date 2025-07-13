// src/pages/AboutUs.tsx

import React from 'react';
import { Header } from '../components/home_page/home_header';
import '../pages_css/aboutus.css';
import { FaUsers, FaChartBar, FaRobot, FaFileAlt } from 'react-icons/fa';

export const AboutUs: React.FC = () => (
  <>
    <div className="blurred-ellipse"></div>
    <Header />

    <div className="aboutus-container">
      <div className="aboutus-left">
        <h1 className="aboutus-title">About Us</h1>
        <ul className="aboutus-features-list">
          <li>
            <span className="aboutus-feature-icon"><FaUsers /></span>
            <span>
              <b>Tap into authentic opinions:</b> Instantly aggregate and analyze real user reviews from Reddit and YouTube.
            </span>
          </li>
          <li>
            <span className="aboutus-feature-icon"><FaChartBar /></span>
            <span>
              <b>Visualize your strengths and weaknesses:</b> Our intuitive dashboards highlight what matters most for your product.
            </span>
          </li>
          <li>
            <span className="aboutus-feature-icon"><FaRobot /></span>
            <span>
              <b>Ask our AI chatbot:</b> Get instant, conversational insights and answers about your product’s reputation.
            </span>
          </li>
          <li>
            <span className="aboutus-feature-icon"><FaFileAlt /></span>
            <span>
              <b>Download comprehensive reports:</b> Export beautiful, actionable PDF reports for your team or stakeholders.
            </span>
          </li>
        </ul>
      </div>
      <div className="aboutus-right">
        <div className="aboutus-video-wrapper">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="About EchoDash"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aboutus-youtube"
          ></iframe>
        </div>
      </div>
    </div>
  </>
);
