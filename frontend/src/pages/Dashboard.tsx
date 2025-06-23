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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <HypeScoreGauge />
          <RiskAlert />
        </div>
        <div className="lg:col-span-2">
          <SentimentTimelineChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Heatmap />
        <Bar />
        <FrequencyBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TopicEvolution />
        <Competitors />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Keywords />
        <Emotion />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <MetricsTables />
        <ExplainabilityPanel />
      </div>

      <div className="flex justify-end mt-4">
        <DownloadReport />
      </div>
    </div>
  );
}
