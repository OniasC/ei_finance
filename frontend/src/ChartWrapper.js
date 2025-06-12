import React from "react";

// This is a placeholder for your chart. Replace with a real chart library later.
export default function ChartWrapper({ data }) {
  return (
    <div style={{ margin: "2em 0" }}>
      <h2>Sample Chart (Hardcoded Data)</h2>
      <svg width={300} height={150}>
        {/* Draw bars for each value */}
        {data.values.map((val, idx) => (
          <rect
            key={idx}
            x={idx * 50 + 30}
            y={150 - val * 5}
            width={30}
            height={val * 5}
            fill="#4e79a7"
          />
        ))}
        {/* Draw labels */}
        {data.labels.map((label, idx) => (
          <text
            key={label}
            x={idx * 50 + 45}
            y={145}
            fontSize={12}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}