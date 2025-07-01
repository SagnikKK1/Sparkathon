import React from 'react';
import { Header } from './home_header';
import { TextCarousel } from './carousel';
import '../../components_css/home_page_css/home_page.css'; // This will now contain ellipse styles

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <>
      {/* The blurred-ellipse div is now part of HomePage */}
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
          {/* Content for the right section will go here */}
        </div>
      </div>

      <footer className="home-page-footer">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </>
  );
};