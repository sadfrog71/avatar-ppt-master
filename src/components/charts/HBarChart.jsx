import React from 'react';

export function HBarChart({ rows }) {
  return (
    <div className="h-bar-chart">
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <div className="row-lbl">{row.label}</div>
          <div className="row-track"><div className={`row-fill ${row.accent ? 'accent' : ''}`} style={{ width: row.width }} /></div>
          <div className="row-val">{row.value}</div>
        </React.Fragment>
      ))}
    </div>
  );
}
