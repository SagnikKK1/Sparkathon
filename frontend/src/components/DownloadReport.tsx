import React from "react";

export default function DownloadReportButton() {
  const handleDownload = () => {
    alert("Report download triggered!");
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue text-background rounded px-4 py-2 shadow hover:bg-yellowish hover:text-background transition"
    >
      Download Detailed Report
    </button>
  );
}
