import React from 'react';
import { CanvasCard, Chrome, MetricRow, SwissSlide } from './primitives.jsx';

export function SwissTimelineSlide({ page = '03', title, kicker, nodes, metrics = [] }) {
  return (
    <SwissSlide layout="S02" animate="progression">
      <CanvasCard>
        <Chrome left={`${page} · YEAR TRAJECTORY`} right="S02" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div className="timeline-v">
            {nodes.map((node) => (
              <div key={node.label} className={`tl-node ${node.accent ? 'accent' : ''}`}>
                <div className="dot" />
                <div className="yr">{node.label}</div>
                <div className="multi">{node.value}</div>
                <div className="desc">{node.body}</div>
              </div>
            ))}
          </div>
          {metrics.length ? <MetricRow metrics={metrics} /> : null}
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}
