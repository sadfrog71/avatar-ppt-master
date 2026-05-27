import React from 'react';

export function StatGrid({ stats }) {
  return (
    <div className="grid-6" style={{ marginTop: '6vh' }}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={`stat-card ${stat.accent || index === 1 ? 'accent-top' : ''}`} data-anim>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-nb">{stat.value}</div>
          <div className="stat-note">{stat.note}</div>
        </div>
      ))}
    </div>
  );
}
