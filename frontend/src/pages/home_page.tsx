import React, { useState } from 'react';
import { Header } from '../components/home_page/home_header';
import { TextCarousel } from '../components/home_page/carousel';
import '.././pages_css/home_page.css';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [sources, setSources] = useState<{ reddit: boolean; youtube: boolean }>({ reddit: false, youtube: false });
  const navigate = useNavigate();

  const isFormComplete = category.trim() && product.trim() && (sources.reddit || sources.youtube);

  const handleSourceChange = (source: 'reddit' | 'youtube') => {
    setSources((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  const handleGenerate = () => {
    if (isFormComplete) {
      navigate('/loading');
    }
  };

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

          {/* --- Add the form here, do not wrap or move anything else --- */}
          <div className="homepage-form-section">
            <div className="homepage-form-row">
              <label htmlFor="category" className="homepage-form-label">Product Category</label>
              <input
                id="category"
                className="homepage-form-input"
                type="text"
                placeholder="e.g. Smartphone"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>
            <div className="homepage-form-row">
              <label htmlFor="product" className="homepage-form-label">Product Name</label>
              <input
                id="product"
                className="homepage-form-input"
                type="text"
                placeholder="e.g. iPhone 15"
                value={product}
                onChange={e => setProduct(e.target.value)}
              />
            </div>
            <div className="homepage-form-row">
              <div className="homepage-form-label">Choose sources from which you want to analyse data:</div>
              <div className="homepage-form-checkboxes">
                <label className="homepage-checkbox-label">
                  <input
                    type="checkbox"
                    checked={sources.reddit}
                    onChange={() => handleSourceChange('reddit')}
                  />
                  Reddit
                </label>
                <label className="homepage-checkbox-label">
                  <input
                    type="checkbox"
                    checked={sources.youtube}
                    onChange={() => handleSourceChange('youtube')}
                  />
                  YouTube
                </label>
              </div>
            </div>
            <button
              className={`homepage-generate-btn${isFormComplete ? ' active' : ''}`}
              disabled={!isFormComplete}
              onClick={handleGenerate}
            >
              Generate Result
            </button>
          </div>
        </div>
        <div className="right-content-section"></div>
      </div>

      <footer className="home-page-footer">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </>
  );
};
