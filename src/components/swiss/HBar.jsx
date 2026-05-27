import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissHBarSlide({ page = '05', title, kicker, label, rows }) {
  return (
    <SwissSlide layout="S07" animate="bar-grow">
      <CanvasCard>
        <Chrome left={`${page} · RANKING`} right="S07" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2vw', alignItems: 'center' }}>
            <div className="t-cat">{label}</div>
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
          </div>
          <div className="h-bar-chart">
            {rows.map((row) => (
              <React.Fragment key={row.label}>
                <div className="row-lbl">{row.label}</div>
                <div className="row-track"><div className={`row-fill ${row.accent ? 'accent' : ''}`} style={{ width: row.width }} /></div>
                <div className="row-val">{row.value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}
