import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '../components/dashboard/header';
import '../pages_css/loading.css';
import {
  RedditLogo, YoutubeLogo, NERStep, SieveStep, GroupStep, MetricsStep, DashboardStep
} from '../components/loading/pipeline';
import '../components_css/loading_css/pipeline.css';
import { CircularLoader } from '../components/loading/loader';
import '../components_css/loading_css/loader.css';

const pipelineSteps = [
  {
    label: "Scraping Data from the Web",
    Visual: () => (
      <div className="logos-row">
        <RedditLogo />
        <YoutubeLogo />
      </div>
    ),
  },
  {
    label: "Named Entity Recognition (NER)",
    Visual: () => <NERStep />,
  },
  {
    label: "Filtering of Entities",
    Visual: () => <SieveStep />,
  },
  {
    label: "Grouping of Relevant Entities",
    Visual: () => <GroupStep />,
  },
  {
    label: "Calculating Important Metrics/Sentiments",
    Visual: () => <MetricsStep />,
  },
  {
    label: "Preparing Your Outputs/Dashboard",
    Visual: () => <DashboardStep />,
  },
];

export const Loading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.round(((currentStep + 1) / pipelineSteps.length) * 100));
    const stepTimeout = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, 3000);

    return () => {
      clearTimeout(stepTimeout);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep >= pipelineSteps.length) {
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    }
  }, [currentStep]);

  if (currentStep >= pipelineSteps.length) return null;

  const Step = pipelineSteps[currentStep];

  return (
    <div className="loading-page">
      <div className="blurred-ellipse"></div>
      <div className="loading-header-wrapper">
        <DashboardHeader onBack={() => {}} onLogout={() => window.location.href = '/login'} />
      </div>
      <div className="loading-main-content">
        <h1 className="loading-title">Preparing Your Dashboard</h1>
        <div className="pipeline-single-step">
          <Step.Visual />
        </div>
        <CircularLoader progress={progress} size={80} strokeWidth={8} />
        <div className="pipeline-label">{Step.label}</div>
        {/* <div className="loading-message">
          {Step.label}...
        </div> */}
      </div>
    </div>
  );
};
