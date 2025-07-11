// src/pages/HomePage.tsx

import React, { useState } from 'react';
import { Header } from '../components/home_page/home_header';
import { TextCarousel } from '../components/home_page/carousel';
import { useNavigate } from 'react-router-dom';
import { Benefits } from '../components/home_page/benefits';
import '../pages_css/home_page.css';

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [numberOfVideos, setNumberOfVideos] = useState<number | ''>('');
  const [beginTime, setBeginTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const isFormComplete =
    category.trim() &&
    product.trim() &&
    numberOfVideos &&
    beginTime;

  const handleBeginTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeginTime(e.target.value);
  };

  const handleGenerate = async () => {
    if (!isFormComplete) return;

    setIsLoading(true);
    setError('');

    try {
      const backendUrl = (window as any).env?.REACT_APP_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendUrl}/api/pipeline/run-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product,
          product_type: category,
          video_limit: numberOfVideos,
          since: beginTime,
        }),
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! Status: ${response.status}`;
        const responseText = await response.text();
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          errorMsg = responseText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      await response.json();
      navigate('/loading');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Error starting pipeline: ' + error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="blurred-ellipse"></div>
      <Header />

      <div className="homepage-hero">
        <h1 className="homepage-title">EchoDash</h1>
        <h2 className="homepage-tagline">Hear the buzz. Understand the story.</h2>
        <Benefits />
      </div>

      <div className="workflow-section">
        <p className="workflow-text">Workflow</p>
        <TextCarousel />
        <p className="description-text">
          Our platform intelligently scrapes user-generated reviews from Reddit and YouTube to uncover what real people are saying about your product. Using advanced natural language processing, machine learning, and AI, we transform scattered feedback into clean visual dashboards, in-depth reports, and an interactive RAG-powered chatbot — giving you powerful insights, fast decisions, and a clear competitive edge.
        </p>
      </div>

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
          <label htmlFor="number-of-videos" className="homepage-form-label">Number of Videos</label>
          <input
            id="number-of-videos"
            className="homepage-form-input"
            type="number"
            min={1}
            placeholder="e.g. 10"
            value={numberOfVideos}
            onChange={e => setNumberOfVideos(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="homepage-form-row">
          <label htmlFor="begin-time" className="homepage-form-label">Begin Time</label>
          <input
            id="begin-time"
            className={`homepage-form-input ${beginTime ? 'date-input-filled' : 'date-input-empty'}`}
            type="date"
            value={beginTime}
            onChange={handleBeginTimeChange}
            placeholder="dd/mm/yyyy"
            pattern="\d{2}/\d{2}/\d{4}"
          />
        </div>
        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: 8 }}>
            {error}
          </div>
        )}
        <button
          className={`homepage-generate-btn${isFormComplete ? ' active' : ''}`}
          disabled={!isFormComplete || isLoading}
          onClick={handleGenerate}
        >
          {isLoading ? 'Starting Pipeline...' : 'Generate Result'}
        </button>
      </div>

      <footer className="home-page-footer">
        <p>&copy; 2023 echoDash. All rights reserved.</p>
      </footer>
    </>
  );
};
