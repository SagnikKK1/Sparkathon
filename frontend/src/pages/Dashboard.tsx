// src/pages/Dashboard.tsx

import HypeScoreGauge from "../components/HypeScoreGauge";
import SentimentTimelineChart from "../components/SentimentTimelineChart";
import Heatmap from "../components/Heatmap";
import Bar from "../components/Bar";
import FrequencyBar from "../components/FrequencyBar";
import TopicEvolution from "../components/TopicEvolution";
import Keywords from "../components/Keywords";
import Competitors from "../components/Competitors";
import Emotion from "../components/Emotion";
import RiskAlert from "../components/RiskAlert";
import MetricsTables from "../components/MetricsTables";
import ExplainabilityPanel from "../components/ExplainabilityPanel";
import DownloadReport from "../components/DownloadReport";

export default function Dashboard() {
  return (
    <div className="bg-background min-h-screen px-4 py-8 text-blue">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-yellowish text-3xl font-bold mb-2">Product Hype Dashboard</h1>
        <p className="text-blue text-lg">
          Real-time NLP-powered insights for your product launch.
        </p>
      </div>

      {/* TOP ROW: Hype Score & Risk Alert & Sentiment Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <HypeScoreGauge />
          <RiskAlert />
        </div>
        <div className="md:col-span-2">
          <SentimentTimelineChart />
        </div>
      </div>

      {/* SECOND ROW: Aspect Heatmap, Aspect Bar, Aspect Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Heatmap />
        <Bar />
        <FrequencyBar />
      </div>

      {/* THIRD ROW: Topic Evolution & Competitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TopicEvolution />
        <Competitors />
      </div>

      {/* FOURTH ROW: Keywords & Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Keywords />
        <Emotion />
      </div>

      {/* METRICS TABLE & EXPLAINABILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricsTables />
        <ExplainabilityPanel />
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="flex justify-end mt-8">
        <DownloadReport />
      </div>
    </div>
  );
}
