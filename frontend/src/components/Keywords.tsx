import React from "react";

const keywords = [
  { word: "battery", weight: 5 },
  { word: "fast", weight: 4 },
  { word: "charging", weight: 3 },
  { word: "design", weight: 2 },
  { word: "price", weight: 2 },
  { word: "heavy", weight: 1 },
];

export default function KeywordsCloud() {
  return (
    <div className="bg-background rounded-xl shadow p-6 border border-blue">
      <div className="text-yellowish text-lg font-semibold mb-2">
        Top Keywords/Entities
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {keywords.map((k) => (
          <span
            key={k.word}
            className="text-blue"
            style={{ fontSize: `${16 + k.weight * 6}px` }}
          >
            {k.word}
          </span>
        ))}
      </div>
    </div>
  );
}
