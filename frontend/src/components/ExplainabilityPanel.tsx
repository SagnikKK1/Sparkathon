import React, { useState } from "react";

export default function ExplainabilityPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <button
        className="text-blue font-semibold mb-2"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide" : "Show"} Explanations & Suggestions
      </button>
      {open && (
        <div className="text-blue">
          <p>
            <span className="text-yellowish font-bold">Hype Score:</span>{" "}
            Calculated using sentiment, buzz volume, emotion positivity, topic
            diversity, and aspect sentiment.
          </p>
          <p>
            <span className="text-positive font-bold">Suggestions:</span> Focus
            on improving aspects with negative sentiment. Monitor emerging
            topics for potential issues.
          </p>
        </div>
      )}
    </div>
  );
}
