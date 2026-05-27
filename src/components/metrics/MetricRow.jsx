import React from 'react';

export function MetricRow({ metrics }) {
  return (
    <div className="kpi-row-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="kpi-cell">
          <div className="lbl">{metric.label}</div>
          <div className="nb">{metric.value}</div>
          <p className="note">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}
