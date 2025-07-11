import React, { useState } from 'react';
import { Header } from '../components/home_page/home_header';
import { TextCarousel } from '../components/home_page/carousel';
import '.././pages_css/home_page.css';
import { useNavigate } from 'react-router-dom';
import { AnimatedCarousel } from '../components/home_page/animated_carousel';

interface HomePageProps { }

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
      // Make sure to use the correct backend URL
      // Update this URL to match your backend server
      const backendUrl = (window as any).env?.REACT_APP_BACKEND_URL || 'http://localhost:3000';
      
      console.log('Making request to:', `${backendUrl}/api/pipeline/run-all`);
      console.log('Request payload:', {
        product: product,
        product_type: category,
        video_limit: numberOfVideos,
        since: beginTime,
      });

      const response = await fetch(`${backendUrl}/api/pipeline/run-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: product,
          product_type: category,
          video_limit: numberOfVideos,
          since: beginTime,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // If the response is not OK, handle the error
      if (!response.ok) {
        let errorMsg = `HTTP error! Status: ${response.status}`;
        
        // Try to get the response text first
        const responseText = await response.text();
        console.log('Error response text:', responseText);
        
        // Check if the response is JSON
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (jsonError) {
          // If it's not JSON, use the text as the error message
          errorMsg = responseText || errorMsg;
        }
        
        throw new Error(errorMsg);
      }

      // If successful, navigate to the loading page
      const result = await response.json();
      console.log('Success response:', result);
      navigate('/loading');

    } catch (error: unknown) {
      console.error('Error in handleGenerate:', error);
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

      <div className="content-sections-container">
        <div className="left-content-section">
          <p className="workflow-text">Workflow</p>
          <TextCarousel />
          <p className="description-text">
            Our platform intelligently scrapes user-generated reviews from Reddit and YouTube to uncover what real people are saying about your product. Using advanced natural language processing, machine learning, and AI, we transform scattered feedback into clean visual dashboards, in-depth reports, and an interactive RAG-powered chatbot — giving you powerful insights, fast decisions, and a clear competitive edge.
          </p>

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
        </div>
        <div className="right-content-section">
          <AnimatedCarousel/>
        </div>
      </div>

      <footer className="home-page-footer">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </>
  );
};