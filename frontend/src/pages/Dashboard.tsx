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
    <div className="bg-background min-h-screen px-6 py-10 text-blue">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-yellowish text-4xl font-bold mb-1">Product Hype Dashboard</h1>
        <p className="text-blue text-lg">
          Real-time NLP-powered insights for your product launch.
        </p>
      </div>

      {/* Top KPIs: Hype Score & Risk Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col gap-4">
          <HypeScoreGauge />
          <RiskAlert />
        </div>
        <div className="md:col-span-2">
          <SentimentTimelineChart />
        </div>
      </div>

      {/* Aspect Analysis: Heatmap, Bar, Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Heatmap />
        <Bar />
        <FrequencyBar />
      </div>

      {/* Topic & Competitor Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <TopicEvolution />
        <Competitors />
      </div>

      {/* Keywords & Emotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Keywords />
        <Emotion />
      </div>

      {/* Metrics Table & Explainability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <MetricsTables />
        <ExplainabilityPanel />
      </div>

      {/* Download Button */}
      <div className="flex justify-end mt-8">
        <DownloadReport />
      </div>
    </div>
  );
}
