import Lottie from "lottie-react";

// Import your Lottie JSON files
import redditAnim from "../../assets/pipeline/reddit.json";
import youtubeAnim from "../../assets/pipeline/youube.json";
import nerAnim from "../../assets/pipeline/ner.json";
import sieveAnim from "../../assets/pipeline/sieve.json";
import groupAnim from "../../assets/pipeline/group.json";
import metricsAnim from "../../assets/pipeline/metrics.json";
import dashboardAnim from "../../assets/pipeline/dashboard.json";

export const RedditLogo = () => (
  <Lottie animationData={redditAnim} loop style={{ width: 320, height: 220 }} />
);

export const YoutubeLogo = () => (
  <Lottie animationData={youtubeAnim} loop style={{ width: 320, height: 220 }} />
);

export const NERStep = () => (
  <Lottie animationData={nerAnim} loop style={{ width: 320, height: 220 }} />
);

export const SieveStep = () => (
  <Lottie animationData={sieveAnim} loop style={{ width: 320, height: 220 }} />
);

export const GroupStep = () => (
  <Lottie animationData={groupAnim} loop style={{ width: 320, height: 220 }} />
);

export const MetricsStep = () => (
  <Lottie animationData={metricsAnim} loop style={{ width: 320, height: 220 }} />
);

export const DashboardStep = () => (
  <Lottie animationData={dashboardAnim} loop style={{ width: 320, height: 220 }} />
);
