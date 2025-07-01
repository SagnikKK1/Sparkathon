import React from 'react';
import { Header } from '../components/home_page/home_header';
import { TextCarousel } from '../components/home_page/carousel';
import '.././pages_css/home_page.css';

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <>
      <div className="blurred-ellipse"></div> 
      <Header />

      <div className="content-sections-container">
        <div className="left-content-section">
          <p className="workflow-text">Workflow</p>
          <TextCarousel />
          <p className="description-text">
            Our platform intelligently scrapes user-generated reviews from Reddit and YouTube to uncover what real people are saying about your product. Using advanced natural language processing, machine learning, and AI, we transform scattered feedback into clean visual dashboards, in-depth reports, and an interactive RAG-powered chatbot — giving you powerful insights, fast decisions, and a clear competitive edge.
          </p>
        </div>
        <div className="right-content-section">
        </div>
      </div>

      <footer className="home-page-footer">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </>
  );
};