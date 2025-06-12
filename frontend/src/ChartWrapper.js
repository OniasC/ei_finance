import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
  VictoryTheme,
  VictoryTooltip,
  VictoryZoomContainer // <-- import this
} from "victory";

export default function ChartWrapper({ labels, series }) {
  // Transform data for Victory
  const victorySeries = series.map(s => ({
    name: s.name,
    color: s.color,
    data: labels.map((label, i) => ({
      x: label,
      y: s.values[i]
    }))
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Monthly Values</h2>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
        height={300}
        width={600}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            allowZoom={true}
            allowPan={true}
          />
        }
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        {victorySeries.map((s, idx) => (
          <VictoryLine
            key={s.name}
            data={s.data}
            style={{
              data: { stroke: s.color || "#4e79a7", strokeWidth: 2 }
            }}
          />
        ))}
        <VictoryLegend
          x={100}
          y={10}
          orientation="horizontal"
          gutter={20}
          data={victorySeries.map(s => ({
            name: s.name,
            symbol: { fill: s.color || "#4e79a7" }
          }))}
        />
      </VictoryChart>
    </div>
  );
}