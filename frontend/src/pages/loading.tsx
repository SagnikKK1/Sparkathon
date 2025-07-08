import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '../components/dashboard/header';
import '../pages_css/loading.css';
import {
  RedditLogo, YoutubeLogo, NERSvg, SieveSvg, GroupSvg, MetricsSvg, DashboardSvg
} from '../components/loading/pipeline';
import '../components_css/loading_css/pipeline.css';
import { CircularLoader } from '../components/loading/loader';
import '../components_css/loading_css/loader.css';

const pipelineSteps = [
  {
    label: "Scraping Data from the Web",
    Visual: ({ glow }: { glow?: boolean }) => (
      <div className="logos-row">
        <RedditLogo glow={glow} />
        <YoutubeLogo glow={glow} />
      </div>
    ),
  },
  {
    label: "Named Entity Recognition (NER)",
    Visual: ({ glow }: { glow?: boolean }) => <NERSvg glow={glow} />,
  },
  {
    label: "Filtering of Entities",
    Visual: ({ glow }: { glow?: boolean }) => <SieveSvg glow={glow} />,
  },
  {
    label: "Grouping of Relevant Entities",
    Visual: ({ glow }: { glow?: boolean }) => <GroupSvg glow={glow} />,
  },
  {
    label: "Calculating Important Metrics/Sentiments",
    Visual: ({ glow }: { glow?: boolean }) => <MetricsSvg glow={glow} />,
  },
  {
    label: "Preparing Your Outputs/Dashboard",
    Visual: ({ glow }: { glow?: boolean }) => <DashboardSvg glow={glow} />,
  },
];

export const Loading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [glow, setGlow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setGlow(false);
    setProgress(Math.round(((currentStep + 1) / pipelineSteps.length) * 100));
    const glowTimeout = setTimeout(() => setGlow(true), 1800);
    const stepTimeout = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, 3000);

    return () => {
      clearTimeout(stepTimeout);
      clearTimeout(glowTimeout);
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
        <CircularLoader progress={progress} size={140} strokeWidth={11} />
        <div className="pipeline-single-step">
          <Step.Visual glow={glow} />
          <div className="pipeline-label">{Step.label}</div>
        </div>
        <div className="loading-message">
          {Step.label}...
        </div>
      </div>
    </div>
  );
};
