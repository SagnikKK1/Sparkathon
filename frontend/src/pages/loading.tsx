import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '../components/dashboard/header'; // adjust path if needed
import '../pages_css/loading.css';

const pipelineSteps = [
  { label: "Scraping comments", icon: "📝" },
  { label: "Analyzing sentiment", icon: "💡" },
  { label: "Training ML models", icon: "🤖" },
  { label: "Generating insights", icon: "📊" },
  { label: "Finalizing dashboard", icon: "🚀" },
];

export const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate progress
    if (progress < 100) {
      const timeout = setTimeout(() => {
        setProgress(p => Math.min(p + Math.random() * 12 + 6, 100));
      }, 650);
      return () => clearTimeout(timeout);
    } else {
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    }
  }, [progress]);

  useEffect(() => {
    // Update current pipeline step based on progress
    const step = Math.min(
      Math.floor((progress / 100) * pipelineSteps.length),
      pipelineSteps.length - 1
    );
    setCurrentStep(step);
  }, [progress]);

  return (
    <div className="loading-page">
      <DashboardHeader onBack={() => {}} onLogout={() => window.location.href = '/login'} />
      <div className="loading-content">
        <h1 className="loading-title">Preparing Your Dashboard</h1>
        <div className="pipeline-container">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.label}
              className={`pipeline-step${idx < currentStep ? " done" : idx === currentStep ? " active" : ""}`}
            >
              <div className="pipeline-icon">{step.icon}</div>
              <div className="pipeline-label">{step.label}</div>
              {idx < pipelineSteps.length - 1 && (
                <div className="pipeline-arrow" />
              )}
            </div>
          ))}
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-bar-label">{Math.floor(progress)}%</div>
        </div>
        <div className="loading-message">
          {pipelineSteps[currentStep].label}...
        </div>
      </div>
    </div>
  );
};
