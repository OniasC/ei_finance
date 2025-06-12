import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Brush
} from "recharts";

export default function ChartWrapper({ labels, series }) {
  // Build chart data for Recharts
  const chartData = labels.map((label, i) => {
    const point = { name: label };
    series.forEach(s => {
      point[s.name] = s.values[i];
    });
    return point;
  });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Monthly Values</h2>
      <ResponsiveContainer>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {series.map((s, idx) =>
            s.type === "bar" ? (
              <Bar key={s.name} dataKey={s.name} fill={s.color || "#4e79a7"} />
            ) : (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color || "#e15759"}
                strokeWidth={2}
                dot
              />
            )
          )}
          <Brush dataKey="name" height={20} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}